import axios from 'axios'
import config from '@/config'

const getDefaultState = () => {
  return {}
}

const state = getDefaultState()

const mutations = {}

const actions = {
  fetchTableData ({commit, rootState, dispatch}, database ) {

    // https://localhost:21553/rdm/BICYCLE_DB/?list=tables&columns=on
    const url = rootState.auth.port_number? config.schema+ rootState.auth.api_address+':'+rootState.auth.port_number+'/rdm/' + database + '/?list=tables&columns=on' : config.schema+ rootState.auth.api_address+'/rdm/' + database + '/?list=tables&columns=on'
    return axios.get(url);
    
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

