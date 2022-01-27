class AudioVolumeManager {
  constructor() {
    console.log(`Starting Gonk audio volume manager`);

    embedder.addSystemEventListener("keydown", this, true);

    this.init();
  }

  async init() {
    this.settings = await apiDaemon.getSettings();
    this.currentChannel = "normal";
    this.currentVolume = {
      alarm: 15,
      notification: 15,
      telephony: 5,
      content: 15,
      bt_sco: 15,
    };
    this.MAX_VOLUME = {
      alarm: 15,
      notification: 15,
      telephony: 5,
      content: 15,
      bt_sco: 15,
    };
    this.vibrationEnabled = false;
    this.vibrationUserPrefEnabled = false;
    this.muteState = "Off";

    // Retrieve the real initial values from the setttings.
    let audioSettings = [
      "alarm",
      "notification",
      "telephony",
      "content",
      "bt_sco",
    ].map((channel) => {
      return `audio.volume.${channel}`;
    });
    let channels = await this.settings.getBatch(audioSettings);
    channels.forEach((channel) => {
      this.currentVolume[channel.name.replace("audio.volume.", "")] =
        channel.value;
    });

    console.log(`MMM adding audiochannelchanged event listener`);
    window.addEventListener("audiochannelchanged", this);
  }

  audioChannelChanged(event) {
    console.log(`MMM audioChannelChanged to ${event.detail.channel}`);
  }

  handleEvent(event) {
    console.log(`MMM audio event: ${event.type}`);
    if (event.name == "audiochannelchanged") {
      this.audioChannelChanged(event);
      return;
    }

    switch (event.key) {
      case "AudioVolumeDown":
        this.changeVolume(-1);
        break;
      case "AudioVolumeUp":
        this.changeVolume(1);
        break;
    }
  }

  setAudioChannel(channel) {
    if (this.currentChannel === channel) {
      return;
    }
    this.currentChannel = channel;
  }

  getChannel() {
    switch (this.currentChannel) {
      case "normal":
      case "content":
        return "content";
      case "telephony":
        return "telephony";
      case "alarm":
        return "alarm";
      case "notification":
      case "ringer":
        return "notification";
      default:
        return "content";
    }
  }

  calculateVolume(curVolume, delta, channel) {
    let volume = curVolume;
    switch (channel) {
      case "notification":
        if (volume === 0 && !this.vibrationEnabled) {
          // This is for voluming up from Silent to Vibrate.
          // Let's take -1 as the silent state and
          // 0 as the vibrate state for easier calculation here.
          volume = -1;
        }
        volume += delta;
        break;

      case "telephony":
      case "alarm":
      case "bt_sco":
        if (volume + delta >= 1) {
          volume += delta;
        } else {
          volume = 1;
        }
        break;

      default:
        volume += delta;
        break;
    }

    return volume;
  }

  getVibrationAndMuteState(delta, channel) {
    let curVolume = this.currentVolume[channel];
    if (channel === "notification") {
      let state;
      let volume = curVolume;
      if (volume === 0 && !this.vibrationEnabled) {
        // This is for voluming up from Silent to Vibrate.
        // Let's take -1 as the silent state and
        // 0 as the vibrate state for easier calculation here.
        volume = -1;
      }
      volume += delta;

      if (volume < 0) {
        state = "Mute";
        this.vibrationEnabled = false;
      } else if (volume === 0) {
        state = "Mute";
        this.vibrationEnabled = true;
      } else {
        // Restore the vibration setting only when leaving silent mode.
        if (curVolume <= 0) {
          this.vibrationEnabled = this.vibrationUserPrefEnabled;
        }
        state = "Off";
      }
      // Notify the user vibration is enabled when volume is 0.
      if (delta !== 0 && volume === 0 && this.vibrationEnabled) {
        this.notifyByVibrating();
      }

      return state;
    } else {
      if (curVolume + delta <= 0) {
        return "Mute";
      } else {
        return "Off";
      }
    }
  }

  notifyByVibrating() {
    window.navigator.vibrate(200);
  }

  showVolume(channel, volume) {
    // Normalize the volume in a 0-100% range for display purposes.
    let normalized = (volume * 100) / this.MAX_VOLUME[channel];

    window["audiovolume"].setValue(normalized);
  }

  async changeVolume(delta) {
    let channel = this.getChannel();

    console.log(`changeVolume ${delta} on channel ${channel}`);

    let volume = this.calculateVolume(
      this.currentVolume[channel],
      delta,
      channel
    );

    this.muteState = this.getVibrationAndMuteState(delta, channel);

    this.currentVolume[channel] = volume = Math.max(
      0,
      Math.min(this.MAX_VOLUME[channel], volume)
    );

    console.log(`MMM Setting volume to ${volume} for the ${channel} channel`);

    this.showVolume(channel, volume);

    await this.settings.set([
      {
        name: `audio.volume.${channel}`,
        value: volume,
      },
    ]);
  }
}

const audioVolumeManager = new AudioVolumeManager();
