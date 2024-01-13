// secretWordsEncoded.js contains the base64 encoded strings in an array called secretWordsEncoded. Let's import it here.
require ('./secretWordsEncoded.js');

const fs = require("fs");

// decode the base64 encoded strings

function decodeUTF8(s) {
  return decodeURIComponent(escape(atob(s)));
}

const out = fs.createWriteStream("outputfile.txt", { encoding: "utf8" });

for (var i = 0; i < secretWordsEncoded.length; i++) {
  // print out the decoded strings (UTF8) together with the original strings
  console.log(decodeUTF8(secretWordsEncoded[i]) + " " + secretWordsEncoded[i]);

  out.write(decodeUTF8(secretWordsEncoded[i]) + " " + secretWordsEncoded[i] + "\n");
}
