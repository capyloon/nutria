import {
  LocalizeController
} from "./chunk.EBGTCCKY.js";
import {
  e,
  n
} from "./chunk.72DLNKYZ.js";
import {
  s
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// src/components/format-date/format-date.ts
var SlFormatDate = class extends s {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.date = new Date();
    this.hourFormat = "auto";
  }
  render() {
    const date = new Date(this.date);
    const hour12 = this.hourFormat === "auto" ? void 0 : this.hourFormat === "12";
    if (isNaN(date.getMilliseconds())) {
      return void 0;
    }
    return this.localize.date(date, {
      weekday: this.weekday,
      era: this.era,
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      timeZoneName: this.timeZoneName,
      timeZone: this.timeZone,
      hour12
    });
  }
};
__decorateClass([
  e()
], SlFormatDate.prototype, "date", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "lang", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "weekday", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "era", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "year", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "month", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "day", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "hour", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "minute", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "second", 2);
__decorateClass([
  e({ attribute: "time-zone-name" })
], SlFormatDate.prototype, "timeZoneName", 2);
__decorateClass([
  e({ attribute: "time-zone" })
], SlFormatDate.prototype, "timeZone", 2);
__decorateClass([
  e({ attribute: "hour-format" })
], SlFormatDate.prototype, "hourFormat", 2);
SlFormatDate = __decorateClass([
  n("sl-format-date")
], SlFormatDate);

export {
  SlFormatDate
};
