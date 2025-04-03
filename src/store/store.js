import Vue    from 'vue';
import Vuex   from 'vuex';
import axios  from 'axios';
import router from '../router';
import createPersistedState from "vuex-persistedstate";
// import modules
import auth      from './modules/auth';
import database  from './modules/database';
import datatable from './modules/datatable';

Vue.use(Vuex);


const getDefaultState = () => {
  return {
    selectedDatabase: null,
    selectedTable: null,
    selectedRow: null,
    selectedRows: {},
    darkmode: true,
  }
}

export const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      key: 'vuex',
      paths: ['auth', 'database'],
    })
  ],
  state: getDefaultState(),
  mutations: {
    storeSelectedDatabase (state, database) {
      state.selectedDatabase = database;
    },
    storeSelectedTable (state, table) {
      state.selectedTable = table;
    },
    /*
    storeSelectedRow (state, row) {
      state.selectedRow = row
    },
    */
    storeSelectedRow (state, storeObject ) {
      let row = storeObject.row;
      state.selectedRows[ btoa(row[Object.keys(row)[0]]) ] = Object.assign({}, row) ;
      localStorage.setItem("selectedRows", JSON.stringify(state.selectedRows));
      router.replace('/' + storeObject.database + '/' + storeObject.selectedTable + '/editrow/' + btoa(row[Object.keys(row)[0]]).replace('=',''))
    },
    removeSelectedRow (state, key) {
      delete state.selectedRows[key];
      localStorage.setItem("selectedRows", JSON.stringify(state.selectedRows));
    },
    setDarkMode (state, darkmode) {
      state.darkmode = darkmode
      localStorage.setItem('darkmode',  Number(darkmode))
    },
    unsetStorageDarkMode ( state )
    {
      localStorage.removeItem('darkmode')
    }
  },
  actions: {
    // RESET ALL STATE
    resetAll( {state, commit, dispatch} ){
      commit('resetState')
      commit('auth/resetState', {}, {root:true})
    },
  },
  getters: {
    selectedDatabase (state) {
      return state.selectedDatabase
    },
    selectedTable (state) {
      return state.selectedTable
    },
    selectedRow (state) {
      return state.selectedRow
    },
    selectedRows (state,key) {
      if(!state.selectedRows.length)
      {
        state.selectedRows = JSON.parse(localStorage.getItem('selectedRows'));
      }
      return state.selectedRows
    },
    selectedRows2 (state) {
      return keyword => state.selectedRows[keyword];
      if(!state.selectedRows.length)
      {
        state.selectedRows = JSON.parse(localStorage.getItem('selectedRows'));
      }
      return state.selectedRows
      /*
      return keyword => state.items.filter(item =>{
        return item.name === keyword
      });
      */
    },
    darkmode( state ) {
      if( state.darkmode !== Boolean(Number(localStorage.getItem('darkmode'))) ){
        state.darkmode = Boolean(Number(localStorage.getItem('darkmode')))
      }
      return state.darkmode
    }
  },
  modules: {
    auth : auth,
    database: database,
    datatable: datatable,
  }
});
