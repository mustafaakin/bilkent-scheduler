function find(allData, selected) {
  let combinations = [];

  function calculate(sections, currentSchedule, index) {
    if ( selected.length === 0) return

    if (index === selected.length)  {
      combinations.push(sections)
      return
    }

    let course = selected[index]

    let data = allData[course.department][course.course]
    for (let key in data.sections) {
      let arr = []
      let section = data.sections[key]

      let conflict = false
      for (let slot of section.schedule) {
        let key = slot.day + "/" + slot.start
        if (currentSchedule[key]) {
          conflict = true
          break
        }
        currentSchedule[key] = true
      }

      if (conflict) {
        continue
      }

      arr = [...sections]
      arr.push(section.name)
      calculate(arr, Object.assign({}, currentSchedule), index + 1)
    }
  }

  calculate([], {}, 0)
  return combinations
}

module.exports = find
/*
const fs = require("fs")
const allData = JSON.parse(fs.readFileSync('data.json').toString())
const selected = [
  {code: "CS 101", department: "CS"},
  {code: "CS 102", department: "CS"}
]
console.log(find(allData, selected))
*/

