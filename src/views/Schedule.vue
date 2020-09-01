<template>
  <div class="ui container">
    <transition name="fade">
      <sui-message
          v-if="helpVisible"
          color="warning"
          header="How to use Scheduler?"
          content="Select a department, and a course and hit the add button. The combinations will be generated automatically. You can also filter out certain instructors as they appear in the results. Additionally, clicking on the timetable will filter-out that specific time. Use Next and Prev arrows for navigating through all combinations."
          dismissable
          @dismiss="helpVisible = false"
      />
    </transition>

    <sui-form>
      <sui-form-fields fields="sixteen">
        <sui-form-field width="five">
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
        <sui-form-field width="nine">
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
        <sui-form-field width="two">
          <label style="color: white">&nbsp;Buraya Bakarlar</label>
          <div class="ui button fluid primary">Add</div>
        </sui-form-field>
      </sui-form-fields>
    </sui-form>

    <div class="">
      <div class="ui labels">
        <a class="ui white label" v-if="selectedCourses.length === 0">
          No course selected
        </a>
        <a class="ui label" v-for="s in selectedCourses" v-bind:key="s">
          {{ s }}
          <i class="icon close"></i>
        </a>
      </div>
    </div>

    <table class="ui celled definition compact table">
      <thead>
      <tr>
        <th style="width:9%"></th>
        <th style="width:13%">Monday</th>
        <th style="width:13%">Tuesday</th>
        <th style="width:13%">Wednesday</th>
        <th style="width:13%">Friday</th>
        <th style="width:13%">Saturday</th>
        <th style="width:13%">Sunday</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="i in [8,9,10,11,12,13,14,15,16,17,18,19,20,21]" v-bind:key="i">
        <td>{{ i }}:30 - {{ i + 1 }}:20</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
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
            <div class="sub header"><b>3</b> of <b>150</b></div>

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
          <tbody>
          <tr>
            <td>CS 101
              <br/>
              <small>Introduction to programming</small>
            </td>
            <td>1</td>
            <td>David Davenport</td>
          </tr>
          <tr>
            <td>CS 102</td>
            <td>3</td>
            <td>David Davenport</td>
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

        <p v-if="false">Click a instructor name to filter them if you wish.</p>


        <div class="ui labels">
          <a class="ui label">
            David Davenport
            <i class="delete icon"></i>
          </a>
          <a class="ui label">
            Hebele Höbelöo
            <i class="delete icon"></i>
          </a>
          <a class="ui label">
            John Doe
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
        <p v-if="false">Click a section to add to filter.</p>

        <div class="ui labels">
          <a class="ui label">
            CS 102
            <i class="delete icon"></i>
          </a>
          <a class="ui label">
            CS 101
            <i class="delete icon"></i>
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Schedule",
  data() {
    return {
      selectedCourses: ["CS 101", "ENG 101", "ENG 102"],
      helpVisible: true,
      selectedDepartment: null,
      selectedCourse: null,
      departments: [
        {
          text: 'CS - Computer Science',
          value: 'CS',
        },
        {
          text: 'ENG - English',
          value: 'ENG',
        },
      ],
      courses: [
        {
          text: 'CS 101 - Introduction to Programming - I',
          value: 'CS 101',
        },
        {
          text: 'CS 102 - Introduction to Programming - II',
          value: 'CS 102',
        },
      ],
    };
  },
}
</script>

<style media="screen" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>