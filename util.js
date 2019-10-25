const request = require("request");
const fs = require("fs");

var download = function(uri, directory, filename, callback) {
  request.head(uri, function(err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    request(uri)
      .pipe(fs.createWriteStream(directory + "/" + filename))
      .on("close", callback);
  });
};

const splitName = name => {
  const words = name.split(" ");
  const firstName = words[0];
  const lastName = words.splice(1, words.length).join(" ");

  return { firstName, lastName };
};

const nameWithDashes = name => {
  const words = name.toLowerCase().split(" ");
  const nameDashes = words.join("-");

  return nameDashes;
};

module.exports = { download, splitName, nameWithDashes };
