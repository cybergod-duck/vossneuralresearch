# VNR SCAN Cleanup Kit

**Voss Neural Research LLC** — www.vossneuralresearch.com

Neutralize the 71+ tracker stack and resource exploitation documented on AI music platforms. This kit includes DNS-level blocking, browser artifact cleanup, and an intelligent scan/verify system.

## Quick Start (Recommended)

Run the Python-based intelligent scanner — it handles everything automatically:

```
python vnr_scan.py
```

**Requirements:** Python 3.8+ and Administrator privileges.

### Modes

| Command | What it does |
|---|---|
| `python vnr_scan.py` | Full pipeline: Scan → Clean → Verify → Diagnose |
| `python vnr_scan.py --scan-only` | Forensic scan only (no modifications) |
| `python vnr_scan.py --no-report` | Skip saving JSON report file |

### What VNR SCAN v2 Does

1. **SCAN** — Detects tracker artifacts across Chrome, Brave, Edge, and Comet. Searches LevelDB files for 16 tracker keywords, checks Service Worker caches, artifact directories, DNS LOCKER status, and system-level remnants.

2. **CLEAN** — Kills browser processes, removes infected LevelDB files, purges Service Worker caches, deletes artifact directories, installs the DNS LOCKER (23 domains), and flushes DNS.

3. **VERIFY** — Re-scans everything and diffs against the pre-clean state. Tells you exactly what was fixed and what wasn't.

4. **DIAGNOSE** — If cleanup didn't fully work, explains *why* (locked files, re-seeding, missing admin rights) and tells you exactly what to do next.

## Standalone Scripts (Legacy)

These batch scripts are included as fallbacks if Python is not available:

| Script | Purpose |
|---|---|
| `install-locker.bat` | Block 23 tracker domains via hosts file |
| `browser-cleanup.bat` | Remove cached tracker artifacts from browsers |
| `verify-clean.bat` | Basic 3-point verification check |

Run each script as Administrator.

## Step Zero

**Before running any cleanup:** Delete your account on the tracked platform and stop visiting it. The tracker stack (hCaptcha + Microsoft Clarity) re-seeds itself into your browser profile on every page load, making cleanup impossible while the source is active.

## Full Evidence

- Forensic Report: https://www.vossneuralresearch.com/research/suno-har-capture/
- Technical Dashboard: https://www.vossneuralresearch.com/vnr-scan/
- Source Code: https://github.com/cybergod-duck/vossneuralresearch
