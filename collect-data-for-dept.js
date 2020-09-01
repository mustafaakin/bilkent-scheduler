const puppeteer = require('puppeteer');
const fs = require("fs");

async function getSchedule(page) {
  return await page.$$eval("#schedule>tbody>tr>td", function (elements) {
    // Meaning empty course, not even worth collecting
    if (elements.length !== 9 * 14) return null;

    let slots = []
    // There are 14 time slots in a day
    for (let i = 0; i < 14; i++) {
      // There are 9 columns, 7 days, 2 time columns
      let time = elements[9 * i].textContent.split(/\s+/g)
      // Time is always in the column 0 and 6
      for (let j of [1, 2, 3, 4, 5, 7, 8]) {
        let element = elements[9 * i + j];
        let a = element.textContent.trim()

        // They are CSS classes indicating the type of the slot
        const classes = {
          "cl_ders_o": "Online Only Lecture",
          "cl_ders_h": "Hybrid Lecture",
          "cl_lab_h": "Hybrid Lab/Studio/Others",
          "cl_lab_o": "Face-to-face Only Lab/Studio/Others",
        }

        const days = {
          1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 7: "Saturday", 8: "Sunday"
        }

        // If it has no class, it is not available.
        if (classes[element.className]) {
          slots.push({
            day: days[j],
            start: time[0],
            end: time[1],
            place: a,
            class: classes[element.className]
          })
        }
      }
    }
    return slots
  });
}

async function getSectionData(page, section) {
  return await page.$$eval(`tr[id='${section}']>td`, function (elements) {
    return {
      "instructor": elements[1].textContent.trim(),
      "quota": elements[2].textContent.trim(),
      "total_quota": parseInt(elements[3].textContent.trim()),
      "enrollment": {
        "mandatory": parseInt(elements[4].textContent.trim()),
        "elective": parseInt(elements[5].textContent.trim()),
      }
    }
  })
}

async function getCourseData(page, course) {
  return await page.$$eval(`tr[id='${course}']>td`, function (elements) {
    return {
      "name": elements[1].textContent.trim(),
      "lectureHours": {
        "hybrid": parseInt(elements[2].textContent.trim()),
        "online": parseInt(elements[3].textContent.trim()),
      },
      "labStudioOthersHours": {
        "hybrid": parseInt(elements[4].textContent.trim()),
        "faceToFace": parseInt(elements[5].textContent.trim()),
      },
      "credits": {
        "bilkent": parseFloat(elements[6].textContent.trim()),
        "ECTS": parseFloat(elements[7].textContent.trim()),
      }
    }
  })
}

(async () => {
  try {
    fs.mkdirSync("data")
  } catch (ignore) {
  }

  let departments = Object.keys(JSON.parse(fs.readFileSync("src/departments.json").toString()))
  // departments = departments.splice(departments.indexOf("MSC"))
  departments = ["MATH", "PHYS"]
  console.log(departments)
  for (let department of departments) {
    console.log("Initializing for " + department)
    // const department = "ADA"
    try {
      fs.mkdirSync("data/" + department)
    } catch (ignore) {
    }

    const browser = await puppeteer.launch({headless: false, slowMo: 300});
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});
    await page.goto('https://stars.bilkent.edu.tr/homepage/plain_offerings');
    await page.click(`tr[id='${department}'`)
    await page.click("input#detailsButton")

    const courses = await page.$$eval("#courses>tbody>tr", els => els.map(c => c.id))
    for (let course of courses) {
      // Go the the course, it is redundant for the first course but leaving as-is for simplicity
      await page.click(`tr[id='${course}']`)

      const courseData = await getCourseData(page, course)
      courseData.code = course
      courseData.sections = {}
      const sections = await page.$$eval("#sections>tbody>tr", els => els.map(c => c.id))
      for (let section of sections) {
        // Go to each section
        console.log(`Section: ${section}`)
        await page.click(`tr[id='${section}']`)

        let sectionData = await getSectionData(page, section);
        let schedule = await getSchedule(page);
        sectionData.schedule = schedule
        sectionData.name = section

        if (!schedule || schedule.length === 0) {
          // Some courses have no schedule or an empty one which is not good for scheduling purposes
          continue
        }

        courseData.sections[section] = sectionData
      }

      fs.writeFileSync(`data/${department}/${course}.json`, JSON.stringify(courseData, null, 2))
    }

    await browser.close()
  }
})();