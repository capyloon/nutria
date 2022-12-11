P0:
- Fix UCAN bugs.
- Rewrite contacts app.
- wnfs in costaeres

UCAN improvements:
- Store all UCANs (delete expired ones?)
- Add a "blocked" flag
- Check the UCAN blocked status when checking UCAN validity.

P1:
- CI: docker images for daily builds
- CI: better integration avec Estuary/web3.storage
- Better generic VFS api.
- cross device experience
- permission prompts: tab modals + permissions in page-info
- revamp website (eg. similar to https://regolith-linux.org/)
- be in good standing in https://github.com/arthuredelstein/privacytests.org

P2:
- improve color palette (https://github.com/lokesh/color-thief and https://complementary.arandomurl.com/)
- redesign the siteinfo panel
- Shoelace migration in apps: dialer, contacts
- Page backup / save as (https://searchfox.org/mozilla-central/rev/efc480f2188fb43c9cccdfd2eef79749a19c20a3/browser/components/extensions/parent/ext-tabs.js#1296 and https://searchfox.org/mozilla-central/rev/efc480f2188fb43c9cccdfd2eef79749a19c20a3/toolkit/content/contentAreaUtils.js#105)
- mobian images
- git commit hooks (check Arti)
- github workflows for jackadi
- choose front end test framework
- <input type=datetime-local|time|date>
- Theme support
- about:performance, about:processes
- Maybe add https://addons.mozilla.org/en-US/firefox/addon/i-dont-care-about-cookies/ to default webext
- investigate perf of l10n + custom elements (eg. <sl-select> in site_info.js)

Mobian:
all you need for a fully custom image is to create include/packages-capyloon.yaml and devices/sunxi/packages-capyloon.yaml (for the PP), then append -e capyloon to the build.sh command line (oh, and probably edit the apt repo setup part of course)

Ledger
======
Implement webHID with api-daemon + polyfill.
Capyloon app:
- pubkey based account (choose something compatible with webcrypto)
- store contacts pubkeys ??
- UCANs

libp2p discovery
================
- peer discovery: local network only
- "share anything" once paired.
- stage 2: remote peer discovery

Next Release items
==================
- Homescreen Switcher
- New "peers" app

Release Check List
==================
1. Publish pre-builts.
2. Publish sargo and gsi images.
3. Publish desktop, pinephone and librem5 debs.
4. Update /releases.html and /releases.xml
5. tweet and toot
