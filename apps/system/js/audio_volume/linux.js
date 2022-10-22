// Set the audio volume using pactl. We track the current volume with
// a setting.
function setAudioVolume(value) {
  console.log(`Setting volume to ${value}%`);

  // run `pactl set-sink-volume 0 -XX%`
  let pactl = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
  pactl.initWithPath("/usr/bin/pactl");
  if (!pactl.exists()) {
    console.error(`Could not find /usr/bin/pactl`);
    return;
  }
  const process = Cc["@mozilla.org/process/util;1"].createInstance(
    Ci.nsIProcess
  );
  process.init(pactl);
  let params = ["set-sink-volume", "0", `${value}%`];
  return new Promise((resolve) => {
    process.runAsync(
      params,
      params.length,
      {
        observe(_subject, topic, _data) {
          if (topic === "process-failed") {
            console.error(`pactl run failure for '/usr/bin/pactl ${params}'`);
          }
          resolve();
        },
      },
      false
    );
  });
}

// If no AudioManager is available, use key events and pactl for now.
async function setupAudio() {
  let settings = await apiDaemon.getSettings();

  // Get the current audio volume, in %
  let currentVolume = 50;
  try {
    let setting = await settings.get("audio.volume.current");
    currentVolume = setting.value;
  } catch (e) {
    // TODO: get the current value from the HW?
    console.error(`No setting value found for audio.volume.current`);
  }

  // Initialize the HW to the current value.
  await setAudioVolume(currentVolume);

  let handler = async (event) => {
    const kStep = 5;

    if (event.key === "AudioVolumeDown") {
      currentVolume -= kStep;
    } else if (event.key === "AudioVolumeUp") {
      currentVolume += kStep;
    } else if (event.key === "AudioVolumeMute") {
      currentVolume = 0;
    } else {
      return;
    }

    if (currentVolume < 0) {
      currentVolume = 0;
    }
    if (currentVolume > 100) {
      currentVolume = 100;
    }

    await setAudioVolume(currentVolume);
    window["audiovolume"].setValue(currentVolume);
    await settings.set([
      { name: "audio.volume.current", value: currentVolume },
    ]);
  };

  embedder.addSystemEventListener("keydown", handler, true);
}


console.log(`Starting Linux audio volume manager`);
setupAudio();
