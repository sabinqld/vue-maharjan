export default [
  {
    path: "/currentuser",
    name: "currentuser",
    component: () => import(/* webpackChunkName: "currentuser" */ "../views/Currentuser/View")
  }
];
