import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import firebase from '@/js/firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    /** access firebase */
    members: [],
    showDialog: false,
    /** reading setup status */
    readingSetupStatus: 1, // 0: 未設定/未讀,  1: 設定已讀,  2: 設定未下課/飛行中
    /** reading process */
    membersNeedRead: [],
    membersInClass: [],
    /** information */
    lastUpdatedTime: '',
    /** ui */
    isLoading: false,
  },
  actions: {
    /** access firebase */
    getMembers(context) {
      context.commit('SET_LOADING', true);
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
        context.commit('SET_LOADING', false);
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
      this.dispatch('renewLastUpadedTime');
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
      // update member
      const member = { ...curMember };
      delete member.id;
      const refMember = firebase.database().ref(`/members/${curMember.id}`);
      refMember.set(member);
      context.commit('SHOWHIDE_DIALOG', false);
      this.dispatch('renewLastUpadedTime');
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
      context.commit('SHOWHIDE_DIALOG', false);
      this.dispatch('renewLastUpadedTime');
      this.dispatch('getMembers');
      this.dispatch('success', '成員已刪除');
    },
    cancel(context) {
      context.commit('SHOWHIDE_DIALOG', false);
    },
    /** setup reading status in reading before tab */
    resetReadingStatus(context) {
      // prepare firebase link
      const refMembers = firebase.database().ref('/members/');
      // update to firebase
      context.state.members.forEach((member) => {
        const curMember = { ...member };
        const curID = curMember.id;
        if (curMember.readingStatus !== 0) {
          delete curMember.id;
          curMember.readingStatus = 0; // 設定為未讀
          refMembers.child(`${curID}`).set(curMember);
        }
      });
      this.dispatch('renewLastUpadedTime');
      this.dispatch('getMembers');
    },
    switchReadingSetupOperation(context) {
      if (context.state.readingSetupStatus === 1) {
        context.commit('SET_READING_SETUP_STATUS', 2);
      }
      else {
        context.commit('SET_READING_SETUP_STATUS', 1);
      }
    },
    switchReadingStatus(context, curMember) {
      // check exist
      const index = context.state.members.findIndex((member) => (curMember.id === member.id));
      if (index < 0) {
        this.dispatch('danger', '此成員不存在');
        return;
      }
      // switch member's reading status
      const member = { ...curMember };
      delete member.id;
      if (context.state.readingSetupStatus === 1) {
        // 已讀的切換
        member.readingStatus = (!member.readingStatus || member.readingStatus === 2) ? 1 : 0;
      }
      else {
        // 未下課的切換
        member.readingStatus = (!member.readingStatus || member.readingStatus === 1) ? 2 : 0;
      }

      // update to firebase
      const refMember = firebase.database().ref(`/members/${curMember.id}`);
      refMember.set(member);
      this.dispatch('renewLastUpadedTime');
      this.dispatch('getMembers');
      this.dispatch('success', '切換成員讀書狀態成功');
    },
    /** setup has read in reading before tab */
    resetHasRead(context) {
      // prepare firebase link
      const refMembers = firebase.database().ref('/members/');
      // update to firebase
      context.state.members.forEach((member) => {
        const curMember = { ...member };
        const curID = curMember.id;
        if (curMember.hasRead !== 0) {
          delete curMember.id;
          curMember.hasRead = 0; // 設定為未讀
          refMembers.child(`${curID}`).set(curMember);
        }
      });
      // this.dispatch('renewLastUpadedTime');  // 不更新時間
      this.dispatch('getMembers');
    },
    switchHasRead(context, curMember) {
      // check exist
      const index = context.state.members.findIndex((member) => (curMember.id === member.id));
      if (index < 0) {
        this.dispatch('danger', '此成員不存在');
        return;
      }
      // switch member's reading status
      const member = { ...curMember };
      delete member.id;
      if (!member.hasRead || member.hasRead === 0) {
        member.hasRead = 2;
      }
      else if (member.hasRead === 2) {
        member.hasRead = 1;
      }
      else {
        member.hasRead = 0;
      }

      // update to firebase
      const refMember = firebase.database().ref(`/members/${curMember.id}`);
      refMember.set(member);
      // this.dispatch('renewLastUpadedTime');  // 不更新時間
      this.dispatch('getMembers');
      this.dispatch('success', '切換老杜桌成功');
    },
    /** setup reading status in reading tab */
    finishReadingStatus(context, ids) {
      // check length
      if (ids.length === 0) {
        this.dispatch('danger', '請先選擇已讀人員');
        return;
      }

      // prepare firebase link
      const refMembers = firebase.database().ref('/members/');
      // update to firebase
      ids.forEach((id) => {
        const curMember = { ...context.state.members.find((member) => (member.id === id)) };
        delete curMember.id;
        curMember.readingStatus = 1; // 設定為已讀
        refMembers.child(`${id}`).set(curMember);
      });
      this.dispatch('renewLastUpadedTime');
      this.dispatch('getMembers');
      this.dispatch('success', '設定部分成員為已讀');
    },
    finishClassStatus(context, ids) {
      // check length
      if (ids.length === 0) {
        this.dispatch('danger', '請先選擇下課人員');
        return;
      }

      // prepare firebase link
      const refMembers = firebase.database().ref('/members/');
      // update to firebase
      ids.forEach((id) => {
        const curMember = { ...context.state.members.find((member) => (member.id === id)) };
        delete curMember.id;
        curMember.readingStatus = 0; // 設定為未讀
        refMembers.child(`${id}`).set(curMember);
      });
      this.dispatch('renewLastUpadedTime');
      this.dispatch('getMembers');
      this.dispatch('success', '設定部分成員為未讀');
    },
    finishAllClassStatus(context) {
      // prepare firebase link
      const refMembers = firebase.database().ref('/members/');
      // update to firebase
      context.state.members.forEach((member) => {
        const curMember = { ...member };
        const curID = curMember.id;
        if (curMember.readingStatus === 2) {
          delete curMember.id;
          curMember.readingStatus = 0; // 設定為未讀
          refMembers.child(`${curID}`).set(curMember);
        }
      });
      this.dispatch('renewLastUpadedTime');
      this.dispatch('getMembers');
      this.dispatch('success', '設定所有未下課成員為未讀');
    },
    /** information */
    getLastUpadedTime(context) {
      const refInfos = firebase.database().ref('/infos/');
      refInfos.on('value', (snapshot) => {
        const val = snapshot.val();
        context.commit('SET_LASTUPDATETIME', val.lastUpdatedTime);
      });
    },
    renewLastUpadedTime(context) {
      const lastUpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      console.log(`lastUpdateTime: ${lastUpdateTime}`);
      firebase.database().ref('/infos/lastUpdatedTime').set(lastUpdateTime);
      context.commit('SET_LASTUPDATETIME', lastUpdateTime);
    },
    /** toast */
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
    /** access firebase */
    SET_MEMBERS(state, members) {
      state.members = members;
    },
    SHOWHIDE_DIALOG(state, status) {
      state.showDialog = status;
    },
    /** reading setup status */
    SET_READING_SETUP_STATUS(state, status) {
      state.readingSetupStatus = status;
    },
    /** informations */
    SET_LASTUPDATETIME(state, time) {
      state.lastUpdatedTime = time;
    },
    /** ui */
    SET_LOADING(state, status) {
      state.isLoading = status;
    },
  },
  getters: {
    /** access firebase */
    members(state) { return state.members; },
    showDialog(state) { return state.showDialog; },
    /** reading setup status */
    readingSetupStatus(state) { return state.readingSetupStatus; },
    /** reading process */
    membersNeedRead(state) {
      const filteredMembers = [];
      state.members.forEach((element) => {
        if (!element.readingStatus || element.readingStatus === 0) {
          filteredMembers.push(element);
        }
      });
      return filteredMembers;
    },
    membersInClass(state) {
      const filteredMembers = [];
      state.members.forEach((element) => {
        if (element.readingStatus === 2) {
          filteredMembers.push(element);
        }
      });
      return filteredMembers;
    },
    /** information */
    lastUpdatedTime(state) { return state.lastUpdatedTime; },
    /** ui */
    isLoading(state) { return state.isLoading; },
  },
  modules: {
  },
});
