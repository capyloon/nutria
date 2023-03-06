document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");

  document.getElementById("loader").onclick = async () => {
    let output = document.getElementById("result");
    try {
      let response = await fetch("https://fosstodon.org/@capyloon.json");
      output.textContent = `HTTP status: ${response.status} ${response.statusText}`;
    } catch (e) {
      console.error(e);
      output.textContent = `Failed to fetch content: ${e}`;
    }
  };
});
