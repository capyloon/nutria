P0:
- Fix UCAN bugs.
- wnfs in costaeres

UCAN improvements:
- Store all UCANs (delete expired ones?)
- Add a "blocked" flag
- Check the UCAN blocked status when checking UCAN validity.

P1:
- CI: docker images for daily builds
- CI: better integration avec Estuary/web3.storage
- Better generic VFS api.
- permission prompts: permissions in page-info
- revamp website (eg. similar to https://regolith-linux.org/)
- be in good standing in https://github.com/arthuredelstein/privacytests.org

P2:
- improve color palette (https://github.com/lokesh/color-thief and https://complementary.arandomurl.com/)
- redesign the siteinfo panel
- Shoelace migration in apps: dialer.
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

https://github.com/capyloon/mobian-recipes

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

Peer discovery
==============

Each user is identified by its set of DIDs. A user can own several devices, each with its own device ID.

Peering is done between device on behalf of users. That means that if Alice wants to connect with Bob, Alice should not know which of Bob's device to connect to. This should be handled by the peering mechanism.

TODO:
- Contacts app: Include DIDs in contacts.
- Contacts app: Create a "Me, myself and I" contact with locally configured DIDs.
- Settings app: In the Identity panel, add a way to import and export identities with QR Codes.

[Done] Local network discovery: when discoverable, a Capyloon device advertises itself using mDNS with the _capyloon.tcp.local service name. It exposes its public DID in a txt record, and a service endpoint url.

Other devices discovering a peer by mDNS can filter out if this is one of their contacts based on the DID. Note that this does not provide any access control: this is done through the handshake protocol when connecting to the endpoint url.

Remote discovery: a device can also decide to advertise its availability to a rendez-vous server. To do so, it needs to prove it owns the DID by signing a payload made random data provided by the server and the list of peers DIDs that can discover it.

On the discovery side, you can request presence notifications by registering a web push endpoint with a signed payload containing the list of DIDs you want to observe. The server will take care of only delivering notifications that are allowed.

Once 2 devices want to communicate using the rendez vous server, the first one will send a connection request to the server, which will relay it to the other peer (using web push) with the endpoint id and a TTL. Both devices can then do an offer / answer exchange to setup a WebRTC connection.

Use cases:
- basic data transfert: text, urls, files.
- Remote access to data & apis from another device (eg. SMS on your laptop).
- Media player on 2nd screen.
- Casual gaming.
- remote activities

"Guest mode" needed: how to connect to a previously unknown peer, like a TV.
- TV shows a QR code with its DID + device id.
- Guest adds the TV to its address book and initiates the connection.
