import SideBar from "@/components/VueBlackDashboard/SidebarPlugin";
import Notify from "@/components/VueBlackDashboard/NotificationPlugin";
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import RTLPlugin from "./RTLPlugin";

//css assets
import "@/assets/sass/black-dashboard.scss";
import "@/assets/css/nucleo-icons.css";
import "@/assets/demo/demo.css";
import "@/assets/raima/raima.scss";


export default {
  install(Vue) {
    Vue.use(GlobalComponents);
    Vue.use(GlobalDirectives);
    Vue.use(SideBar);
    Vue.use(Notify);
    Vue.use(RTLPlugin);
  }
}
