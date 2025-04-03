/*
 =========================================================
 * Vue Black Dashboard - v1.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/black-dashboard
 * Copyright 2018 Creative Tim (https://www.creative-tim.com)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from "vue";
import Vuelidate from 'vuelidate'
import { store } from '@/store/store'                                 // Vuex
import Vuex from 'vuex';
import VueRouter from "vue-router";
import RouterPrefetch from 'vue-router-prefetch'
import App from "./App";
import router from "./router/index";

// VueBlackDashboard
// import BlackDashboard from "./plugins/VueBlackDashboard/blackDashboard";
// Raima VueBlackDashboard

import vuetify from '@/plugins/vuetify' // path to vuetify export
import 'vuetify/dist/vuetify.min.css'

import BlackDashboard from "./plugins/Raima/blackDashboard";
import i18n from "./i18n"
import './registerServiceWorker'

import jQuery from 'jquery';

/* */
// new datatable settings
import dt from 'datatables.net';
import 'datatables.net-bs4';

// require("datatables.net-bs4/css/dataTables.bootstrap4.min.css")
import 'datatables.net-fixedcolumns-bs4';
import 'datatables.net-fixedheader-bs4';
import 'datatables.net-keytable-bs4';
import 'datatables.net-responsive-bs4';

global.jQuery = jQuery
global.$ = jQuery
global.dt = dt;
global._ = require('lodash');

/* */
Vue.use(Vuelidate)
Vue.use(Vuex)
Vue.use(BlackDashboard);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);

import 'element-ui/lib/theme-chalk/index.css';

import {
  Collapse,
  CollapseItem,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Tree
} from 'element-ui';

Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
Vue.use(Tree);

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

import VueGoogleHeatmap from 'vue-google-heatmap';
Vue.use(VueGoogleHeatmap, {
  apiKey: process.env.VUE_APP_GOOGLE_API_key
});


/* eslint-disable no-new */
new Vue({
  router,
  i18n,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
