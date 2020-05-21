<template>
  <div>
    <button class="button is-primary space-top space-bottom"
        @click="showDialogToCreateMember">
        新增成員
    </button>
    <!-- member list -->
    <div class="table-wrapper has-mobile-cards">
      <table class="table is-striped is-narrow is-hoverable">
        <thead>
          <tr>
            <th class style="width: 4rem;">
              <div class="th-wrap is-center">可開</div>
            </th>
            <th class style="width: 4rem;">
              <div class="th-wrap is-center">官品</div>
            </th>
            <th>
              <div class="th-wrap is-center">名字</div>
            </th>
            <th class style="width: 10rem;">
              <div class="th-wrap is-center">功能</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr draggable="false" v-for='member in members' :key=member.id
              class='flex-center'>
            <td data-label="可開" class="flex-center has-text-centered">
              <b-checkbox style='padding: 0' v-model='member.beTeacher' disabled></b-checkbox>
            </td>
            <td data-label="官品" class="has-text-centered">{{ grades[member.grade] }}</td>
            <td data-label="名字" class="has-text-centered">{{ member.name }}</td>
            <td data-label="功能" class="is-center has-text-centered">
              <button type="button" class="button mr-0-5 is-primary is-outlined"
                      @click.prevent='showDialogToEditMember(member)'>
                修改
              </button>
              <button type="button" class="button is-danger is-outlined">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- dialog -->
    <b-modal :active.sync="showDialog"
              has-modal-card
              trap-focus
              :destroy-on-hide="false"
              aria-role="dialog"
              aria-modal>
        <div class="modal-card">
          <header class="modal-card-head padding-0-8">
            <p class="modal-card-title text-bold">新增成員</p>
          </header>
          <section class="modal-card-body">
            <b-field label="名字" class='is-left'>
              <b-input v-model="curMember.name" required></b-input>
            </b-field>
            <b-field label="官品" class='is-left'>
              <b-dropdown
                v-model.number="curMember.grade"
                aria-role="list"
              >
                <button class="button is-primary" type="button" slot="trigger">
                  <template>
                    <span>{{grades[curMember.grade]}}</span>
                  </template>
                  <b-icon icon="caret-down"></b-icon>
                </button>
                <b-dropdown-item
                  v-for="(grade, index) in grades"
                  :key="index"
                  :value="index" aria-role="listitem">
                  <div class="media">
                    <div class="media-content">
                      <h3>{{grade}}</h3>
                    </div>
                  </div>
                </b-dropdown-item>
              </b-dropdown>
            </b-field>
            <div class="field is-left" style='padding-top: 0.8rem'>
                <b-checkbox v-model="curMember.beTeacher">是否可以開桌</b-checkbox>
            </div>
          </section>
          <footer class="modal-card-foot flex-sb padding-0-8">
            <button class="button" type="button" @click.prevent="cancel">取消</button>
            <button class="button is-primary"
                    v-if='isCreate' @click.prevent='createMember'>
              新增
            </button>
            <button class="button is-primary"
                    v-else @click.prevent='updateMember'>
              更新
            </button>
          </footer>
        </div>
    </b-modal>
  </div>
</template>

<script>
// import * as firebase from 'firebase/app';
import firebase from '@/js/firebase';
import { grades } from '@/js/constants';

const initMember = {
  name: '',
  grade: 103,
  beTeacher: false,
  timestamp: null,
};

export default {
  data() {
    return {
      refMembers: null,
      membersObj: null,
      members: [],
      showDialog: false,
      isCreate: true,
      curMember: {
        name: '',
        grade: 103,
        beTeacher: false,
        timestamp: null,
      },
      grades,
    };
  },
  created() {
    this.refMembers = firebase.database().ref('/members/');
    this.getMembers();
  },
  methods: {
    getMembers() {
      this.refMembers.once('value').then((snapshot) => {
        const val = snapshot.val();
        // convert object to array
        this.members = Object.keys(val).map((key) => {
          const data = val[key];
          return {
            id: key,
            ...data,
          };
        });
        // sort by grade
        this.members.sort((a, b) => a.grade - b.grade);
      });
    },
    showDialogToCreateMember() {
      this.curMember = { ...initMember };
      this.showDialog = true;
      this.isCreate = true;
    },
    showDialogToEditMember(member) {
      this.curMember = { ...member };
      this.showDialog = true;
      this.isCreate = false;
    },
    createMember() {
      // check exist
      const index = this.members.findIndex((member) => (this.curMember.name === member.name));
      if (index >= 0) {
        this.danger('此成員已存在');
        return;
      }
      // create member
      this.refMembers.push(this.curMember);
      this.showDialog = false;
      this.getMembers();
      this.success('成員新增成功');
    },
    updateMember() {
      // check exist
      const index = this.members.findIndex((member) => (this.curMember.id === member.id));
      if (index < 0) {
        this.danger('此成員不存在');
        return;
      }
      // create member
      const member = { ...this.curMember };
      delete member.id;
      this.refMembers.child(this.curMember.id).set(this.curMember);
      this.showDialog = false;
      this.getMembers();
      this.success('成員編輯成功');
    },
    cancel() {
      this.showDialog = false;
    },
    success(msg) {
      this.$buefy.toast.open({
        duration: 3000,
        message: msg,
        position: 'is-bottom',
        type: 'is-success',
      });
    },
    danger(msg) {
      this.$buefy.toast.open({
        duration: 3000,
        message: msg,
        position: 'is-bottom',
        type: 'is-danger',
      });
    },
  },
};
</script>

<style lang='scss'>
.table {
  margin: 0 auto;
}
.table th, .table td {
  vertical-align: middle;
}
.is-left {
  text-align: left;
}
.is-center {
  text-align: center !important;
}
.flex-sb {
  justify-content: space-between;
}
.mr-0-5 {
  margin-right: 0.5rem;
}
.text-bold {
  font-weight: bold;
}
.padding-0-8 {
  padding: 0.8rem;
}
.space-top {
  margin-top: 1rem;
}
.space-bottom {
  margin-bottom: 1rem;
}
</style>
