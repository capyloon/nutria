// The <thread-head> custom element, responsible for the display of
// a single row providing summary information about a thread.

class ThreadHead extends LitElement {
  // data is a MobileMessageThread
  constructor(data) {
    super();
    this.addEventListener("click", this, { capture: true });
    this.setData(data);
  }

  static get properties() {
    return {
      body: { type: String, attribute: false },
      participants: { type: String, attribute: false },
      timestamp: { type: String, attribute: false },
    };
  }

  // data is a MobileMessageThread
  setData(data) {
    const { body, participants, timestamp } = data;
    this.body = body;
    this.participants = participants.join(",");

    // Manually apply offset to UTC since we have no guarantee that
    // anything else but `UTC` will work in DateTimeFormat.
    let localTime = timestamp - new Date().getTimezoneOffset() * 60 * 1000;
    let options = {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "UTC",
    };
    this.timestamp = new Intl.DateTimeFormat("default", options).format(
      localTime
    );

    this.data = data;
  }

  handleEvent(_event) {
    // console.log(`MMM event ${event.type} thread #${this.data?.id}`);
    if (this.data) {
      // console.log(`MMM dispatching thread open event #${this.data.id}`);
      this.dispatchEvent(
        new CustomEvent("open", { detail: { name: "thread", data: this.data } })
      );
      return;
    }
  }

  render() {
    return html`
      <link rel="stylesheet" href="components/thread_head.css" />
      <div class="container">
        <div class="head">
          <div class="participants">${this.participants}</div>
          <div class="timestamp">${this.timestamp}</div>
        </div>
        <div class="summary">${this.body}</div>
      </div>
    `;
  }
}

customElements.define("thread-head", ThreadHead);
