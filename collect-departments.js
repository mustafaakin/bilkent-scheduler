const puppeteer = require('puppeteer');
const fs = require("fs");
(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});
    await page.goto('https://stars.bilkent.edu.tr/homepage/plain_offerings');

    await new Promise(r => setTimeout(r, 10000));

    const departments = await page.$$eval("table#ccTable>tbody>tr", els => els.map(c => c.id))

    const allData = {}
    for (let department of departments) {
        allData[department] = await page.$$eval(`tr[id='${department}']>td`, function (els) {
            return {
                id: els[0].textContent.trim(),
                name: els[1].textContent.trim(),
                faculty: els[2].textContent.trim(),
            }
        })
    }

    fs.writeFileSync("src/departments.json", JSON.stringify(allData, null, 2))
    await browser.close()
})()