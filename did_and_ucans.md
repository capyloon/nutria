# DID & UCAN findings in Capyloon

Capyloon added support for DID and UCAN as part of an experiment with decentralized identity and permissions schemes. The goal is to figure out if these techniques are a good fit within a dweb device and what kind of user experience we can expect.

A set of features are implemented:

- Creation of DIDs on device. These are static cryptographic keys DIDs as defined in https://w3c-ccg.github.io/did-method-key/. Each one is associated with a human readable label to allow easy selection in UI dialogs. The system also creates a default "superuser" DID that can be used by core apps to avoid prompts in these apps: by using the OS you implicitely trust its core apps.

- An API for any web page to request capabilities:
`Promise<UCAN, Error> requestCapabilities(audience, capabilities)` : This returns a base64 encoded version of the UCAN token. A dialog is presented to the user with the page url, a issuer selector (one of the local DIDs, except the superuser one), the list of requested capabilities and the expiration limit for the UCAN. It's possible to only grant a subset of the requested capabilities.

- Each api that supports UCANs as a permission mechanism needs to define its own actions and their scope. In Capyloon, the VFS API defined these capabilities:

| Action     | Scope       | Description                                                |
|------------|-------------|------------------------------------------------------------|
| vfs/READ   | vfs://$path | Grants read access to a directory and its subdirectories.  |
| vfs/WRITE  | vfs://$path | Grants write access to a directory and its subdirectories. |
| vfs/SEARCH | vfs://      | Grant access to the full text search API.                  |
| vfs/VISIT  | vfs://      | Grants access to the visit scoring API.                    |

Additionaly, the VFS API exposes an API used by the caller to present its UCAN:
`Promise<void, Error> withUcan(token)` : the call will be rejected if the token is considered invalid. This can happen for a number of reasons:
- Invalid signature,
- Bad time range.
- Unknown issuer: the issuer must be one of the device-local DIDs.

# Challenges

It's interesting to consider how UCANs can fit with the web and its origin-based approach to access control.

When requesting capabilities, the token created is not bound to an origin, but to the issuer DID. Capyloon displays the page url in the permission dialog, but the url is not used for any other purpose. Displaying the url was needed to expose user friendly information instead of an opaque public key.

However nothing prevents a token created when browsing site_a.com to be transmitted to another origin and presented by site_b.com. This is quite a departure from the usual web model, even if somewhat expected for a distributed system with a different trust model. Informing users of edge cases looks like something useful: we could bind tokens to the origin they've been granted from, and when reused from a different origin prompt the user: "You granted access to /pictures/ to site_a.com, but site_b.com is requesting to use that permission. [ok] [hell no]".

The underlying issue is that once created, a leaked or stolen token can be reused. Again, this is part of the UCAN design, and it's useful in some use cases like ticketing, but seems problematic when granting permissions.

A possible mitigation is to limit the lifetime of the UCAN, by constraining the expiration time in the permission request dialog. This is a double edge sword though, since a short lifetime will lead to repeated prompts (which in turn lead to users paying less attention to what is being presented). Also, the use case of a user changing their mind or making a mistake needs to be accounted for, as well as the "grant for this session only" case.

The solution being implemented in Capyloon is to implement a device-local blocking mechanism, keyed on the token signature. That requires DIDs and UCANs to be synchonized among devices in multi-devices scenarii.

Overall, the flexibility of UCANs - like the ability for each API to define their own set of actions and scope - needs to balanced with what can be seen as unexpected consequences from a user point of view. The "cryptographic key binding" model of UCANs is likely harder to understand for users than the origin-based model of the web or the app-based model of other OSes.

It is likely possible to mitigate a lot of these concerns by relying on device-local knowledge about the tokens that were granted and the DID they are attached to. A multi-device model is also relatively straightforward thanks to the distributed design.

We'll keep refining our implementation in Capyloon and update this document based on new findings. Our first focus is to improve the UCAN management, like making them part of the regular page permissions management and page data clearing flows.
