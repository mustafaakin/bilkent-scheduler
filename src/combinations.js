function find(allData, selected, dummyCourses, filteredSections, filteredInstructors, filteredSlots) {
  let combinations = [];

  function calculate(sections, currentSchedule, index) {
    if ( selected.length === 0) {
      if (dummyCourses.length !== 0) combinations.push(dummyCourses)
      return
    }

    if (index === selected.length) {
      if (dummyCourses.length !== 0) sections = sections.concat(dummyCourses)
      combinations.push(sections)
      return
    }

    let course = selected[index]

    let data = allData[course.department][course.course]
    for (let key in data.sections) {
      let arr = []
      let section = data.sections[key]

      if ( filteredSections.indexOf(key) !== -1) continue
      if ( filteredInstructors.indexOf(section.instructor) !== -1) continue

      let schedule = Object.assign({}, currentSchedule)
      let conflict = false
      for (let slot of section.schedule) {
        let key = slot.day + "/" + slot.start
        if ( filteredSlots.indexOf(key) !== -1 || currentSchedule[key]){
          conflict = true
          break
        }
        schedule[key] = true
      }

      if (conflict) {
        continue
      }

      arr = [...sections]
      arr.push(section.name)
      calculate(arr, Object.assign({}, schedule), index + 1)
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

