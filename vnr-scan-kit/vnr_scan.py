#!/usr/bin/env python3
"""
VNR SCAN v2.0 — Intelligent Cleanup Tool
Voss Neural Research LLC
www.vossneuralresearch.com

Self-contained forensic scanner + cleaner for AI platform tracker persistence.
Zero external dependencies. Runs on Python 3.8+ (Windows).

Usage:
    python vnr_scan.py              # Full pipeline: scan → clean → verify → diagnose
    python vnr_scan.py --scan-only  # Phase 1 only (no modifications)
    python vnr_scan.py --help       # Show help
"""

import os
import sys
import json
import glob
import shutil
import ctypes
import subprocess
import argparse
import datetime
import struct
import time

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION — Expandable for future platform audits
# ═══════════════════════════════════════════════════════════════════════════════

VERSION = "2.0.0"

# Keywords to hunt for in LevelDB files (binary search)
TRACKER_KEYWORDS = [
    b"suno", b"hcaptcha", b"binance", b"ethereum", b"chainId",
    b"statsig", b"segment", b"clarity", b"braze", b"tapad",
    b"criteo", b"doubleclick", b"amplitude", b"datadoghq",
    b"sentry.io", b"connect.facebook.net",
]

# System file keywords (for Recent files, Downloads, etc.)
SYSTEM_KEYWORDS = ["suno", "hcaptcha", "vnr-scan"]

# Browser profiles to scan
BROWSER_PROFILES = {
    "Chrome": os.path.join(os.environ.get("LOCALAPPDATA", ""), "Google", "Chrome", "User Data"),
    "Brave": os.path.join(os.environ.get("LOCALAPPDATA", ""), "BraveSoftware", "Brave-Browser", "User Data"),
    "Edge": os.path.join(os.environ.get("LOCALAPPDATA", ""), "Microsoft", "Edge", "User Data"),
    "Comet": os.path.join(os.environ.get("LOCALAPPDATA", ""), "Perplexity", "Comet", "User Data"),
}

# Artifact directories to check/clean per profile
ARTIFACT_DIRS = [
    "component_crx_cache",
    "optimization_guide_model_store",
    "Code Cache",
    os.path.join("Cache", "Cache_Data"),
    "ActorSafetyLists",
    "GPUCache",
]

# Tracker domains for LOCKER (hosts file)
LOCKER_DOMAINS = [
    # hCaptcha — crypto mining
    "hcaptcha.com", "newassets.hcaptcha.com", "imgs.hcaptcha.com",
    "js.hcaptcha.com", "accounts.hcaptcha.com",
    # Microsoft Clarity — GPU session replay
    "clarity.ms", "www.clarity.ms",
    # Cross-device fingerprinting
    "sdk.iad-03.braze.com", "bidder.criteo.com", "graph.tapad.com",
    # Google Ads / DoubleClick
    "pagead2.googlesyndication.com", "tpc.googlesyndication.com",
    "googleads.g.doubleclick.net", "ad.doubleclick.net",
    "stats.g.doubleclick.net",
    # Telemetry pipelines
    "o4506642992128000.ingest.us.sentry.io",
    "browser-intake-us5-datadoghq.com",
    "cdn.segment.com", "api.segment.io",
    "cdn.amplitude.com", "api2.amplitude.com",
    # Social graph
    "connect.facebook.net",
]

# DNS probe targets (verify LOCKER is working)
DNS_PROBE_DOMAINS = ["clarity.ms", "hcaptcha.com"]

# Browser process names (for kill step)
BROWSER_PROCESSES = ["chrome", "brave", "msedge", "Comet", "Perplexity"]


# ═══════════════════════════════════════════════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════════════════════════════════════════════

class Colors:
    """ANSI-ish colors via Windows console API fallback."""
    RESET = ""
    RED = ""
    GREEN = ""
    YELLOW = ""
    CYAN = ""
    BOLD = ""
    DIM = ""

    @staticmethod
    def init():
        """Enable ANSI colors on Windows 10+."""
        try:
            kernel32 = ctypes.windll.kernel32
            # Enable ENABLE_VIRTUAL_TERMINAL_PROCESSING
            kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
            Colors.RESET = "\033[0m"
            Colors.RED = "\033[91m"
            Colors.GREEN = "\033[92m"
            Colors.YELLOW = "\033[93m"
            Colors.CYAN = "\033[96m"
            Colors.BOLD = "\033[1m"
            Colors.DIM = "\033[2m"
        except Exception:
            pass  # Fallback: no colors


