import Util from "@/assets/js/util.js";
const pageButton = {
  state: {
    page_buttons: []
  },
  mutations: {
    UPDATE_PAGE_ROLE: (state,page) => {
      state.page_buttons = Util.findChildrenByValue(JSON.parse(sessionStorage.getItem('menu_list')), page)
    }
  },
  actions: {
    updatePageButton:({commit},page)=>{
      commit('UPDATE_PAGE_ROLE',page);
    }
  }
};
export default pageButton;
