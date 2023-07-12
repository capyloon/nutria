#!/bin/bash

set -e

if [ -z ${GECKO_PATH+x} ]; then
    echo "Please set GECKO_PATH to the path of the Gecko repository."
    exit 1;
fi

APP_ROOT=apps/gecko-l10n/locales/en-US

# All the about: pages fluent resources.
cp -R ${GECKO_PATH}/toolkit/locales/en-US/toolkit/about ${APP_ROOT}/toolkit/

# Video controls
cp ${GECKO_PATH}/toolkit/locales/en-US/toolkit/global/videocontrols.ftl ${APP_ROOT}/toolkit/global/

# Various
cp ${GECKO_PATH}/browser/locales/en-US/browser/appExtensionFields.ftl ${APP_ROOT}/browser/appExtensionFields.ftl
