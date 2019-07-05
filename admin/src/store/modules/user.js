import {getInfo} from "../../api/user"
import { getToken, setToken, removeToken } from '../../utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  async setAllToken({ commit },token) {
    commit("SET_TOKEN",token);
    setToken(token);
  },

  // user register
  async logout({ commit}) {
    commit('SET_TOKEN', '');
    removeToken();
    resetRouter();
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

