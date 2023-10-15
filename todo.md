P0:
- Fix UCAN bugs.
- wnfs in costaeres

P1:
- CI: docker images for daily builds
- CI: better integration avec Estuary/web3.storage
- Better generic VFS api.
- permission prompts: permissions in page-info
- revamp website (eg. similar to https://regolith-linux.org/)
- be in good standing in https://github.com/arthuredelstein/privacytests.org

P2:
- redesign the siteinfo panel
- Shoelace migration in apps: dialer.
- Page backup / save as (https://searchfox.org/mozilla-central/rev/efc480f2188fb43c9cccdfd2eef79749a19c20a3/browser/components/extensions/parent/ext-tabs.js#1296 and https://searchfox.org/mozilla-central/rev/efc480f2188fb43c9cccdfd2eef79749a19c20a3/toolkit/content/contentAreaUtils.js#105)
- git commit hooks (check Arti)
- github workflows for jackadi
- choose front end test framework
- <input type=datetime-local|time|date>
- investigate perf of l10n + custom elements (eg. <sl-select> in site_info.js)

Ledger
======
Implement webHID with api-daemon + polyfill.
Capyloon app:
- pubkey based account (choose something compatible with webcrypto)
- store contacts pubkeys ??
- UCANs

p2p discovery
=============
- switch to iroh or veilid ??

Next Release items
==================

Release Check List
==================
1. Publish pre-builts.
2. Publish sargo and gsi images.
3. Publish desktop, pinephone and librem5 debs.
4. Update /releases.html and /releases.xml
5. tweet and toot


Theme install / permission model
================================

While the theme infrastructure works, there are 2 areas of improvement needed:

- [DONE] Using the automatic theme selection currently require the page to be granted the settings:read permission. This is undesirable since the only setting used is "nutria.theme". Instead, we should use a theme specific permission, like "themeable".

- Installing themes: the active theme name is used to select the app providing the theme. That means themes need to be vetted to be installed. It's a high bar in general since only the OS vendor can sign apps until we have a more flexible trust model. Developers can sideload themes, but distribution is still difficult. One option is to make themes a json file that contains the theme description and a link to the CSS. Since themes need to work offline, these resources will be downloaded and installed as a locally generated app.

Various TODO:
============
[ ] Settings app: In the Identity panel, add a way to import and export identities with QR Codes.


Ctrl+Click on links
===================
whereToOpenLink at https://searchfox.org/mozilla-central/source/toolkit/modules/BrowserUtils.sys.mjs#338

Pinephone suspend
=================
https://github.com/mrmekon/circadian

I recommend to try power-profiles-daemon - that should be the most modern and general of the many tools for juggling CPU throttling and related tweaks
simply installing it should limit CPU cores and speeds when on battery - if not then nudge the Mobian developers to try add hooks (or try do that yourself, that will certianly be helpful for Mobian developers!)
when using power-profiles-daemon, remove all of thermald tuned auto-cpufreq - they should be obsoleted by this newer tool
ah - power-profiles-daemon is already pulled in by default on Mobian
Jonas@jonas:matrix.jones.dk
when you go to control panel -> Power and choose "Power saving" instead of the default "Balanced" then you are really changing power-profiles-daemon settings - as you can see by running powerprofilesctl in a terminal before and after the change
...so if you want to tune somthing, then have a look at the documentation for power-profiles-daemon how to hook into that, instead of inventing something new

https://www.hadess.net/2023/08/new-responsibilities.html :
Those freedesktop projects will be archived until further notice:
- power-profiles-daemon

Pinephone Geolocation
=====================
make sure you have Location services enabled in GNOME Control Center
you should be able to use dbus-monitor to see if it is available
they also have geoclue-demo to test out too

Keyboard autocorrect
====================
https://docs.rs/fast_symspell/0.1.7/fast_symspell/

vfs over iroh
=============

- https://github.com/vlcn-io/cr-sqlite https://www.youtube.com/watch?v=T1ES9x8DKR4

Hardware
========

https://www.amazon.com/dp/B0CHS6HP52?th=1&linkCode=sl1&tag=lp_daily_deals-20&linkId=c20f16bedb29226097d8fd23a38a5d0f&language=en_US&ref_=as_li_ss_tl


Apps / bookmarks / homescreen shortcuts
=======================================

- Unify "installed apps", "tiles" and "bookmarks" as "favorites".
    - add a "favorite" tag to places entries.
    - prompt user to add to homecreen or not.
- The homescreen has its own notion of shortcut: either a favorite or some other kind of object (contact, activity call).
- "Vertical homescreen": homescreen with a set of sections that scroll, and at the bottom the search field. Sections can either contain "static" content like widgets, set of shortcuts or be a view on some dynamic content. Examples of dynamic content can be "last contacts I interacted with", "most viewed gallery albums", "playlist of my favorite songs". This is achieved by querying the 

CapyPod
=======

## Your personal (data + compute) platform.

A user controls its "root" DID, and a set of device specific DIDs receiving delegated capabilities.

### Data is managed by a store with the following features:
- Private, shared and public data.
- Capability based access for non public data.
- Mutable resources made of resource level metadata and a set of representations, each with their own content type.
- Resource retrieval using multiple navigation and content based paradigms (hierarchycal, tags, facets, full text search etc.).
- Multi device sync, offline capable.
- Backup / restore from a dumb cloud service acting as another linked device.

### Computing
Computing over the data store is loosely coupled since any program able to access the data store API and authenticate properly can be used. It's up to the application platform to enforce additional constraints on the programs.

One interesting possibility is to use the data store itself to store and share programs:
- Building multi-device experiences like remote controlled media players, games, etc.
- Building private programs tailored to a specific use case.

With programs-as-data, it's crucial to use portable code - both for device and OS independence and for long term usability of these programs. Web based technologies are the best fit here, along with pure Wasm when no UI is needed.


Capyloon Lite
=============

Not a full OS, but an app bringing:
- Tiles.
- VFS.
- P2P with content based addressed resources.

Headless part to monitor p2p state, notifications.

"system ui / homescreen" : keep some "tab management" UI.

Target platforms: Android + Desktop.
