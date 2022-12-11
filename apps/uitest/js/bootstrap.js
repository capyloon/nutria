async function testGum() {
  console.log(`VVV testGum() starting...`);
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log(`VVV getUserMedia got stream ${stream}`);
    window["gum-preview"].mozSrcObject = stream;
  } catch (e) {
    console.error(`VVV Failed to access video device: ${e}`);
  }
}

function testFetch() {
  const headers = new Headers({
    Authorization: "something",
    "Kai-Device-Info": "Some device info",
    "Content-Type": "application/json",
  });

  const request = new Request("http://localhost:8080/post_me", {
    method: "POST",
    mode: "no-cors",
    body: null,
    headers,
  });

  fetch(request)
    .then((response) => {
      console.log(`VVV fetch response ${response}`);
    })
    .catch((error) => {
      console.error(`VVV fetch error ${error}`);
    });
}

function startGeoloc() {
  let geoOptions = { enableHighAccuracy: true };
  let watchId = navigator.geolocation.watchPosition(
    (pos) => {
      window[
        "geoloc-result"
      ].innerText = `Current position: lat=${pos.coords.latitude} lon=${pos.coords.longitude}`;
    },
    (err) => {
      window["geoloc-result"].innerText = `Geolocation error: ${err.message}`;
    },
    geoOptions
  );
  console.log(`Geolocation watchId is ${watchId}`);
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    console.log(`DOMContentLoaded`);

    window["simple-notification"].onclick = () => {
      console.log(`Simple desktop notification`);

      let notification = new Notification("To do list", {
        body: "Something to do",
        icon: `http://branding.localhost:${location.port}/resources/logo.webp`,
      });

      notification.onshow = () => {
        console.log(`Simple Notification shown`);
      };

      notification.onclick = () => {
        console.log(`Simple Notification clicked`);
      };

      notification.onclose = () => {
        console.log(`Simple Notification closed`);
      };
    };

    window["tagged-notification"].onclick = () => {
      console.log(`Tagged desktop notification`);

      let progress = Math.round(Math.random() * 100);
      let notification = new Notification("Tagged!", {
        body: `Some random number: ${progress}`,
        icon: `http://branding.localhost:${location.port}/resources/logo.webp`,
        tag: "notif-tag",
        data: { progress },
      });

      notification.onshow = () => {
        console.log(`Tagged Notification shown`);
      };

      notification.onclick = () => {
        console.log(`Tagged Notification clicked`);
      };

      notification.onclose = () => {
        console.log(`Tagged Notification closed`);
      };
    };

    window["action-notification"].onclick = () => {
      // Send a message to the service worker since actions are only available from service worker notifications.
      navigator.serviceWorker.controller.postMessage("show-notification");
    };

    window["play-sound"].onclick = () => {
      window["sound"].play();
    };

    window["reg-proc"].onclick = () => {
      navigator.registerProtocolHandler(
        "mailto",
        "/index.html?mailto:%s",
        "mailto: handler"
      );
      window["reg-proc"].setAttribute("disabled", "true");
    };

    let webView = window["web-view"];
    webView.openWindowInfo = null;
    webView.src = `http://widgets.localhost:${location.port}/worldclock/index.html`;

    window["gum-start"].onclick = testGum;

    let select1 = window["pet-select"];
    select1.onchange = () => {
      console.log(`select1.onchange: value is now ${select1.value}`);
    };

    select1.oninput = () => {
      console.log(`select1.oninput: value is now ${select1.value}`);
    };

    window["headers"].onclick = testFetch;

    window["geoloc"].onclick = startGeoloc;

    window["vibrate"].onclick = () => {
      navigator.vibrate(500);
    };

    window.setTimeout(() => {
      window["music"].setAttribute("controls", "true");
      window["video"].setAttribute("controls", "true");
    }, 3000);

    window["activity"].onclick = async () => {
      try {
        let activity = new WebActivity("pick", { type: "image" });
        let blob = await activity.start();
        console.log(`Got blob: ${blob}`);
        window["activity-image"].src = URL.createObjectURL(blob);
      } catch (e) {
        console.log(`The 'pick' activity was canceled: ${e}`);
      }
    };
  },
  { once: true }
);
