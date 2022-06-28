export default {
  path: "/auth/login/",
  name: "Login",
  component: () => import(/* webpackChunkName: "user" */ "../views/Login")
};
