const fs = require("fs")
const a = JSON.parse(fs.readFileSync('src/data.json').toString())

const selected = [{
  department: "CS",
  code: "CS 101"
}, {
  department: "CS",
  code: "CS 102"
}, {
  department: "CS",
  code: "CS 201"
},{
  department: "CS",
  code: "CS 202"
}]


function calculate(sections, currentSchedule, index) {
  if (index === selected.length) {
    console.log(sections)
    return
  }

  let course = selected[index]
  let data = a[course.department][course.code]

  for(let key in data.sections){
    let arr = []
    let section = data.sections[key]

    let conflict = false
    for(let slot of section.schedule){
      let key = slot.day + "/" + slot.start
      if ( currentSchedule[key]){
        conflict = true
        break
      }
      currentSchedule[key] = true
    }

    if ( conflict){
      continue
    }

    arr = [...sections]
    arr.push(section.name)
    calculate(arr, Object.assign({}, currentSchedule),index + 1)
  }
}


calculate([], {}, 0)


