import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "HOME",
    redirect: {
      name: "MAIN_MENU",
    },
  },
  {
    path: "/mainMenu",
    name: "MAIN_MENU",
    component: () => import("@src/public/components/views/MainMenu.vue"),
  },
  {
    path: "/play",
    name: "TEST_GROUND",
    component: () => import("@src/public/components/views/TestGround.vue"),
  },
  {
    path: "/HelloWorld",
    name: "HELLO_WORLD",
    component: () => import("@src/public/components/views/HelloWorld.vue"),
  },
  //catch 404
  {
    path: "/:catchAll(.*)",
    name: "NOTFOUND",
    component: () =>
      import("@src/public/components/UI/UIElements/Error/PageNotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
