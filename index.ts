const puppeteer = require("puppeteer");
const sanitizer = require("string-sanitizer");
var fs = require("fs");

const PAGE_URL =
  "https://www.hansimmo.be/appartement-te-koop-in-borgerhout/10161";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(PAGE_URL);

  const items = await page.evaluate(() => {
    // write your querySelectors here
    var description = document.querySelector("#description")?.innerHTML
    var title = document.querySelector("#detail-title > .category")?.innerHTML
    var price = document.querySelector("#detail-title > .price")?.innerHTML
    var address= document.querySelector("#detail-title > .address")?.innerHTML
    
    return {
      description: description,
      title: title,
      price: price,
      address: address,
    };
  });

  items.description = sanitizer.sanitize.keepSpace(items.description)
  
  console.log(items);

  fs.writeFile ("input.json", JSON.stringify(items), function(err) {
    if (err) throw err;
    console.log('complete');
    }
  );

  return items;
};

main().then((data) => console.log(data));
