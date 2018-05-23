import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    status: '',
    code: '',
    token: getToken(),
    name: '',
    info:'',
    menu_list:[]
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INFO:(state,info) => {
      state.info = info
    },
    REFRESH_TOKEN: (state, token)=> {
      state.token = token
      setToken(token)
      // axios.defaults.headers.common['Authorization'] = state.token
    },
    SET_MENU:(state,menu_list) => {
      state.menu_list = menu_list
    }
  },

  actions: {
    // 登录
    LoginByUsername({ commit }, data) {
      commit('SET_INFO', data.data)
      commit('SET_TOKEN', data.data.token)
      setToken(data.data.token)
    },
    // 登出
    LogOut({ commit, state }) {
      commit('SET_TOKEN', '')
      removeToken()
    },
    // 将刷新的 token 保存至本地
    RefreshToken({commit},token) {
      return new Promise(function (resolve, reject) {
        commit('REFRESH_TOKEN', token)
      })
    },
    // 设置menu
    setMenu({commit},data){
      commit('SET_MENU', data)
    }
  }
}

export default user
