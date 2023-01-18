// Loader for scripts injected in web sites.

const INJECTED_SCRIPTS = {
//   "https://www.netflix.com": "netflix_tv.js",
};

function canInjectIn(origin) {
  return !!INJECTED_SCRIPTS[origin];
}

// Returns the script text, or rejects if no script is registered for this origin.
async function injectedScriptLoader(origin) {
  let url = INJECTED_SCRIPTS[origin];
  if (!url) {
    throw new Error(`No script to inject in ${origin}`);
  }

  let response = await fetch(
    `http://shared.localhost:${window.config.port}/js/injected_scripts/${url}`
  );
  let text = await response.text();
  return text.replaceAll("__PORT__", `${window.config.port}`);
}
