import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../components/Login.vue";
import Groups from "../components/Groups.vue";
import Users from "../components/Users.vue";
import Schedules from "../components/Schedules.vue";
import Doors from "../components/Doors.vue";
import Badges from "../components/Badges.vue";
import Logs from "../components/Logs.vue";

// import Users from "../components/Users.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/user",
    name: "Users",
    component: Users,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/group",
    name: "Group",
    component: Groups,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/door",
    name: "Door",
    component: Doors,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/badge",
    name: "Badge",
    component: Badges,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/log",
    name: "Logs",
    component: Logs,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: Schedules,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("token") == null) {
      next({
        path: "/login",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
