# Contributing to Nutria

Welcome! Here are a few rules to follow if you want to contribute to Nutria:
- Please first open an issue before sending pull requests. That will save both yours and the maintainers time :)
- You can also ping us in the [Matrix](https://matrix.to/#/#capyloon:matrix.org) channel to discuss.

## App urls setup

Each app is in its own subdirectory under `apps/`. The directory name ends up being used for the url space of the app, recognized as such by the virutal host http server of the api-daemon.

For instance, the app in the `contacts` directory has a `http://contacts.localhost:$port` origin. There are 2 exceptions to this rule: the `branding.localhost` and `theme.localhost` url space are mapped to another app based on the value of the `nutria.branding` and `nutria.theme` settings. This allows switching branding and themes without changing urls and CSP rules.

The `shared` app contains various resources and code that is usable by all apps since it's allowed by the CSP.

There is no build step for now. We may introduce an optimization step for production builds (see https://github.com/capyloon/nutria/issues/9).

## JS/HTML/CSS

Nutria aims at showcasing how to best use the web platform. Compared to usual web sites, we benefit from running on a single well known runtime: no need for polyfills or other compatibility layers.

We strive to keep things simple:
- Use web components as much as possible. We vendor [Lit](https://lit.dev/) instead of reinventing the wheel.
- Don't use of modules.
- Keep markup and CSS rules as minimal as possible.

We use [Fluent](https://projectfluent.org/) for localization needs.

## Design / graphices

The icon set is [Lucide](https://lucide.dev/).

We started to use [Shoelace](https://shoelace.style/) for generic UI components, but not all apps have been updated yet.