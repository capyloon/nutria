self.addEventListener("install", function (event) {
  // Perform install steps
  console.log(
    `MMM ============================== Messages sw.js is now installed`
  );
  evt.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (event) {
  // Perform activation steps
  console.log(
    `MMM ============================== Messages sw.js is now activated`
  );
  evt.waitUntil(self.clients.claim());
});

self.onnotificationclick = async (event) => {
  console.log(`MMM notification click`);
  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((allClients) => {
        if (allClients.length > 0) {
          allClients.forEach((client) => client.focus());
        } else {
          clients.openWindow("/index.html");
        }
      })
  );
};

self.onsystemmessage = async (event) => {
  if (event.name === "sms-received") {
    // sms-received looks like:
    // {
    //   iccId: 89014103271571276292,
    //   type: "sms",
    //   id: 3,
    //   threadId: 1,
    //   delivery: "received",
    //   deliveryStatus: "success",
    //   sender: "+16503903655",
    //   receiver: "+18583129247",
    //   body: "When will it ship?",
    //   messageClass: "normal",
    //   timestamp: 1609987408668,
    //   sentTimestamp: 0,
    //   deliveryTimestamp: 0,
    //   read: false,
    // };

    // Check if the app is running. If not, display a notification.
    const allClients = await clients.matchAll({
      type: "window",
    });
    console.log(`MMM SW event: 'sms-received' - ${allClients.length} clients`);
    if (allClients.length === 0) {
      let message = event.data.json();
      console.error(`MMM Message is ${JSON.stringify(message)}`);
      const iconb64 = btoa(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" color="lightsteelblue" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`
      );
      const options = {
        body: message.body,
        icon: `data:image/svg+xml;base64,${iconb64}`,
      };

      self.registration.showNotification(message.sender, options);
    }

    return;
  }

  // let handler = event.data.webActivityRequestHandler();
  // let source = handler.source;

  // let resolver;
  // let promise = new Promise((resolve) => {
  //   resolver = resolve;
  // });
  // event.waitUntil(promise);

  // // console.log(`ZZZ Contact activity data: ${JSON.stringify(source.data)}`);

  // const allClients = await clients.matchAll({
  //   includeUncontrolled: true,
  // });
  // if (allClients.length > 0) {
  //   let win = allClients[0];
  //   win.postMessage(source.data);
  // } else {
  //   let win = await clients.openWindow("/index.html");
  //   win.postMessage(source.data);
  // }
  // resolver();
};
