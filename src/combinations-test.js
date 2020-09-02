const fs = require("fs")
const allData = JSON.parse(fs.readFileSync('data.json').toString())
const find = require("./combinations");

const selected = [
  {course: "CS 101", department: "CS"},
]

console.log(find(allData, selected))
