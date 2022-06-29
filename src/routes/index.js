import Vue from "vue";
import Router from "vue-router";
import Layout from "../views/Layout.vue";

import authRoute from "./auth";
import skillRoute from "./skills";
// import currentuserRoutes from "./currentuser";
// import scheduledtasksRoutes from "./scheduledtasks";
// import divisionreportingRoutes from "./divisionreporting";
// import streamRoutes from "./streams";
// import ddproRoutes from "./ddprousers";
// import ddrrtRoutes from "./ddrrtusers";

// import qlikaccessRWM from "./qlikaccessrwm";
// import qlikaccessQCVT from "./qlikaccessqcvt";

// import reportingRoutes from "./reports";

Vue.use(Router);

const router = new Router({
  mode: "history",
  // base: '/admin',
  routes: [
    {
      path: "/",
      component: Layout,
      // redirect: "/auth/login", //whenever '/' route is invoked, vuejs will automatically redirect to /auth/login
      children: [
        authRoute,
        ...skillRoute
        // currentuserRoutes,
        // scheduledtasksRoutes,
        // divisionreportingRoutes,
        // streamRoutes,
        // ddproRoutes,
        // ddrrtRoutes,
        // qlikaccessRWM,
        // qlikaccessQCVT,
        // reportingRoutes
      ]
      // courseRoute, offerRoute, teamRoute, userRoute, formRoute, mapRoute, disclaimerRoute]
    }
  ]
});

router.beforeEach((to, from, next) => {
  // console.log(from)

  // console.log(to)

  next();
});

export default router;
