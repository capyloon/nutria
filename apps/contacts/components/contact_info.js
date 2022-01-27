// <contact-info> custom element.
// A simple display of a contact's data.

class ContactInfo extends HTMLElement {
  constructor(contact, open = false) {
    super();

    this.contact = contact;
    this.open = open;
    if (open) {
        this.classList.add("open");
    }

    let tel = "";
    let sms = "";
    let email = "";

    if (contact.tel && contact.tel[0]) {
      let value = contact.tel[0].value;
      tel = `<a href="tel:${value}"><lucide-icon kind="phone"></lucide-icon><span>${value}</span></a>`;
      sms = `<a href="sms:${value}"><lucide-icon kind="message-circle"></lucide-icon><span>${value}</span></a>`;
    }

    
    if (contact.email && contact.email[0]) {
      let value = contact.email[0].value;
      email = `<a href="mailto:${value}"><lucide-icon kind="mail"></lucide-icon><span>${value}</span></a>`;
    }

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <link rel="stylesheet" href="components/contact_info.css">
      <div class="contact">
        <div class="header">${contact.name || "Unknown"}</div>
        <div class="details">
          ${tel}
          ${sms}
          ${email}
        </div>
      </div>
      `;

    this.setAttribute("id", `contact-${contact.id}`);
    shadow.querySelector(".header").addEventListener("click", () => {
      this.classList.toggle("open");
      this.open = !this.open;
      this.dispatchEvent(
        new CustomEvent("contact-open", {
          detail: { id: this.contact.id, open: this.open },
          bubbles: true,
        })
      );
    });
  }

  close() {
    this.classList.remove("open");
    this.open = false;
  }

  open() {
    this.classList.add("open");
    this.open = true;
  }
}

customElements.define("contact-info", ContactInfo);
