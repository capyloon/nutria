// Utility to publish and retrieve password protected resources.

class PasswordBasedSecret {
  constructor(password) {
    if (!password) {
      // Generate a pseudo-random password.
      password = "";
      for (let i = 0; i < 32; i++) {
        // random in a..z
        password += String.fromCharCode(97 + Math.floor(Math.random() * 26));
      }
    }
    this.password = password;
  }

  async getKeyMaterial() {
    let enc = new TextEncoder();
    return await window.crypto.subtle.importKey(
      "raw",
      enc.encode(this.password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
  }

  async getSymKey() {
    let keyMaterial = await this.getKeyMaterial(this.password);
    let enc = new TextEncoder();
    return await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode("capyloon-salt"),
        iterations: 400000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  async encrypt(plaintext) {
    return await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(1),
      },
      await this.getSymKey(this.password),
      plaintext
    );
  }

  async decrypt(ciphertext) {
    return await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(1),
      },
      await this.getSymKey(this.password),
      ciphertext
    );
  }
}

class IpfsPublisher {
    constructor() {
        
    }

    log(msg) {
        this.console(`IpfsPublisher: ${msg}`);
    }

    publish(blob) {
        let encrypter = new PasswordBasedSecret();
    }
}