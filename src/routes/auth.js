export default {
  path: "/auth/login/",
  name: "Login Route",
  component: () => import(/* webpackChunkName: "user" */ "../views/Login")
};
