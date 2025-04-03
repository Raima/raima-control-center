const getDefaultState = () => {
  return {
    // selectedDatabase
    selectedDatabase: null,
    sqlSelected: null,
    // tables
    tables: null,
    colors: null,
    keys: [],
    sqlItems: [],
  }
}

const state = getDefaultState()

const mutations = {
  storeDatabaseColors (state, colors){
    state.colors = colors
  },
  storeSelectedDatabase (state, database) {
    state.selectedDatabase = database;
  },
  storeTables (state, tables) {
    state.tables = tables;
  },
  storeSelectedTable (state, table) {
    //
  },
  storeKeys (state, keys) {
    state.keys = keys;
  },
  storeSQLPage (state, type) {
    state.sqlSelected = type;
  },
  storeSQLItems (state, items) {
    state.sqlItems = items;
  },
}

const actions = {}

const getters = {
  getDatabaseColors (state){
    return state.colors
  },
  selectedDatabase (state) {
    return state.selectedDatabase
  },
  tables (state) {
    return state.tables
  },
  sidebarLinks (state) {
    let sidebarLinks = [];
    if( state.tables && state.tables.length > 0 ) {
      state.tables.forEach(key => {
        sidebarLinks.push( { path: '/' + state.selectedDatabase + '/' + key + '/tableview', name: key, icon: ''} )
      });
    }
    return sidebarLinks;
  },
  keys (state) {
    return state.keys
  },
  getSQLPage (state){
    return state.sqlSelected
  },
  getSQLItems (state){
    return state.sqlItems
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