def is_admin():
    """Check if running with administrator privileges."""
    try:
        return ctypes.windll.shell32.IsUserAnAdmin() != 0
    except Exception:
        return False


def banner():
    c = Colors
    print(f"""
{c.CYAN}{'═' * 60}{c.RESET}
{c.BOLD}  VNR SCAN v{VERSION} — Intelligent Cleanup Tool{c.RESET}
{c.DIM}  Voss Neural Research LLC{c.RESET}
{c.DIM}  www.vossneuralresearch.com{c.RESET}
{c.CYAN}{'═' * 60}{c.RESET}
""")


def section(title, phase_num=None):
    c = Colors
    prefix = f"PHASE {phase_num}" if phase_num else ""
    print(f"\n{c.CYAN}  {'─' * 50}{c.RESET}")
    print(f"  {c.BOLD}{prefix}{': ' if prefix else ''}{title}{c.RESET}")
    print(f"{c.CYAN}  {'─' * 50}{c.RESET}")


def status(label, value, ok=True):
    c = Colors
    color = c.GREEN if ok else c.RED
    print(f"  {c.DIM}[{label}]{c.RESET} {color}{value}{c.RESET}")


def warning(msg):
    c = Colors
    print(f"  {c.YELLOW}⚠ {msg}{c.RESET}")


def info(msg):
    c = Colors
    print(f"  {c.DIM}  {msg}{c.RESET}")


def get_dir_size(path):
    """Get total size of directory in bytes."""
    total = 0
    try:
        for dirpath, dirnames, filenames in os.walk(path):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                try:
                    total += os.path.getsize(fp)
                except (OSError, PermissionError):
                    pass
    except (OSError, PermissionError):
        pass
    return total


def fmt_size(nbytes):
    """Format bytes to human-readable."""
    if nbytes == 0:
        return "0 B"
    for unit in ["B", "KB", "MB", "GB"]:
        if abs(nbytes) < 1024.0:
            return f"{nbytes:.1f} {unit}"
        nbytes /= 1024.0
    return f"{nbytes:.1f} TB"


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 1: SCAN
# ═══════════════════════════════════════════════════════════════════════════════

def find_browser_profiles(browser_user_data_path):
    """Find all profile dirs (Default, Profile 1, Profile 2, etc.)."""
    profiles = []
    if not os.path.isdir(browser_user_data_path):
        return profiles
    # Default profile
    default = os.path.join(browser_user_data_path, "Default")
    if os.path.isdir(default):
        profiles.append(("Default", default))
    # Numbered profiles
    for item in os.listdir(browser_user_data_path):
        if item.startswith("Profile "):
            p = os.path.join(browser_user_data_path, item)
            if os.path.isdir(p):
                profiles.append((item, p))
    return profiles


def scan_leveldb_keywords(profile_path):
    """Scan Local Storage LevelDB files for tracker keywords."""
    findings = []
    ls_path = os.path.join(profile_path, "Local Storage", "leveldb")
    if not os.path.isdir(ls_path):
        return findings

    for fname in os.listdir(ls_path):
        if not (fname.endswith(".ldb") or fname.endswith(".log")):
            continue
        fpath = os.path.join(ls_path, fname)
        try:
            with open(fpath, "rb") as f:
                data = f.read()
            for kw in TRACKER_KEYWORDS:
                if kw in data:
                    findings.append({
                        "file": fname,
                        "keyword": kw.decode("utf-8", errors="replace"),
                        "path": fpath,
                    })
        except (OSError, PermissionError):
            pass
    return findings


def scan_service_workers(profile_path):
    """Check Service Worker caches."""
    sw_path = os.path.join(profile_path, "Service Worker", "CacheStorage")
    result = {"exists": False, "size_bytes": 0, "path": sw_path}
    if os.path.isdir(sw_path):
        result["exists"] = True
        result["size_bytes"] = get_dir_size(sw_path)
    # Also check ScriptCache
    sc_path = os.path.join(profile_path, "Service Worker", "ScriptCache")
    if os.path.isdir(sc_path):
        result["size_bytes"] += get_dir_size(sc_path)
    return result


def scan_artifact_dirs(profile_path):
    """Check for known artifact directories."""
    found = []
    for artifact_dir in ARTIFACT_DIRS:
        full_path = os.path.join(profile_path, artifact_dir)
        if os.path.isdir(full_path):
            size = get_dir_size(full_path)
            found.append({
                "name": artifact_dir,
                "path": full_path,
                "size_bytes": size,
            })
    return found


