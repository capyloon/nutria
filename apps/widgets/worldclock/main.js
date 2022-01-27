// A timer that will tick at every new minute.
// It fires a "tick" event when time is up.
class MinuteTimer extends EventTarget {
  constructor() {
    super();
    // console.log(`MinuteTimer::constructor`);
    this.suspended = false;
    this.schedule();
  }

  schedule() {
    // console.log(`MinuteTimer::schedule suspended=${this.suspended}`);
    if (this.suspended) {
      return;
    }

    let now = new Date();
    // 61 to help with triggering early during the next minute.
    let seconds = 61 - now.getSeconds();

    // console.log(`MinuteTimer: will tick in ${seconds}s`);

    this.nextTick = window.setTimeout(() => {
      this.dispatchEvent(new CustomEvent("tick"));
      this.nextTick = null;
      this.schedule();
    }, seconds * 1000);
  }

  suspend() {
    if (this.nextTick) {
      window.clearTimeout(this.nextTick);
      this.nextTick = null;
    }
    this.suspended = true;
  }

  resume() {
    if (!this.suspended) {
      return;
    }

    this.suspended = false;
    this.schedule();
  }
}

class ClockDisplay extends HTMLElement {
  constructor(name, tz) {
    super();

    this.name = name;
    this.tz = tz;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="name">${this.name}</div>
      <div class="date"></div>
      `;

    this.date = this.querySelector(".date");
    this.update(Date.now());
  }

  update(now) {
    this.date.textContent = new Intl.DateTimeFormat("default", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: this.tz,
    }).format(now);
  }
}

customElements.define("clock-display", ClockDisplay);

function addClock(name, tz) {
  return window.container.appendChild(new ClockDisplay(name, tz));
}

document.addEventListener("DOMContentLoaded", () => {
  let clocks = [];
  [
    { name: "San Francisco", tz: "America/Los_Angeles" },
    { name: "Paris", tz: "Europe/Paris" },
    { name: "Taipei", tz: "Asia/Taipei" },
  ].forEach((entry) => {
    clocks.push(addClock(entry.name, entry.tz));
  });

  let timer = new MinuteTimer();
  timer.addEventListener("tick", () => {
    let now = Date.now();
    clocks.forEach((clock) => {
      clock.update(now);
    });
  });
});
