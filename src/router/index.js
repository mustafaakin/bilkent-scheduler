import Vue from 'vue'
import VueRouter from 'vue-router'
import Courses from '../views/Courses.vue'
import Instructors from '../views/Instructors.vue'
import About from '../views/About.vue'
import Schedule from '../views/Schedule.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/schedule"
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: Schedule
  },
  {
    path: '/courses',
    name: 'About',
    component: Courses,
  },
  {
    path: '/instructors',
    name: 'Instructors',
    component: Instructors,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  }
]

const router = new VueRouter({
  routes
})

export default router
