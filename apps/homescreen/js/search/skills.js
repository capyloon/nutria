// Search engine for apps installed locally.

class Skill {
  constructor(skill) {
    this.skill = skill;
    if (this.skill?.trigger) {
      this.parseTrigger();
    }
  }

  static splitOnBlank(input, lowerCase = false) {
    let initial = lowerCase ? input.toLowerCase() : input;
    return initial.split(" ").map((item) => {
      return item.trim();
    });
  }

  parseTrigger() {
    let words = Skill.splitOnBlank(this.skill.trigger, true);
    this.trigger = [];
    this.help = "> ";

    // If a "word" starts with { we parse the inner content, otherwise
    // it's an exact match.
    words.forEach((word) => {
      if (word.startsWith("{")) {
        let optional = false;
        if (word.endsWith("}?")) {
          optional = true;
        }
        let last = word.indexOf("}");
        if (last !== -1) {
          word = word.substring(1, last);
          let params = word.split(":").map((item) => {
            return item.trim();
          });
          if (params.length === 2) {
            if (
              ["string", "phone", "email", "int", "contact"].includes(params[1])
            ) {
              this.trigger.push({ type: params[1], name: params[0], optional });
              if (optional) {
                this.help += `(${params[0]}) `;
              } else {
                this.help += `${params[0]} `;
              }
            }
          }
        }
      } else {
        this.trigger.push({ type: "literal", value: word });
        this.help += `${word} `;
      }
    });

    console.log(
      `Skill: Parsed trigger is ${JSON.stringify(this.trigger)}, help is ${
        this.help
      }`
    );
  }

  // If the request matches the trigger, returns an object with the params value
  // filled.
  matches(request) {
    let index = 0;
    let data = {};
    let partial = false;

    for (let item of request) {
      if (index == this.trigger.length) {
        // We are past the trigger items, just bail out.
        return { matches: false, partial, description: this.help };
      }

      let trigger = this.trigger[index];
      // The type of the item must match with the type of trigger, except
      // for literal values where the value needs to match.
      if (trigger.type == "literal" && item.value) {
        let itemValue =
          typeof item.value.toLowerCase === "function"
            ? item.value.toLowerCase()
            : item.value;
        if (trigger.value !== itemValue) {
          // The "partial" value depends on whether we get a partial string match.
          partial = trigger.value.startsWith(itemValue);
          return { matches: false, partial, description: this.help };
        }
        // No need to add literal values to the result, but flag a partial match
        partial = true;
      } else if (trigger.type == item.type) {
        data[trigger.name] = item.value;
        partial = true;
      } else {
        // No match.
        return { matches: false, partial, description: this.help };
      }

      index += 1;
    }

    // If we are not done with the trigger items, check that the remaining
    // ones are optional.
    for (let i = index; i < this.trigger.length; i++) {
      if (!this.trigger[i].optional) {
        // This item is missing.
        return { matches: false, partial, description: this.help };
      }
    }

    return {
      matches: true,
      activity: this.skill.activity,
      icon: this.skill.icon,
      description: this.skill.description,
      data,
    };
  }

  static isEmail(value) {
    const atPos = value.indexOf("@");
    const dotPos = value.indexOf(".");
    return atPos !== -1 && dotPos !== -1 && dotPos > atPos;
  }

  static isPhoneNumber(value) {
    if (value.length < 7) {
      return false;
    }
    const validChars = "0123456789.+-";
    for (let c of value) {
      if (!validChars.includes(c)) {
        return false;
      }
    }
    return true;
  }

  static asInt(value) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
      return Number(value);
    } else {
      return NaN;
    }
  }

  static async isContact(value) {
    // TODO: search with the contact manager.
    // let contacts = await window.apiDaemon.getContactsManager();
  }

  // Simple parser for a request: outputs a an array of typed tokens.
  static async parseRequest(request) {
    let words = Skill.splitOnBlank(request);
    let res = [];
    // For each "word", figure out its type with some heuristics.
    words.forEach((value) => {
      if (Skill.isEmail(value)) {
        res.push({ type: "email", value });
      } else if (Skill.isPhoneNumber(value)) {
        res.push({ type: "phone", value });
      } else if (!isNaN(Skill.asInt(value))) {
        res.push({ type: "int", value: Skill.asInt(value) });
      } else {
        // fallback to string
        res.push({ type: "string", value });
      }
    });
    return res;
  }
}

class SkillsSearch {
  constructor() {
    this.skills = [];
    window.appsManager.addEventListener("app-installed", this);
    window.appsManager.addEventListener("app-uninstalled", this);
    this.updateApps();
  }

  async handleEvent() {
    // The app list has changed, update it in full.
    // TODO: be smarter with add / remove.
    await this.updateApps();
  }

  async updateApps() {
    try {
      let apps = await window.appsManager.getAll();
      apps.forEach((app) => {
        let skills = app.manifest?.b2g_features?.skills;
        if (skills) {
          skills.forEach((skill) => {
            this.skills.push(new Skill(skill));
          });
        }
      });
      console.log(`SkillsSearch: ${this.skills.length} skills available`);
    } catch (e) {
      console.error(`SkillsSearch::updateApps error: ${e}`);
    }
  }

  // Returns a Promise that resolves to a result set.
  async search(what, count) {
    console.log(`SkillsSearch::search ${what} in ${this.skills.length} skills`);
    let res = [];
    let parsedRequest = await Skill.parseRequest(what);
    console.log(`parsedRequest: ${JSON.stringify(parsedRequest)}`);
    this.skills.forEach((skill) => {
      // Check if the skill matches the request.
      let match = skill.matches(parsedRequest);
      if (match.matches || match.partial) {
        console.log(`SkillsSearch match: ${JSON.stringify(match)}`);
        res.push(match);
      }
    });

    return Promise.resolve(res);
  }
}

class SkillsSource extends SearchSource {
  constructor(sectionName) {
    super(sectionName, new SkillsSearch());
    this.preserveCase = true;
  }

  domForResult(result) {
    let node = document.createElement("div");
    node.classList.add("skill");

    let doc = document.createElement("span");
    doc.classList.add("flex-fill");
    if (result.partial) {
      doc.classList.add("partial-match");
    }
    doc.textContent = result.description;
    node.appendChild(doc);

    if (result.matches) {
      let icons = document.createElement("div");
      icons.classList.add("icons");
      let plus = document.createElement("sl-icon");
      plus.setAttribute("name", "plus");
      icons.appendChild(plus);
      let addHome = document.createElement("sl-icon");
      addHome.setAttribute("name", "home");
      icons.appendChild(addHome);
      node.appendChild(icons);

      icons.addEventListener(
        "click",
        (event) => {
          // Add the icon to the homescreen as an activity action.
          event.preventDefault();
          event.stopPropagation();
          SearchSource.closeSearch();
          let action = {
            kind: "activity",
            activity: { name: result.activity, data: result.data },
            title: result.description,
            icon:
              result.icon ||
              `http://branding.localhost:${location.port}/resources/logo.webp`,
          };
          window["actions-wall"].addNewAction(action);
        },
        { once: true, capture: true }
      );
    }

    return node;
  }

  activate(result) {
    // console.log(`Skill Will call activity, result is ${JSON.stringify(result)}`);
    let activity = new WebActivity(result.activity, result.data);
    activity.start().then(
      (res) => {
        console.error(`Skill Result returned by activity: ${res}`);
      },
      (err) => {
        console.error(`Skill Error returned by activity: ${err}`);
      }
    );
  }
}
