import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '@/js/firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    members: [],
    showDialog: false,
  },
  actions: {
    getMembers(context) {
      const refMembers = firebase.database().ref('/members/');
      refMembers.once('value').then((snapshot) => {
        const val = snapshot.val();
        // convert object to array
        const members = Object.keys(val).map((key) => {
          const data = val[key];
          return {
            id: key,
            ...data,
          };
        });
        // sort by grade
        members.sort((a, b) => a.grade - b.grade);
        context.commit('SET_MEMBERS', members);
      });
    },
    openDialog(context) {
      context.commit('SHOWHIDE_DIALOG', true);
    },
    closeDialog(context) {
      context.commit('SHOWHIDE_DIALOG', false);
    },
    createMember(context, curMember) {
      // check exist
      const index = context.state.members.findIndex((member) => (curMember.name === member.name));
      if (index >= 0) {
        this.dispatch('danger', '此成員已存在');
        return;
      }
      // create member
      const refMembers = firebase.database().ref('/members/');
      refMembers.push(curMember);
      context.commit('SHOWHIDE_DIALOG', false);
      this.dispatch('getMembers');
      this.dispatch('success', '成員新增成功');
    },
    updateMember(context, curMember) {
      // check exist
      const index = context.state.members.findIndex((member) => (curMember.id === member.id));
      if (index < 0) {
        this.dispatch('danger', '此成員不存在');
        return;
      }
      // create member
      const member = { ...curMember };
      delete member.id;
      const refMember = firebase.database().ref(`/members/${curMember.id}`);
      refMember.set(curMember);
      context.commit('SHOWHIDE_DIALOG', false);
      this.dispatch('getMembers');
      this.dispatch('success', '成員編輯成功');
    },
    deleteMember(context, willDeleteMember) {
      // check exist
      const index = context.state.members
        .findIndex((member) => (willDeleteMember.id === member.id));
      if (index < 0) {
        this.dispatch('danger', '此成員不存在');
        return;
      }
      // delete member
      const refMember = firebase.database().ref(`/members/${willDeleteMember.id}`);
      refMember.remove();
      this.dispatch('getMembers');
      this.dispatch('success', '成員已刪除');
    },
    cancel(context) {
      context.commit('SHOWHIDE_DIALOG', false);
    },
    success(context, msg) {
      Vue.prototype.$buefy.toast.open({
        duration: 3000,
        message: msg,
        position: 'is-bottom',
        type: 'is-success',
      });
    },
    danger(context, msg) {
      Vue.prototype.$buefy.toast.open({
        duration: 3000,
        message: msg,
        position: 'is-bottom',
        type: 'is-danger',
      });
    },
  },
  mutations: {
    SET_MEMBERS(state, members) {
      state.members = members;
    },
    SHOWHIDE_DIALOG(state, status) {
      state.showDialog = status;
    },
  },
  getters: {
    members(state) { return state.members; },
    showDialog(state) { return state.showDialog; },
  },
  modules: {
  },
});
