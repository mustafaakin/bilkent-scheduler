const puppeteer = require("puppeteer");
const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://stars.bilkent.edu.tr/homepage/plain_offerings");

  await prompt("Press enter after you entered the  validation code. ");

  const departments = await page.$$eval("table#ccTable>tbody>tr", (els) =>
    els.map((c) => c.id)
  );

  const allData = {};
  for (let department of departments) {
    allData[department] = await page.$$eval(
      `tr[id='${department}']>td`,
      function(els) {
        return {
          id: els[0].textContent.trim(),
          name: els[1].textContent.trim(),
          faculty: els[2].textContent.trim(),
        };
      }
    );
  }

  fs.writeFileSync("src/departments.json", JSON.stringify(allData, null, 2));
  await browser.close();
})();
