const puppeteer = require("puppeteer");
const fs = require("fs");

const { download, splitName, nameWithDashes } = require("./util");

const MAX_PROFILES = 12;

// `https://www.google.nl/search?q=${name}&source=lnms&tbm=isch`,
// selector: "div#rg div div a img"

/**
 * steps LinkedIn:
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
const runLinkedin = async name => {
  const { firstName, lastName } = splitName(name);

  if (!firstName || !lastName) {
    console.log("No full name specified");
    return [];
  }
  const url = `https://www.linkedin.com/people/search?firstName=${firstName}&lastName=${lastName}`;

  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
  );
  await page.setViewport({ width: 1200, height: 1200 });

  await page.goto(url);

  await page.waitFor(1000);

  await page.screenshot({
    type: "jpeg",
    path: "./screenshot.jpeg",
    quality: 100
  });

  let profiles = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        'ul li.result-card img.profile-result-card[src^="https://media"]'
      )
    ).map(element => ({
      image: element.getAttribute("src"),
      name: element.getAttribute("alt")
    }));
  });

  console.log("GOT ", profiles.length, " Profiles");

  browser.close();

  const filteredProfiles = profiles
    .filter(profile => profile.name.toLowerCase() === name.toLowerCase())
    .slice(0, MAX_PROFILES);

  filteredProfiles.map(({ image, name }, index) => {
    if (image) {
      const filename = `${index}.png`;

      const dir = `downloads/${nameWithDashes(name)}`;
      download(image, dir, filename, () =>
        console.log("Saved ", image, " to ", filename)
      );
    }
  });
};

const [cmd, path, command, ...suffix] = process.argv;
runLinkedin(command);
