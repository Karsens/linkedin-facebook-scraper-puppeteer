const puppeteer = require("puppeteer");
const fs = require("fs");

const splitName = name => {
  const words = name.split(" ");
  const firstName = words[0];
  const lastName = words.splice(1, words.length).join(" ");

  return { firstName, lastName };
};

const nameWithDashes = name => {
  const words = name.split(" ");
  const nameDashes = words.join("-");

  return nameDashes;
};

const run = [
  {
    url: name => `https://www.google.nl/search?q=${name}&source=lnms&tbm=isch`,
    selector: "div#rg div div a img"
  },

  {
    url: name =>
      `https://www.linkedin.com/people/search?firstName=${name.spl}&lastName=karsens`,
    selector: "ul li.result-card img.profile-result-card"
  }
];

/**
 * steps Facebook:
 * 0. provide all names to search to API, separated by ';'
 *
 * 1. for every name, check if results exist already.
 * 2a if they do, return image urls that were already saved on server
 * 2b if not, search for public profiles with name
 *
 * 3. get profile urls of top 3 names that match
 * 4. go to those urls one by one, get image urls of profile pic and other pictures
 * 5. save these pictures on the backend
 *
 */
const runFacebook = async name => {
  const nameDashes = nameWithDashes(name);
  const url = `https://www.facebook.com/public/${nameDashes}`;

  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1200 });
  await page.goto(url);

  let imageHref = await page.evaluate(() => {
    const images = Array.from(
      document.querySelectorAll("div.clearfix div img")
    ).map(element => ({
      image: element.getAttribute("src"),
      name: element.getAttribute("alt")
    }));

    return images;
    //   .replace("/", "");
  });

  console.log("HREF", imageHref);

  //   browser.close();
};

const [cmd, path, command, ...suffix] = process.argv;
runFacebook(command);
