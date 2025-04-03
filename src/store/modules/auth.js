import axios from 'axios'
import router from '@/router'
import config from '@/config'

const getDefaultState = () => {
  return {
    // Boolean value for show or hide login animationx
    isLoading: false,
    // api_address
    api_address: null,
    // port_number
    port_number: null,
    version_info: {},
  }
}

const state = getDefaultState()

const mutations = {
  // RESET ALL STATE
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  storeServer (state, serverDatas ) {
    state.api_address = serverDatas.api_address
    state.port_number = serverDatas.port_number
    if(serverDatas.localStorage) {
      localStorage.setItem('api_address', serverDatas.api_address)
      localStorage.setItem('port_number', serverDatas.port_number)
    }
  },
  storeVersionInfo(state, data){
    state.version_info = data
  },
  unsetStorageServer (state )
  { 
    localStorage.removeItem('api_address')
    localStorage.removeItem('port_number')
  }
}

const actions = {
  signin ({commit, dispatch}, authData) {
    /**
     * felhasználó beléptetése
     */
    let message = {
      type: null,
      code: null,
      message: null
    }
    state.isLoading = true
    // https://35.222.195.62:21553/rdmadmin/?list=version
    const url = authData.port_number? config.schema+authData.api_address+':'+authData.port_number+'/rdmadmin/?list=version' : config.schema+authData.api_address+'/rdmadmin/?list=version'
    axios.get(url)
      .then(res => {
        state.isLoading = false
        if(res.hasOwnProperty('status') && res.status == 200) {
          commit('storeVersionInfo', res.data["RDM Version Information"])
          commit('storeServer', { api_address: authData.api_address, port_number: authData.port_number, localStorage: true })
          commit('setDarkMode', true, { root: true } );
        }
        //console.log("Auth state updated:", store.state.auth);
        message.type = 'success'
        message.code = res.status
        message.message = 'You are now connected! Redirecting»'
        var timeout = setTimeout((timeout) => {
          router.replace('/dashboard')
          clearTimeout(timeout)
          timeout = false;
        }, 3000 );
      })
      .catch(function (error) {
        state.isLoading = false
        message.type = 'error'
        message.code = '500'
        message.message = 'Cannot connect to server'
      });
    return message
  },
  // felhasználó automatikus beléptetés localStorage alapján
  tryAutoSignin ({commit, dispatch}) {

    const api_address = localStorage.getItem('api_address')
    const port_number = localStorage.getItem('port_number')

    if(!api_address || !port_number) {
      return
    }

    commit('storeServer', { api_address: api_address, port_number: port_number, localStorage: false })
  },
  /**
   * felhasználó kiléptetése
   */
  signout ({commit, dispatch}) {
    commit('resetState')
    commit('unsetStorageServer')
    commit('unsetStorageDarkMode', {}, { root: true } )
    router.replace('/login')
  },
}

const getters = {
  api_address (state) {
    if (!state.api_address) {
      const userObj = localStorage.getItem('api_address')
      if (userObj) { state.api_address = userObj }
    }
    return state.api_address
  },
  port_number (state) {
    if (!state.uport_numberser) {
      const userObj = localStorage.getItem('port_number')
      if (userObj) { state.port_number = userObj }
    }
    return state.port_number
  },
  version_info (state) {
    return state.version_info
  },
  isAuthenticated( state ) {
    const api_address = localStorage.getItem('api_address')
    const port_number = localStorage.getItem('port_number')

    if( api_address && port_number ) {
      return true
    }
    return false;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
