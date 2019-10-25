const puppeteer = require("puppeteer");
const fs = require("fs");

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1200 });
  await page.goto(
    "https://www.google.nl/search?q=karsens&sxsrf=ACYBGNTJFJSaj4zqWJC6_UfRD3gr9J0iNA:1571942533604&source=lnms&tbm=isch&sa=X&ved=0ahUKEwidj8qixrXlAhWODewKHYqfBn8Q_AUIEygC&biw=1189&bih=723&dpr=2#imgrc=_"
  );

  const IMAGE_SELECTOR2 = "div#rg div div a img";
  const IMAGE_SELECTOR = "#tsf > div:nth-child(2) > div > div.logo > a > img";
  let imageHref = await page.evaluate(sel => {
    return document
      .querySelector(sel)
      .getAttribute("src")
      .replace("/", "");
  }, IMAGE_SELECTOR2);

  console.log(imageHref);
  var viewSource = await page.goto(imageHref);
  fs.writeFile(
    ".googles-20th-birthday-us-5142672481189888-s.png",
    await viewSource.buffer(),
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    }
  );

  //   browser.close();
}

run();
