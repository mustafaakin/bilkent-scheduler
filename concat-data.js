const fs = require("fs");

let departments = fs.readdirSync("data/").filter(
    a => a !== "version.json"
);

let all = {};

for (let department of departments) {
    let courses = fs.readdirSync(`data/${department}`);

    let departmentData = {};
    for (let course of courses) {
        const courseData = JSON.parse(fs.readFileSync(`data/${department}/${course}`).toString())

        departmentData[courseData.code] = courseData
    }
    all[department] = departmentData
}

let pretty = JSON.stringify(all, null, 2)

fs.writeFileSync("src/data.json", pretty)