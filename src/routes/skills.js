export default [
  {
    path: "/skills",
    name: "skill",
    component: () => import(/* webpackChunkName: "skill" */ "../views/skills/View")
  }
];
