<template>
  <div>
    <br />
    <div class="ui container">
      <h1 class="ui header">
        Scheduler <span style="color: gray; font-size: 0.6em">for Bilkent</span>
        <div class="sub header">
          Implemented by original Scheduler Creator <a href="https://mustafaakin.dev">Mustafa Akın</a> -
          Fork me on <a href="https://github.com/mustafaakin/bilkent-scheduler">Github</a>
        </div>
      </h1>
      <div class="ui secondary pointing menu">
        <router-link class="item" to="/schedule" active-class="active">
          <i class="icon calendar alternate outline"></i>
          Plan
        </router-link>
        <router-link class="item" to="/courses" active-class="active">
          <i class="icon university"></i>
          Courses
        </router-link>
        <router-link class="item" to="/instructors" active-class="active">
          <i class="icon users"></i>
          Instructors
        </router-link>
        <router-link class="item" to="/about" active-class="active">
          <i class="icon info"></i>
          About
        </router-link>
      </div>
    </div>
    <br />
    <router-view/>
  </div>
</template>

<style>

</style>
