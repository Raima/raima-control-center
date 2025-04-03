import {store} from '@/store/store.js'
//import DashboardLayout from "@/layout/VueBlackDashboard/dashboard/DashboardLayout.vue";
import DashboardLayout from "@/layout/Raima/DashboardLayout.vue";

// GeneralViews
import NotFound from "@/pages/VueBlackDashboard/NotFoundPage.vue";
import Login from "@/pages/Raima/Login/Login.vue";
// authenticated routes routes
import Dashboard from "@/pages/Raima/Dashboard/Dashboard.vue";
import TableView from "@/pages/Raima/TableView/TableView.vue";
import TableView2 from "@/pages/Raima/TableView/TableView2.vue";
import TableView3 from "@/pages/Raima/TableView/TableView3.vue";
import EditRow from "@/pages/Raima/TableView/EditRow/EditRow.vue";
import CreateRow from "@/pages/Raima/TableView/CreateRow/CreateRow.vue";
import SQLEditor from "@/pages/Raima/SQLEditor/SQLEditor.vue";
import Geospatial from "@/pages/Raima/DataVisualization/Geospatial.vue";
import TimeSeries from "@/pages/Raima/DataVisualization/TimeSeries.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    beforeEnter (to, from, next) {
      //if ( store.getters['auth/isAuthenticated'] ) {
      if ( store.state.auth.api_address && (store.state.auth.port_number || store.state.auth.port_number==="") ) {
        next()
      } else {
        next('/login')
      }
    },
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: ":database/:table/tableview",
        name: "tableview",
        component: TableView3
      },
      {
        path: ":database/:table/tableview2",
        name: "tableview2",
        component: TableView2
      },
      {
        path: ":database/:table/tableview3",
        name: "tableview3",
        component: TableView3
      },
      {
        path: ":database/:table/editrow/:key",
        name: "editrow",
        component: EditRow
      },
      {
        path: ":database/:table/createrow",
        name: "createrow",
        component: CreateRow
      },
      {
        path: "/sql-editor",
        name: "sql-editor",
        component: SQLEditor
      },
      {
        path: "/geospatial",
        name: "geospatial",
        component: Geospatial
      },
      {
        path: "/time-series",
        name: "timeSeries",
        component: TimeSeries
      },
    ]
  },
  { path: "/login", component: Login},
  { path: "*", component: NotFound },
];

export default routes;
