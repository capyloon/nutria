// Search engine for contacts.

class ContactsSearch {
  constructor() {
    this.service = window.apiDaemon.getContactsManager();
  }

  // Returns a Promise that resolves to a result set.
  async search(what, count) {
    console.log(`ContactsSearch::search ${what}`);
    let res = [];
    let contacts = await this.service;
    let lib = window.apiDaemon.getLibraryFor("ContactsManager");
    try {
      let cursor = await contacts.find(
        {
          sortBy: lib.SortOption.NAME,
          sortOrder: lib.Order.ASCENDING,
          filterValue: what,
          filterOption: lib.FilterOption.CONTAINS,
          filterBy: [
            lib.FilterByOption.NAME,
            lib.FilterByOption.GIVEN_NAME,
            lib.FilterByOption.EMAIL,
            lib.FilterByOption.FAMILY_NAME,
            lib.FilterByOption.TEL,
          ],
          onlyMainData: true,
        },
        count
      );

      let done = false;
      while (!done) {
        try {
          let contacts = await cursor.next();
          done = contacts.length === 0;
          contacts.forEach((contact) => {
            res.push({
              name: contact.name,
              tel: contact.tel[0].value,
              email: contact.email[0].value,
            });
          });
        } catch (e) {
          done = true;
        }
      }

      cursor.release();
    } catch (e) {
      // No error processing needed.
    }

    return Promise.resolve(res);
  }
}

class ContactsSource extends SearchSource {
  constructor(sectionName) {
    super(sectionName, new ContactsSearch());
  }

  domForResult(result) {
    let node = document.createElement("div");
    node.classList.add("contact");

    if (result.icon) {
      let icon = document.createElement("img");
      icon.setAttribute("src", result.icon);
      icon.setAttribute("alt", result.name);
      node.appendChild(icon);
    }

    let doc = document.createElement("span");
    doc.textContent = result.name;

    node.appendChild(doc);

    if (result.tel) {
      // <a href="tel:${tel}"><sl-icon name="phone"></sl-icon></a>
      let anchor = document.createElement("a");
      anchor.setAttribute("href", `tel:${result.tel}`);
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