def scan_locker_status():
    """Check if VNR LOCKER is installed in hosts file."""
    hosts_path = os.path.join(os.environ.get("SystemRoot", r"C:\Windows"),
                              "System32", "drivers", "etc", "hosts")
    result = {"installed": False, "path": hosts_path, "domains_blocked": 0}
    try:
        with open(hosts_path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()
        if "VNR SCAN" in content:
            result["installed"] = True
            # Count blocked domains
            for domain in LOCKER_DOMAINS:
                if domain in content:
                    result["domains_blocked"] += 1
    except (OSError, PermissionError):
        pass
    return result


def scan_dns_resolution():
    """Probe DNS to see if tracker domains resolve.

    Uses 'ping' instead of 'nslookup' because nslookup queries the configured
    DNS server directly (e.g. Cloudflare 1.1.1.1) and BYPASSES the hosts file.
    The hosts file is an OS-level override that only the system resolver respects,
    so ping (which uses the system resolver) is the correct test for LOCKER blocks.
    """
    results = {}
    for domain in DNS_PROBE_DOMAINS:
        try:
            output = subprocess.run(
                ["ping", "-n", "1", "-w", "1000", domain],
                capture_output=True, text=True, timeout=5
            )
            full_out = output.stdout + output.stderr
            # If ping resolves to 0.0.0.0 or fails to resolve, domain is blocked
            if "0.0.0.0" in full_out or "could not find" in full_out.lower() or "ping request could not find" in full_out.lower():
                results[domain] = "BLOCKED"
            elif output.returncode != 0 and "transmit failed" in full_out.lower():
                # 0.0.0.0 causes transmit failure on some Windows versions
                results[domain] = "BLOCKED"
            else:
                results[domain] = "RESOLVES"
        except (subprocess.TimeoutExpired, FileNotFoundError):
            results[domain] = "UNKNOWN"
    return results


def scan_system_artifacts():
    """Check system locations for Suno-related artifacts."""
    findings = []

    # Recent files
    recent_path = os.path.join(os.environ.get("APPDATA", ""),
                                "Microsoft", "Windows", "Recent")
    if os.path.isdir(recent_path):
        try:
            for f in os.listdir(recent_path):
                for kw in SYSTEM_KEYWORDS:
                    if kw.lower() in f.lower():
                        findings.append({
                            "location": "Recent Files",
                            "file": f,
                            "path": os.path.join(recent_path, f),
                        })
                        break
        except (OSError, PermissionError):
            pass

    # Downloads
    downloads_path = os.path.join(os.environ.get("USERPROFILE", ""), "Downloads")
    if os.path.isdir(downloads_path):
        try:
            for f in os.listdir(downloads_path):
                for kw in SYSTEM_KEYWORDS:
                    if kw.lower() in f.lower():
                        findings.append({
                            "location": "Downloads",
                            "file": f,
                            "path": os.path.join(downloads_path, f),
                        })
                        break
        except (OSError, PermissionError):
            pass

    # DNS cache (check for suno entries)
    try:
        dns_out = subprocess.run(
            ["powershell", "-Command",
             "Get-DnsClientCache | Where-Object { $_.EntryName -like '*suno*' } | Select-Object -ExpandProperty EntryName"],
            capture_output=True, text=True, timeout=10
        )
        for line in dns_out.stdout.strip().splitlines():
            line = line.strip()
            if line:
                findings.append({
                    "location": "DNS Cache",
                    "file": line,
                    "path": "system",
                })
    except (subprocess.TimeoutExpired, FileNotFoundError, OSError):
        pass

    return findings


def run_scan():
    """Execute Phase 1: Full forensic scan. Returns snapshot dict."""
    section("SCAN — Forensic Snapshot", phase_num=1)
    snapshot = {
        "timestamp": datetime.datetime.now().isoformat(),
        "version": VERSION,
        "browsers": {},
        "locker": {},
        "dns": {},
        "system_artifacts": [],
        "summary": {
            "browsers_detected": 0,
            "total_keyword_hits": 0,
            "total_artifact_dirs": 0,
            "total_sw_size_bytes": 0,
        }
    }

    # Browser scans
    for browser_name, user_data_path in BROWSER_PROFILES.items():
        profiles = find_browser_profiles(user_data_path)
        if not profiles:
            status(browser_name, "Not installed", ok=True)
            continue

        snapshot["summary"]["browsers_detected"] += 1
        snapshot["browsers"][browser_name] = {"profiles": {}}
        status(browser_name, f"Found ({len(profiles)} profile{'s' if len(profiles) > 1 else ''})", ok=True)

        for profile_name, profile_path in profiles:
            profile_data = {}

            # LevelDB keyword scan
            kw_hits = scan_leveldb_keywords(profile_path)
            profile_data["keyword_hits"] = kw_hits
            snapshot["summary"]["total_keyword_hits"] += len(kw_hits)
            if kw_hits:
                unique_kws = set(h["keyword"] for h in kw_hits)
                status(f"  {profile_name}/LevelDB",
                       f"{len(kw_hits)} hits: {', '.join(sorted(unique_kws))}", ok=False)
            else:
                status(f"  {profile_name}/LevelDB", "CLEAN", ok=True)

            # Service Worker
            sw_data = scan_service_workers(profile_path)
            profile_data["service_workers"] = sw_data
            snapshot["summary"]["total_sw_size_bytes"] += sw_data["size_bytes"]
            if sw_data["exists"]:
                status(f"  {profile_name}/ServiceWorker",
                       f"{fmt_size(sw_data['size_bytes'])}",
                       ok=sw_data["size_bytes"] < 10_000_000)  # >10MB is suspicious
            else:
                status(f"  {profile_name}/ServiceWorker", "CLEAN", ok=True)

            # Artifact dirs
            artifact_findings = scan_artifact_dirs(profile_path)
            profile_data["artifact_dirs"] = artifact_findings
            snapshot["summary"]["total_artifact_dirs"] += len(artifact_findings)
            if artifact_findings:
                total_art_size = sum(a["size_bytes"] for a in artifact_findings)
                status(f"  {profile_name}/Artifacts",
                       f"{len(artifact_findings)} dirs ({fmt_size(total_art_size)})", ok=False)
            else:
                status(f"  {profile_name}/Artifacts", "CLEAN", ok=True)

            snapshot["browsers"][browser_name]["profiles"][profile_name] = profile_data

    # LOCKER status
    print()
    locker = scan_locker_status()
    snapshot["locker"] = locker
    if locker["installed"]:
        status("DNS LOCKER",
               f"ACTIVE ({locker['domains_blocked']}/{len(LOCKER_DOMAINS)} domains)", ok=True)
    else:
        status("DNS LOCKER", "NOT INSTALLED", ok=False)

    # DNS resolution
    dns = scan_dns_resolution()
    snapshot["dns"] = dns
    for domain, result in dns.items():
        status(f"DNS/{domain}", result, ok=(result == "BLOCKED"))

    # System artifacts
    sys_artifacts = scan_system_artifacts()
    snapshot["system_artifacts"] = sys_artifacts
    if sys_artifacts:
        status("System Artifacts", f"{len(sys_artifacts)} found", ok=False)
        for sa in sys_artifacts:
            info(f"{sa['location']}: {sa['file']}")
    else:
        status("System Artifacts", "CLEAN", ok=True)

    # Print summary
    s = snapshot["summary"]
    c = Colors
    print(f"\n  {c.BOLD}Scan Summary:{c.RESET}")
    print(f"    Browsers detected:    {s['browsers_detected']}")
    print(f"    Tracker keyword hits: {s['total_keyword_hits']}")
    print(f"    Artifact directories: {s['total_artifact_dirs']}")
    print(f"    ServiceWorker cache:  {fmt_size(s['total_sw_size_bytes'])}")

    return snapshot


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 2: CLEAN
# ═══════════════════════════════════════════════════════════════════════════════

def kill_browsers():
    """Kill all browser processes."""
    killed = []
    for proc_name in BROWSER_PROCESSES:
        try:
            result = subprocess.run(
                ["taskkill", "/F", "/IM", f"{proc_name}.exe"],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                killed.append(proc_name)
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
    return killed


def clean_artifact_dirs(snapshot):
    """Remove all artifact directories found in scan."""
    removed = 0
    for browser_name, browser_data in snapshot.get("browsers", {}).items():
        for profile_name, profile_data in browser_data.get("profiles", {}).items():
            for artifact in profile_data.get("artifact_dirs", []):
                try:
                    shutil.rmtree(artifact["path"], ignore_errors=True)
                    if not os.path.exists(artifact["path"]):
                        removed += 1
                except (OSError, PermissionError):
                    pass
    return removed


def clean_leveldb_files(snapshot):
    """Delete LevelDB files containing tracker keywords."""
    cleaned = 0
    cleaned_files = set()  # Avoid double-counting
    for browser_name, browser_data in snapshot.get("browsers", {}).items():
        for profile_name, profile_data in browser_data.get("profiles", {}).items():
            for hit in profile_data.get("keyword_hits", []):
                fpath = hit["path"]
                if fpath in cleaned_files:
                    continue
                try:
                    os.remove(fpath)
                    cleaned_files.add(fpath)
                    cleaned += 1
                except (OSError, PermissionError):
                    pass
    return cleaned


def clean_service_workers(snapshot):
    """Purge Service Worker caches."""
    purged = 0
    for browser_name, browser_data in snapshot.get("browsers", {}).items():
        for profile_name, profile_data in browser_data.get("profiles", {}).items():
            sw = profile_data.get("service_workers", {})
            if sw.get("exists"):
                sw_base = os.path.dirname(sw["path"])  # Service Worker dir
                try:
                    shutil.rmtree(sw_base, ignore_errors=True)
                    purged += 1
                except (OSError, PermissionError):
                    pass
    return purged


def install_locker(locker_status):
    """Install VNR LOCKER in hosts file if not present."""
    if locker_status.get("installed"):
        return False

    hosts_path = locker_status["path"]
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    locker_block = f"""
# ============================================
# VNR SCAN - LOCKER
# Suno AI Tracker Blocklist
# Installed: {timestamp}
# ============================================

# hCaptcha - crypto mining infrastructure
{chr(10).join(f'0.0.0.0 {d}' for d in LOCKER_DOMAINS[:5])}

# Microsoft Clarity - GPU session replay
{chr(10).join(f'0.0.0.0 {d}' for d in LOCKER_DOMAINS[5:7])}

# Cross-device fingerprinting
{chr(10).join(f'0.0.0.0 {d}' for d in LOCKER_DOMAINS[7:10])}

# Google Ads / DoubleClick
{chr(10).join(f'0.0.0.0 {d}' for d in LOCKER_DOMAINS[10:15])}

# Telemetry pipelines
{chr(10).join(f'0.0.0.0 {d}' for d in LOCKER_DOMAINS[15:21])}

# Facebook pixel
0.0.0.0 {LOCKER_DOMAINS[21]}
"""

    try:
        with open(hosts_path, "a", encoding="utf-8") as f:
            f.write(locker_block)
        return True
    except (OSError, PermissionError):
        return False


def flush_dns():
    """Flush system DNS cache."""
    try:
        subprocess.run(
            ["ipconfig", "/flushdns"],
            capture_output=True, timeout=10
        )
        return True
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False


def clean_system_artifacts(snapshot):
    """Remove system-level Suno artifacts (Recent files only — safe scope)."""
    removed = 0
    for sa in snapshot.get("system_artifacts", []):
        if sa["location"] == "Recent Files":
            try:
                os.remove(sa["path"])
                removed += 1
            except (OSError, PermissionError):
                pass
    return removed


def run_clean(snapshot):
    """Execute Phase 2: Targeted cleanup based on scan results."""
    section("CLEAN — Targeted Removal", phase_num=2)

    # Step 1: Kill browsers
    print()
    status("Browsers", "Terminating...", ok=True)
    killed = kill_browsers()
    if killed:
        status("Killed", ", ".join(killed), ok=True)
    else:
        status("Browsers", "None running", ok=True)

    # Brief pause for file handles to release
    time.sleep(2)

    # Step 2: Artifact directories
    artifact_count = clean_artifact_dirs(snapshot)
    status("Artifact dirs removed", str(artifact_count), ok=True)

    # Step 3: LevelDB files
    ldb_count = clean_leveldb_files(snapshot)
    status("LevelDB files cleaned", str(ldb_count), ok=True)

    # Step 4: Service Workers
    sw_count = clean_service_workers(snapshot)
    status("ServiceWorker caches purged", str(sw_count), ok=True)

    # Step 5: Install LOCKER
    locker_installed = install_locker(snapshot.get("locker", {}))
    if locker_installed:
        status("LOCKER", f"INSTALLED ({len(LOCKER_DOMAINS)} domains blocked)", ok=True)
    elif snapshot.get("locker", {}).get("installed"):
        status("LOCKER", "Already active", ok=True)
    else:
        status("LOCKER", "FAILED — check admin permissions", ok=False)

    # Step 6: DNS flush
    dns_flushed = flush_dns()
    status("DNS Cache", "FLUSHED" if dns_flushed else "FLUSH FAILED", ok=dns_flushed)

    # Step 7: System artifacts
    sys_removed = clean_system_artifacts(snapshot)
    if sys_removed:
        status("System artifacts removed", str(sys_removed), ok=True)

    return {
        "browsers_killed": killed,
        "artifact_dirs_removed": artifact_count,
        "leveldb_files_cleaned": ldb_count,
        "service_workers_purged": sw_count,
        "locker_installed": locker_installed,
        "dns_flushed": dns_flushed,
        "system_artifacts_removed": sys_removed,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 3: VERIFY
# ═══════════════════════════════════════════════════════════════════════════════

def run_verify(pre_snapshot):
    """Execute Phase 3: Re-scan and diff against pre-clean state."""
    section("VERIFY — Post-Clean Validation", phase_num=3)
    print()

    post_snapshot = {
        "browsers": {},
        "locker": {},
        "dns": {},
        "system_artifacts": [],
        "summary": {
            "browsers_detected": 0,
            "total_keyword_hits": 0,
            "total_artifact_dirs": 0,
            "total_sw_size_bytes": 0,
        }
    }

    # Re-scan browsers
    for browser_name, user_data_path in BROWSER_PROFILES.items():
        profiles = find_browser_profiles(user_data_path)
        if not profiles:
            continue

        post_snapshot["summary"]["browsers_detected"] += 1
        post_snapshot["browsers"][browser_name] = {"profiles": {}}

        for profile_name, profile_path in profiles:
            profile_data = {}

            kw_hits = scan_leveldb_keywords(profile_path)
            profile_data["keyword_hits"] = kw_hits
            post_snapshot["summary"]["total_keyword_hits"] += len(kw_hits)

            sw_data = scan_service_workers(profile_path)
            profile_data["service_workers"] = sw_data
            post_snapshot["summary"]["total_sw_size_bytes"] += sw_data["size_bytes"]

            artifact_findings = scan_artifact_dirs(profile_path)
            profile_data["artifact_dirs"] = artifact_findings
            post_snapshot["summary"]["total_artifact_dirs"] += len(artifact_findings)

            post_snapshot["browsers"][browser_name]["profiles"][profile_name] = profile_data

    # Re-check LOCKER and DNS
    post_snapshot["locker"] = scan_locker_status()
    post_snapshot["dns"] = scan_dns_resolution()
    post_snapshot["system_artifacts"] = scan_system_artifacts()

    # Calculate diff
    pre = pre_snapshot["summary"]
    post = post_snapshot["summary"]

    results = {
        "keyword_hits": {"before": pre["total_keyword_hits"], "after": post["total_keyword_hits"]},
        "artifact_dirs": {"before": pre["total_artifact_dirs"], "after": post["total_artifact_dirs"]},
        "sw_cache": {"before": pre["total_sw_size_bytes"], "after": post["total_sw_size_bytes"]},
        "locker_active": post_snapshot["locker"].get("installed", False),
        "system_artifacts": {"before": len(pre_snapshot.get("system_artifacts", [])),
                              "after": len(post_snapshot.get("system_artifacts", []))},
    }

    # DNS check
    dns_clean = all(v == "BLOCKED" for v in post_snapshot["dns"].values())
    results["dns_blocked"] = dns_clean

    # Report
    kw_ok = post["total_keyword_hits"] == 0
    art_ok = post["total_artifact_dirs"] == 0
    sw_ok = post["total_sw_size_bytes"] < 1_000_000  # <1MB is fine
    locker_ok = results["locker_active"]

    status("Tracker keywords",
           f"{pre['total_keyword_hits']} → {post['total_keyword_hits']}",
           ok=kw_ok)
    status("Artifact directories",
           f"{pre['total_artifact_dirs']} → {post['total_artifact_dirs']}",
           ok=art_ok)
    status("ServiceWorker cache",
           f"{fmt_size(pre['total_sw_size_bytes'])} → {fmt_size(post['total_sw_size_bytes'])}",
           ok=sw_ok)
    status("DNS LOCKER",
           "ACTIVE" if locker_ok else "NOT ACTIVE",
           ok=locker_ok)
    status("DNS Resolution",
           "ALL BLOCKED" if dns_clean else "SOME STILL RESOLVE",
           ok=dns_clean)

    all_clean = kw_ok and art_ok and sw_ok and locker_ok and dns_clean
    results["all_clean"] = all_clean
    results["post_snapshot"] = post_snapshot

    return results


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 4: DIAGNOSE
# ═══════════════════════════════════════════════════════════════════════════════

DIAGNOSIS_RULES = [
    {
        "condition": lambda v: v["keyword_hits"]["after"] > 0,
        "title": "Tracker keywords still present in LevelDB",
        "explanation": (
            "Browser processes were likely still holding file locks during cleanup. "
            "LevelDB files cannot be deleted while the browser has them open."
        ),
        "action": "Close ALL browser windows completely (check Task Manager), then re-run VNR SCAN.",
    },
    {
        "condition": lambda v: v["sw_cache"]["after"] > 10_000_000,
        "title": "Service Worker caches rebuilt (>10 MB)",
        "explanation": (
            "hCaptcha's proof-of-work infrastructure re-seeds Service Worker caches even from "
            "incognito sessions. A single visit can plant 146+ MB of cached data that persists "
            "across sessions."
        ),
        "action": (
            "STEP ZERO: Delete your Suno account and do NOT visit suno.com on this machine. "
            "The tracker stack will immediately re-seed on any visit. Then re-run VNR SCAN."
        ),
    },
    {
        "condition": lambda v: not v["locker_active"],
        "title": "DNS LOCKER not installed",
        "explanation": (
            "Without the DNS LOCKER, tracker domains can still resolve and scripts can load. "
            "Browser-level shields (like Brave Shields) are NOT sufficient because Microsoft "
            "Clarity embeds inline — it doesn't need an external fetch to start the GPU loop."
        ),
        "action": "Re-run VNR SCAN as Administrator (right-click → Run as Administrator).",
    },
    {
        "condition": lambda v: not v["dns_blocked"],
        "title": "Tracker domains still resolving via DNS",
        "explanation": (
            "The hosts file may have been modified but the DNS cache hasn't flushed, "
            "or another DNS resolver (like a VPN or custom DNS) is overriding the hosts file."
        ),
        "action": (
            "1. Make sure no VPN is overriding DNS settings.\n"
            "  2. Run: ipconfig /flushdns\n"
            "  3. If using a custom DNS (Cloudflare 1.1.1.1, Google 8.8.8.8), note that "
            "some resolvers may cache results. Wait 5 minutes and re-verify."
        ),
    },
    {
        "condition": lambda v: v["artifact_dirs"]["after"] > 0,
        "title": "Browser artifact directories recreated",
        "explanation": (
            "Browsers regenerate certain directories (like Code Cache, GPUCache) on launch. "
            "This is normal — but if tracker-specific artifact dirs (component_crx_cache, "
            "ActorSafetyLists) reappear, it means the tracker stack is actively reinstalling."
        ),
        "action": (
            "Install LOCKER first (blocks tracker domains), THEN clean. Without LOCKER active, "
            "the trackers will reinstall the moment you open the browser."
        ),
    },
]


def run_diagnose(verify_results):
    """Execute Phase 4: Rule-based troubleshooting."""
    section("DIAGNOSE — Troubleshooting", phase_num=4)
    print()

    c = Colors

    if verify_results["all_clean"]:
        print(f"  {c.GREEN}{c.BOLD}STATUS: ALL CLEAR ✓{c.RESET}")
        print()
        print(f"  {c.BOLD}Your system is protected.{c.RESET}")
        print()
        warning("Do NOT visit suno.com again on this machine.")
        info("The tracker stack will re-seed immediately on any visit.")
        info("Full evidence: www.vossneuralresearch.com/research/suno-har-capture/")
        return []

    # Run diagnosis rules
    issues = []
    for rule in DIAGNOSIS_RULES:
        try:
            if rule["condition"](verify_results):
                issues.append(rule)
        except (KeyError, TypeError):
            pass

    if not issues:
        print(f"  {c.YELLOW}Cleanup partially successful. Some residual artifacts detected.{c.RESET}")
        print(f"  {c.DIM}Try re-running VNR SCAN after a full system restart.{c.RESET}")
        return issues

    print(f"  {c.RED}{c.BOLD}STATUS: ACTION NEEDED{c.RESET}")
    print(f"  {c.DIM}Found {len(issues)} issue{'s' if len(issues) != 1 else ''}:{c.RESET}")

    for i, issue in enumerate(issues, 1):
        print()
        print(f"  {c.BOLD}Issue {i}: {issue['title']}{c.RESET}")
        print(f"  {c.DIM}Why: {issue['explanation']}{c.RESET}")
        print(f"  {c.YELLOW}Fix: {issue['action']}{c.RESET}")

    return issues


# ═══════════════════════════════════════════════════════════════════════════════
# REPORT OUTPUT
# ═══════════════════════════════════════════════════════════════════════════════

def save_report(scan_snapshot, clean_results=None, verify_results=None, diagnose_issues=None):
    """Save full report as JSON."""
    report = {
        "vnr_scan_version": VERSION,
        "timestamp": datetime.datetime.now().isoformat(),
        "scan": scan_snapshot,
        "clean": clean_results,
        "verify": verify_results,
        "diagnose": [
            {"title": i["title"], "explanation": i["explanation"], "action": i["action"]}
            for i in (diagnose_issues or [])
        ],
    }

    # Remove non-serializable items from verify
    if verify_results and "post_snapshot" in report.get("verify", {}):
        del report["verify"]["post_snapshot"]

    filename = f"vnr_scan_report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    report_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)

    try:
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, default=str)
        return report_path
    except (OSError, PermissionError):
        # Fall back to temp dir
        report_path = os.path.join(os.environ.get("TEMP", "."), filename)
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, default=str)
        return report_path


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    Colors.init()
    banner()

    parser = argparse.ArgumentParser(
        description="VNR SCAN v2 — Intelligent Cleanup Tool by Voss Neural Research",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Full evidence: www.vossneuralresearch.com/research/suno-har-capture/"
    )
    parser.add_argument("--scan-only", action="store_true",
                        help="Run Phase 1 (scan) only — no modifications to system")
    parser.add_argument("--no-report", action="store_true",
                        help="Skip saving JSON report file")
    args = parser.parse_args()

    c = Colors

    # Admin check (warn but don't block for scan-only)
    if not is_admin():
        if args.scan_only:
            warning("Not running as Admin. Some scan results may be incomplete.")
            print()
        else:
            print(f"  {c.RED}{c.BOLD}ERROR: Administrator privileges required.{c.RESET}")
            print(f"  {c.DIM}Right-click → Run as Administrator{c.RESET}")
            print()
            input("  Press Enter to exit...")
            sys.exit(1)

    # ── PHASE 1: SCAN ──
    scan_snapshot = run_scan()

    if args.scan_only:
        # Save report and exit
        if not args.no_report:
            report_path = save_report(scan_snapshot)
            print(f"\n  {c.DIM}Report saved: {report_path}{c.RESET}")

        print(f"\n{c.CYAN}{'═' * 60}{c.RESET}")
        print(f"  {c.BOLD}Scan complete. No changes were made.{c.RESET}")
        print(f"  {c.DIM}Run without --scan-only to clean.{c.RESET}")
        print(f"{c.CYAN}{'═' * 60}{c.RESET}\n")
        input("  Press Enter to exit...")
        return

    # Check if there's anything to clean
    s = scan_snapshot["summary"]
    if (s["total_keyword_hits"] == 0 and s["total_artifact_dirs"] == 0
            and s["total_sw_size_bytes"] < 1_000_000
            and scan_snapshot["locker"].get("installed")
            and all(v == "BLOCKED" for v in scan_snapshot["dns"].values())
            and len(scan_snapshot["system_artifacts"]) == 0):
        print(f"\n  {c.GREEN}{c.BOLD}System appears clean. No action needed.{c.RESET}")
        if not args.no_report:
            report_path = save_report(scan_snapshot)
            print(f"  {c.DIM}Report saved: {report_path}{c.RESET}")
        print()
        input("  Press Enter to exit...")
        return

    # Prompt before cleaning
    print(f"\n  {c.YELLOW}{c.BOLD}Issues detected. Ready to clean.{c.RESET}")
    print(f"  {c.DIM}This will kill browser processes, remove tracker data,{c.RESET}")
    print(f"  {c.DIM}install DNS LOCKER, and flush DNS cache.{c.RESET}")
    print()
    response = input("  Proceed with cleanup? (Y/n): ").strip().lower()
    if response and response != "y":
        print(f"\n  {c.DIM}Cleanup cancelled. No changes made.{c.RESET}")
        input("  Press Enter to exit...")
        return

    # ── PHASE 2: CLEAN ──
    clean_results = run_clean(scan_snapshot)

    # Brief pause for filesystem to settle
    time.sleep(2)

    # ── PHASE 3: VERIFY ──
    verify_results = run_verify(scan_snapshot)

    # ── PHASE 4: DIAGNOSE ──
    diagnose_issues = run_diagnose(verify_results)

    # Save report
    if not args.no_report:
        report_path = save_report(scan_snapshot, clean_results, verify_results, diagnose_issues)
        print(f"\n  {c.DIM}Full report saved: {report_path}{c.RESET}")

    # Final banner
    print(f"\n{c.CYAN}{'═' * 60}{c.RESET}")
    if verify_results["all_clean"]:
        print(f"  {c.GREEN}{c.BOLD}VNR SCAN COMPLETE — ALL CLEAR{c.RESET}")
    else:
        print(f"  {c.YELLOW}{c.BOLD}VNR SCAN COMPLETE — REVIEW ISSUES ABOVE{c.RESET}")
    print(f"  {c.DIM}Voss Neural Research LLC{c.RESET}")
    print(f"  {c.DIM}www.vossneuralresearch.com{c.RESET}")
    print(f"{c.CYAN}{'═' * 60}{c.RESET}\n")
    input("  Press Enter to exit...")


if __name__ == "__main__":
    main()
