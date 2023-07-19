#!/bin/bash

set -e

if [ -z ${GECKO_PATH+x} ]; then
    echo "Please set GECKO_PATH to the path of the Gecko repository."
    exit 1;
fi

APP_ROOT=apps/gecko-l10n/locales/en-US

# browser files that are needed because they are referenced by toolkit/ :(
cp ${GECKO_PATH}/browser/locales/en-US/browser/appExtensionFields.ftl ${APP_ROOT}/browser
cp ${GECKO_PATH}/browser/locales/en-US/browser/safebrowsing/blockedSite.ftl ${APP_ROOT}/browser/safebrowsing
