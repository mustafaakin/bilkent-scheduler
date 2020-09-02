<template>
  <div class="ui container">
    <sui-form>
      <sui-form-fields fields="sixteen">
        <sui-form-field width="eight">
          <label>Department</label>
          <sui-dropdown
              placeholder="Select a department"
              search
              fluid
              icon="search"
              selection
              :options="departments"
              v-model="selectedDepartment"
          />
        </sui-form-field>
        <sui-form-field width="eight">
          <label>Course</label>
          <sui-dropdown
              placeholder="Select a course"
              search
              fluid
              icon="search"
              selection
              :options="courses"
              v-model="selectedCourse"
          />
        </sui-form-field>
      </sui-form-fields>
    </sui-form>

    <button class="ui right floated icon button primary" @click="nextSchedule()" :disabled="schedules.length <= 1">
      Next
      <i class="icon right arrow"></i>
    </button>
    <button class="ui right floated icon button primary" @click="prevSchedule()" :disabled="schedules.length <= 1">
      <i class="icon left arrow"></i>
      Prev
    </button>
    <span style="float: right; padding-top:10px;padding-right:20px">
      <span v-if="schedules.length > 0"><b>{{ scheduleIndex + 1 }}</b> of <b>{{ schedules.length }}</b></span>
      <span v-if="schedules.length === 0">No valid schedule could be found.</span>
    </span>

    <div class="">
      <div class="ui labels">
        <a class="ui white label" v-if="selectedCourses.length === 0" style="cursor: default ">
          No course selected
        </a>
        <a class="ui label" v-for="(s,i) in selectedCourses" v-bind:key="s.course" :style="`background: ${colors[i]}; color: white`" @click="removeCourse(s.course)">
          {{ s.course }}
          <i class="icon close"></i>
        </a>
      </div>
    </div>

    <table class="ui celled definition compact table">
      <thead>
      <tr>
        <th style="width: 9%"></th>
        <th style="width: 13%" v-for="d in dayNames" v-bind:key="d" class="center aligned">{{ d }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="i in timeSlots" v-bind:key="i" style="height: 35px">
        <td class="right aligned">{{ i }}</td>
        <td v-for="j in dayNames" v-bind:key="j" class="center aligned" @click="filterSlot(i,j)" v-bind:class="{'active': isSlotReserved(i,j)}">
          <span v-if="isSlotReserved(i,j)"></span>
          <span v-if="getTimeSlot(i,j)" :title="getTimeSlot(i,j).place + '\n' + getTimeSlot(i,j).type" :style="`background-color: ${findColor(getTimeSlot(i,j))}; color: white; padding: 2px 10px;border-radius: 5px;font-size: 12px;font-weight: bold;`">
          {{ getTimeSlot(i, j).name }}
        </span>
        </td>
      </tr>
      </tbody>
    </table>

    <br/>

    <div class="ui grid">
      <div class="eight wide column">
        <h4 class="ui header">
          <i class="settings icon"></i>
          <div class="content">
            Selection Details
            <div class="sub header">Details about this specific combination.</div>
          </div>
        </h4>
        <table class="ui very basic table very compact">
          <thead>
          <tr>
            <th width="50%">Course</th>
            <th width="10%">Section</th>
            <th width="60%">Instructor</th>
          </tr>
          </thead>
          <tbody v-if="currentScheduleDetails">
          <tr v-for="d in currentScheduleDetails" v-bind:key="d.section">
            <td><b>{{ d.courseCode }}</b>
              <br/>
              <small>{{ d.courseName }}</small>
            </td>
            <td>
              <a style="cursor: pointer" @click="addSectionFilter(d.section)">
                {{ d.section.split("-")[1] }}
              </a>
            </td>
            <td>
              <a style="cursor: pointer" @click="addInstructorFilter(d.data.instructor)">
                {{ d.data.instructor }}
              </a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="four wide column">
        <h4 class="ui header">
          <i class="icon filter"></i>
          <div class="content">
            Filtered Instructors
            <div class="sub header">One can have a preference.</div>
          </div>
        </h4>

        <p v-if="filteredInstructors.length === 0">Click a instructor name to filter them if you wish.</p>

        <div class="ui labels">
          <a class="ui label" v-for="f in filteredInstructors" v-bind:key="f" @click="removeInstructorFilter(f)">
            {{ f }}
            <i class="delete icon"></i>
          </a>
        </div>
      </div>

      <div class="four wide column">
        <h4 class="ui header">
          <i class="icon table"></i>
          <div class="content">
            Filtered Sections
            <div class="sub header">Want same section with your friend?</div>
          </div>

        </h4>
        <p v-if="filteredSections.length === 0">Click a section to add to filter.</p>

        <div class="ui labels">
          <a class="ui label" v-for="f in filteredSections" v-bind:key="f" @click="removeSectionFilter(f)">
            {{ f }}
            <i class="delete icon"></i>
          </a>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import coursesData from '../data.json'
import departmentsData from '../departments.json'
import find from '../combinations.js'

export default {
  name: "Schedule",
  data() {
    return {
      dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      timeSlots: ["08:30", "09:30", "10:30", "11:30", "12:20", "13:30", "14:30", "15:30", "16:20", "17:40", "18:40", "19:30", "20:10", "21:10"],
      weekendTimeSlots: {
        "12:20": "12:30",
        "16:20": "16:30",
        "17:40": "17:30",
        "18:40": "18:30"
      },
      departments: Object.keys(departmentsData).map(function (v) {
        return {
          text: v + " - " + departmentsData[v].name,
          value: v,
        }
      }),
      selectedCourses: [],
      filteredInstructors: [],
      filteredSections: [],
      filteredSlots: [],
      selectedDepartment: null,
      selectedCourse: null,
      scheduleIndex: 0,
      colors: ["#21ba45", "#db2828", "#2185d0", "#00b5ad", "#6435c9", "#f2711c", "#a333c8"]
    };
  },
  computed: {
    courses: function () {
      if (!this.selectedDepartment) {
        return
      }

      const a = coursesData[this.selectedDepartment]
      if (!a) {
        return []
      }

      return Object.keys(a).filter(value => {
        for (let c of this.selectedCourses) {
          if (value === c.course) return false
        }
        return true
      }).map(function (value) {
        return {
          value: value,
          text: value + " - " + a[value].name,
        }
      })
    },
    isAddButtonEnabled: function () {
      if (!this.selectedCourse) return false
      if (!this.selectedDepartment) return false

      if (this.selectedCourse === "" || this.selectedDepartment === "") return false

      for (let c of this.selectedCourses) {
        if (c.course === this.selectedCourse) return false
      }
      return true
    },
    schedules: function () {
      // To track if VueJS is efficient enough
      console.log("calculating")
      return find(coursesData, this.selectedCourses, this.filteredSections, this.filteredInstructors, this.filteredSlots)
    },
    currentSchedule: function () {
      if (this.scheduleIndex > this.schedules.length) {
        // Show the latest one
        return this.schedules[this.schedules.length - 1]
      }
      return this.schedules[this.scheduleIndex]
    },
    currentScheduleDetails: function () {
      if (!this.currentSchedule) return
      return this.currentSchedule.map(section => {
        let department = section.split(" ")[0]
        let courseCode = section.split("-")[0]
        let course = coursesData[department][courseCode]
        let courseName = course.name
        let data = course.sections[section]
        return {department, courseName, courseCode, section, data}
      })
    },
    timetable: function () {
      if (!this.currentScheduleDetails) return {}
      let table = {}
      for (let d of this.currentScheduleDetails) {
        for (let slot of d.data.schedule) {
          table[slot.day + "/" + slot.start] = {
            name: d.section,
            start: slot.start,
            place: slot.place,
            type: slot.class,
            day: slot.day,
          }
        }
      }
      return table
    }
  },
  methods: {
    addCourse: function (department, course) {
      this.selectedCourses.push({
        department, course
      })
      this.selectedCourse = null
    },
    removeCourse: function (course) {
      this.selectedCourses = this.selectedCourses.filter(a => a.course !== course)
    },
    nextSchedule: function () {
      this.scheduleIndex = (this.scheduleIndex + 1) % this.schedules.length
    },
    prevSchedule: function () {
      this.scheduleIndex = (this.scheduleIndex - 1 + this.schedules.length) % this.schedules.length
    },
    getTimeSlot: function (i, j) {
      return this.timetable[`${j}/${i}`] || this.timetable[`${j}/${this.weekendTimeSlots[i]}`]
    },
    removeInstructorFilter(f) {
      this.filteredInstructors = this.filteredInstructors.filter(a => a !== f)
    },
    removeSectionFilter(f) {
      this.filteredSections = this.filteredSections.filter(a => a !== f)
    },
    addInstructorFilter(f) {
      if (this.filteredInstructors.indexOf(f) === -1) this.filteredInstructors.push(f)
    },
    addSectionFilter(f) {
      if (this.filteredSections.indexOf(f) === -1) this.filteredSections.push(f)
    },
    findColor(section) {
      let course = section.name.split("-")[0]
      for (let i = 0; i < this.selectedCourses.length; i++) {
        if (this.selectedCourses[i].course === course) return this.colors[i]
      }
      return ""
    },
    filterSlot(i, j) {
      let key = j + "/" + i
      if (this.filteredSlots.indexOf(key) === -1) {
        this.filteredSlots.push(key)
      } else {
        this.filteredSlots = this.filteredSlots.filter(a => a !== key)
      }
    },
    isSlotReserved(i, j) {
      let key = j + "/" + i
      return this.filteredSlots.indexOf(key) !== -1;
    }
  },
  watch: {
    selectedCourse: function (value) {
      if (value === "" || !value) return
      this.addCourse(this.selectedDepartment, value)
      this.selectedCourse = null
    },
    schedules: function () {
      this.scheduleIndex = 0
    }
  }
}
</script>