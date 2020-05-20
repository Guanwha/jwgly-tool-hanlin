<template>
  <div>
    <div>成員</div>
    <button class="button is-primary"
        @click="showDialog = true">
        新增成員
    </button>
    <!-- dialog -->
    <b-modal :active.sync="showDialog"
              has-modal-card
              trap-focus
              :destroy-on-hide="false"
              aria-role="dialog"
              aria-modal>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head padding-0-8">
            <p class="modal-card-title text-bold">新增成員</p>
          </header>
          <section class="modal-card-body">
            <b-field label="名字" class='is-left'>
              <b-input v-model="newMember.name" required></b-input>
            </b-field>
            <b-field label="官品" class='is-left'>
              <b-dropdown
                scrollable.number=true
                max-height="600"
                v-model.number="newMember.grade"
                aria-role="list"
              >
                <button class="button is-primary" type="button" slot="trigger">
                  <template>
                    <span>{{grades[newMember.grade]}}</span>
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
                <b-checkbox v-model="newMember.beTeacher">是否可以開桌</b-checkbox>
            </div>
          </section>
          <footer class="modal-card-foot flex-sb padding-0-8">
            <button class="button" type="button" @click.prevent="cancel">取消</button>
            <button class="button is-primary" @click.prevent='createMember'>新增</button>
          </footer>
        </div>
    </b-modal>
  </div>
</template>

<script>
// import * as firebase from 'firebase/app';
import firebase from '@/js/firebase';
import { grades } from '@/js/constants';

export default {
  data() {
    return {
      refMembers: null,
      membersObj: null,
      members: [],
      showDialog: false,
      newMember: {
        name: '',
        grade: 14,
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
        this.members.sort((a, b) => b.level - a.level);
      });
    },
    createMember() {
      // check exist
      const index = this.members.findIndex((member) => (this.newMember.name === member.name));
      if (index >= 0) {
        this.danger('此成員已存在');
        return;
      }
      // create member
      this.refMembers.push(this.newMember);
      this.showDialog = false;
      this.success('成員新增成功');
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
.is-left {
  text-align: left;
}
.flex-sb {
  justify-content: space-between;
}
.text-bold {
  font-weight: bold;
}
.padding-0-8 {
  padding: 0.8rem;
}
</style>
