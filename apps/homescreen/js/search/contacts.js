// Search engine for contacts.

class ContactsSearch {
  constructor() {}

  // Returns a Promise that resolves to a result set.
  async search(query, count) {
    console.log(`ContactsSearch::search ${query}`);

    let results = [];

    await contentManager.searchContacts(query, count, (result) => {
      console.log(`Contact result: ${JSON.stringify(result)}`);
      if (result) {
        let main = result.variants.default;
        results.push({
          name: main.name,
          phone: main.phone[0],
          email: main.email[0],
          icon: result.variants.photo,
        });
      }
      return true;
    });

    // Reverse result order to better fit the UI and display the first
    // results closer to the keyboard.
    return results.reverse();
  }
}

class ContactsSource extends SearchSource {
  constructor(sectionName) {
    super(sectionName, new ContactsSearch());
  }

  domForResult(result) {
    let node = document.createElement("div");
    node.classList.add("contact");

    let initials = result.name
      .split(" ")
      .map((s) => s[0])
      .join("");
    let icon = document.createElement("sl-avatar");
    if (result.icon) {
      icon.setAttribute("image", result.icon);
    }
    icon.setAttribute("initials", initials);
    icon.setAttribute("alt", result.name);
    node.appendChild(icon);

    let doc = document.createElement("span");
    doc.textContent = result.name;

    node.appendChild(doc);

    if (result.phone) {
      // <a href="tel:${tel}"><sl-icon name="phone"></sl-icon></a>
      let anchor = document.createElement("a");
      anchor.setAttribute("href", `tel:${result.phone}`);
      anchor.setAttribute("target", "_blanck");
      anchor.classList.add("contact-link");
      let icon = document.createElement("sl-icon");
      icon.setAttribute("name", "phone");
      anchor.appendChild(icon);
      node.appendChild(anchor);
    }

    if (result.email) {
      // <a href="mailto:${email}"><sl-icon name="mail"></sl-icon></a>
      let anchor = document.createElement("a");
      anchor.setAttribute("href", `mailto:${result.email}`);
      anchor.setAttribute("target", "_blanck");
      anchor.classList.add("contact-link");
      let icon = document.createElement("sl-icon");
      icon.setAttribute("name", "mail");
      anchor.appendChild(icon);
      node.appendChild(anchor);
    }

    let filler = document.createElement("div");
    filler.classList.add("flex-fill");
    node.appendChild(filler);

    let icons = document.createElement("div");
    icons.classList.add("icons");
    let plus = document.createElement("sl-icon");
    plus.setAttribute("name", "plus");
    icons.appendChild(plus);
    let addHome = document.createElement("sl-icon");
    addHome.setAttribute("name", "home");
    icons.appendChild(addHome);
    node.appendChild(icons);

    return node;
  }

  activate(result) {
    // TBD
  }
}
