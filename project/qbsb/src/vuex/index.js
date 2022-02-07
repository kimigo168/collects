import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user_info: {},
    menu_show: true,
    top_menu_active: 0,
    statusList: [{
      name: '草稿',
      status: '0'
    }, {
      name: '待审核',
      status: '1'
    }, {
      name: '已打回',
      status: '2'
    }, {
      name: '待编辑',
      status: '3'
    }, {
      name: '待发布',
      status: '4'
    }, {
      name: '已打回',
      status: '5'
    }, {
      name: '已打回',
      status: '6'
    }, {
      name: '已发布',
      status: '7'
    }, {
      name: '已下架',
      status: '8'
    }],
    channel_list: [],
    user_info: {},

  },
  getters: {},
  mutations: {
    MENUSHOWCHANGE(state, status) {
      state.menu_show = status;
    },
    TOPMENUACTIVE(state, index) {
      state.top_menu_active = index;
    },
    GETMENULIST(state, data) {
      // state.menu_list = data;
    },
    GETCHANNELLIST(state, data) {
      state.channel_list = data;
    },
    INITUSERINFO(state, data) {
      state.user_info = data;
    }
  },
  actions: {
    menuShowChange(context, status) {
      context.commit("MENUSHOWCHANGE", status)
    },

    topMenuActiveAction(context, index) {
      context.commit("TOPMENUACTIVE", index)
    },

    getMenuList(context, data) {
      context.commit("GETMENULIST", data)
    },

    getChannelList(context, data) {
      context.commit("GETCHANNELLIST", data)
    },

    initUserInfo(context,data) {
      context.commit("INITUSERINFO",data)
    }
  }
})
