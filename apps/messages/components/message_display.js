// The <message-display> custom element, responsible for the display of
// a single message.

class MessageDisplay extends LitElement {
  // data is a SmsMessage
  constructor(data) {
    super();
    this.setData(data);
  }

  static get properties() {
    return {
      body: { type: String, attribute: false },
      timestamp: { type: String, attribute: false },
    };
  }

  // data is a SmsMessage
  setData(data) {
    const { body, timestamp, delivery } = data;

    this.classList.remove("received");
    this.classList.remove("sent");
    this.classList.add(delivery === "received" ? "received" : "sent");

    this.body = body;

    let options = {
      timeStyle: "short",
    };

    // Only display the date when if message was not sent today.
    let today = Math.round(Date.now() / (24 * 3600 * 1000));
    let received = Math.round(timestamp / (24 * 3600 * 1000));
    if (received < today) {
      options.dateStyle = "short";
    }

    // Manually apply offset to UTC since we have no guarantee that
    // anything else but `UTC` will work in DateTimeFormat.
    let localTime = timestamp - new Date().getTimezoneOffset() * 60 * 1000;
    this.timestamp = new Intl.DateTimeFormat("default", options).format(
      new Date(localTime)
    );
  }

  // Naive linkyfier.
  // TODO: use something better and likely safer.
  linkify(input) {
    let output = "";
    let words = input.split(" ");
    words.forEach((word) => {
      try {
        let _url = new URL(word);
        output += ` <a href='${word}' target=_blank>${word}</a>`;
      } catch (e) {
        output += ` ${word}`;
      }
    });
    return output.trim();
  }

  render() {
    return html`
      <link rel="stylesheet" href="components/message_display.css" />
      <div class="message">
        <div class="body">${this.body}</div>
        <div class="timestamp">${this.timestamp}</div>
      </div>
    `;
  }
}

customElements.define("message-display", MessageDisplay);
