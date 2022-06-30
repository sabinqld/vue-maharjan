export default [
  {
    path: "/skills",
    name: "skill",
    component: () => import(/* webpackChunkName: "skill" */ "./../views/skills/View")
  },
  {
    path: "/skills/new",
    name: "create-skill",
    component: () => import(/* webpackChunkName: "skillNew" */ "../views/skills/Edit"),
    props: true
  },
  {
    path: "/skills/:id",
    name: "edit-skill",
    component: () => import(/* webpackChunkName: "skillEdit" */ "../views/skills/Edit"),
    props: true
  }
];
