
// Immediately-invoked function expression
(function() {
  // Load the script
  const jqueryScript = document.createElement("script");
  jqueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js';
  jqueryScript.type = 'text/javascript';
  jqueryScript.addEventListener('load', () => {
    console.log(`jQuery ${$.fn.jquery} has been loaded successfully!`);
    // use jQuery below
  });
  document.head.appendChild(jqueryScript);
  const bootstrapScript = document.createElement("script");
  bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js';
  bootstrapScript.type = 'text/javascript';
  bootstrapScript.addEventListener('load', () => {
    console.log(`Bootstrap has been loaded successfully!`);
    // use Bootstrap below
  });
  document.head.appendChild(bootstrapScript);
  
  const bootstrapCSS = document.createElement("link");
  bootstrapCSS.rel = 'stylesheet';
  bootstrapCSS.type = "text/css";
  bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css';
  document.head.appendChild(bootstrapCSS);
})();