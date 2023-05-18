// This class manages uploads to a filecoin pinning service.
// For now hardcoded to w3.storage.

const WEB3_STORAGE_ENDPOINT = "https://api.web3.storage/upload";

export class FileCoinService extends EventTarget {
  constructor(key) {
    super();
    this.key = key;
  }

  log(msg) {
    console.log(`FileCoinService: ${msg}`);
  }

  upload(blob, name) {
    this.log(`upload with key ${this.key}`);
    const formData = new FormData();
    formData.append("file", blob, name);
    const xhr = new XMLHttpRequest();

    const upload = xhr.upload;

    upload.onloadstart = () => {
      this.log("loadstart");
      this.dispatchEvent(new CustomEvent("start"));
    };

    upload.onabort = () => {
      this.log("abort");
      this.dispatchEvent(new CustomEvent("abort"));
    };

    upload.ontimeout = () => {
      this.log("timeout");
      this.dispatchEvent(new CustomEvent("timeout"));
    };

    upload.onerror = () => {
      this.log("error");
      this.dispatchEvent(new CustomEvent("error"));
    };

    upload.onprogress = (event) => {
      this.log("progress");
      this.dispatchEvent(
        new CustomEvent("progress", {
          detail: {
            loaded: event.loaded,
            total: event.total,
            lengthComputable: event.lengthComputable,
          },
        })
      );
    };

    // TODO: manage other xhr events.
    xhr.onload = () => {
      this.log(`load ${xhr.status} ${xhr.statusText}`);
      if (!xhr.response || xhr.status < 200 || xhr.status >= 300) {
        this.dispatchEvent(new CustomEvent("error"));
      } else {
        // this.log(`Success: ${JSON.stringify(xhr.response)}`);
        this.dispatchEvent(
          new CustomEvent("success", { detail: xhr.response })
        );
      }
    };

    xhr.responseType = "json";
    xhr.open("POST", WEB3_STORAGE_ENDPOINT);
    xhr.setRequestHeader("Authorization", `Bearer ${this.key}`);
    xhr.send(formData);
  }
}
