# VNR SCAN — Cleanup Kit
## Suno AI Tracker Removal & DNS Protection

Published by Voss Neural Research | www.vossneuralresearch.com

---

## ⚠️ STEP ZERO — DELETE SUNO

Before running anything:

1. Open Suno.com on your PHONE (cellular data, NOT your home WiFi)
2. Delete your account entirely
3. Do NOT visit Suno.com on your computer again

No cleanup tool can protect you while the source remains active.
This is the only way to ensure your CPU's safety and guarantee
that VNR SCAN is effective.

---

## Step 1: Run LOCKER Mode (DNS Blocklist)

Right-click `install-locker.bat` → **Run as Administrator**

This adds 23 tracker domains to your Windows hosts file, permanently
blocking them at the DNS level. No browser extension, shield, or
VPN can match this — it blocks BEFORE the request leaves your machine.

Blocked domains include:
- hCaptcha (crypto mining infrastructure)
- Microsoft Clarity (GPU-abusing session replay)
- Braze, Criteo, Tapad (cross-device fingerprinting)
- Google Ads, DoubleClick (ad tracking)
- Sentry, Datadog, Segment, Amplitude (telemetry)

## Step 2: Clean Browser Profiles

Right-click `browser-cleanup.bat` → **Run as Administrator**

This removes tracker artifacts from Chrome, Brave, and Edge:
- Extension caches and CRX files
- Optimization guide model stores
- Code caches containing tracker scripts
- ActorSafetyLists with embedded tracker references

**Close all browsers before running.**

## Step 3: Verify Clean

Right-click `verify-clean.bat` → **Run as Administrator**

This scans your system and reports:
- Whether LOCKER Mode is active
- Whether tracker artifacts remain
- Current DNS resolution status for blocked domains

---

## What This Kit Does NOT Do

- It does not modify your browser settings
- It does not install any software
- It does not transmit any data
- It does not require an internet connection

Everything runs locally on your machine.

## Support

Full forensic evidence: https://www.vossneuralresearch.com/
Contact: admin@vossneuralresearch.com
