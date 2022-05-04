// This class manages uploads to Estuary.

const ESTUARY_ENDPOINT = "https://shuttle-4.estuary.tech/content/add";

export class Estuary extends EventTarget {
  constructor(key) {
    super();
    this.key = key;
  }

  log(msg) {
    console.log(`Estuary: ${msg}`);
  }

  upload(blob) {
    this.log(`upload with key ${this.key}`);
    const formData = new FormData();
    formData.append("data", blob);
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
      this.log(`load`);
      if (xhr.response.error || !xhr.response.cid) {
        this.dispatchEvent(new CustomEvent("error"));
      } else {
        this.dispatchEvent(
          new CustomEvent("success", { detail: xhr.response })
        );
      }
    };

    xhr.responseType = "json";
    xhr.open("POST", ESTUARY_ENDPOINT);
    xhr.setRequestHeader("Authorization", `Bearer ${this.key}`);
    xhr.send(formData);
  }
}
