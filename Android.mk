#
# Builds the apps and installs them in /system/b2g/webapps
#

LOCAL_PATH:= $(call my-dir)

include $(CLEAR_VARS)
LOCAL_MODULE       := gaia
LOCAL_MODULE_CLASS := DATA
LOCAL_MODULE_TAGS  := optional
LOCAL_MODULE_PATH  := $(TARGET_OUT)
include $(BUILD_SYSTEM)/base_rules.mk

B2G_DEFAULTS := $(abspath $(TARGET_OUT)/b2g/defaults)
NUTRIA_PATH ?= nutria

$(LOCAL_INSTALLED_MODULE): $(LOCAL_BUILT_MODULE)
	@echo "Installing frontend..."
	# Copy the custom prefs file.
	@mkdir -p $(B2G_DEFAULTS)/pref
	@cp $(NUTRIA_PATH)/defaults/pref/common.js $(B2G_DEFAULTS)/pref/common.js
	@cp $(NUTRIA_PATH)/defaults/pref/teracube.js $(B2G_DEFAULTS)/pref/teracube.js
	# Copy the default settings
	@cp $(NUTRIA_PATH)/defaults/default-settings.json $(B2G_DEFAULTS)/settings.json
	# Create a "buffer file" to have spare room on the system partition.
	dd if=/dev/urandom of=$(B2G_DEFAULTS)/delete_me_when_disk_full bs=1M count=100

$(LOCAL_BUILT_MODULE):
	@echo "Packaging Nutria apps..."
	(cd $(NUTRIA_PATH)/builder ; \
	 NUTRIA_APPS_ROOT=$(abspath $(NUTRIA_PATH)/apps) \
         $(SHELL) install.sh $(B2G_DEFAULTS)/../)

