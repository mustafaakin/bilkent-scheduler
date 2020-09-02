<template>
  <div class="ui container">
    <sui-form-field width="fluid">
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

    <table class="ui very compact celled table">
      <thead>
      <tr>
        <th rowspan="2">Code</th>
        <th rowspan="2">Name</th>
        <th colspan="2">Lecture Hours</th>
        <th colspan="2">Lab/Studio/Other Hours</th>
        <th colspan="2">Credits</th>
        <th rowspan="2">Sections</th>
      </tr>
      <tr>
        <th>Hybrid</th>
        <th>Online</th>
        <th>Hybrid</th>
        <th>Face to Face</th>
        <th>Bilkent</th>
        <th>ECTS</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(c,d) in courses" v-bind:key="d">
        <td>{{ c.code }}</td>
        <td>{{ c.name }}</td>
        <td>{{ c.lectureHours.hybrid }}</td>
        <td>{{ c.lectureHours.online }}</td>
        <td>{{ c.labStudioOthersHours.hybrid }}</td>
        <td>{{ c.labStudioOthersHours.faceToFace }}</td>
        <td>{{ c.credits.bilkent }}</td>
        <td>{{ c.credits.ECTS }}</td>
        <td>{{ Object.keys(c.sections).length }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import coursesData from '../data.json'
import departmentsData from '../departments.json'

export default {
  name: 'Courses',
  components: {

  },
  computed: {
    courses: function (){
      return coursesData[this.selectedDepartment]
    }
  },
  data() {
    return {
      selectedDepartment: "CS",
      departments: Object.keys(departmentsData).map(function (v) {
        return {
          text: v + " - " + departmentsData[v].name,
          value: v,
        }
      }),
    }
  }
}
</script>
