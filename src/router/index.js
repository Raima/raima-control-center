import VueRouter from "vue-router";
// import routes from "./routes";
import routes from "./raimaRoutes";
import { store } from '@/store/store.js'     


// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "active",
  mode: 'history',
  scrollBehavior: (to) => {
    if (to.hash) {
      return {selector: to.hash}
    } else {
      return { x: 0, y: 0 }
    }
  }
});

router.beforeEach(async (to, from, next) => {
  store.dispatch('auth/tryAutoSignin').then(next)
})


export default router;
