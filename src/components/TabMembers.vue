<template>
  <div>
    <button class="button is-primary mt-1 mb-1"
        @click="showDialogToCreateMember">
        新增成員
    </button>
    <!-- member list -->
    <div class="table-wrapper has-mobile-cards">
      <table class="table is-striped is-narrow is-hoverable">
        <thead>
          <tr>
            <th style="width: 10%;">
              <div class="th-wrap has-text-centered">可開</div>
            </th>
            <th style="width: 10%;">
              <div class="th-wrap has-text-centered">候補</div>
            </th>
            <th style="width: 20%; min-width: 3rem">
              <div class="th-wrap has-text-centered">官品</div>
            </th>
            <th style="min-width: 4rem;">
              <div class="th-wrap has-text-centered">名字</div>
            </th>
            <th style="width: 10%;">
              <div class="th-wrap has-text-centered">功能</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr draggable="false" v-for='member in members' :key=member.id
              class='flex-center'>
            <td data-label="可開" class="flex-center has-text-centered">
              <b-checkbox style='padding: 0' v-model='member.beTeacher' disabled></b-checkbox>
            </td>
            <td data-label="候補" class="flex-center has-text-centered">
              <b-checkbox style='padding: 0' v-model='member.beAlternate' disabled></b-checkbox>
            </td>
            <td data-label="官品" class="has-text-centered">{{ grades[member.grade] }}</td>
            <td data-label="名字" class="has-text-centered">{{ member.name }}</td>
            <td data-label="功能" class="has-text-centered">
              <button type="button" class="button is-primary is-outlined fas fa-pen"
                      @click.prevent='showDialogToEditMember(member)'>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- dialog -->
    <b-modal :active="showDialog"
              has-modal-card
              trap-focus
              :destroy-on-hide="false"
              @close="closeDialog"
              aria-role="dialog"
              aria-modal>
        <div class="modal-card">
          <header class="modal-card-head p-0-8">
            <p class="modal-card-title has-text-weight-bold">新增成員</p>
          </header>
          <section class="modal-card-body">
            <b-field label="名字" class='has-text-left'>
              <b-input v-model="curMember.name" required></b-input>
            </b-field>
            <b-field label="官品" class='has-text-left'>
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
            <div class="field has-text-left" style='padding-top: 0.8rem'>
                <b-checkbox v-model="curMember.beTeacher">是否可以開桌</b-checkbox>
            </div>
            <div class="field has-text-left" style='padding-top: 0.8rem'>
                <b-checkbox v-model="curMember.beAlternate">是否為候補</b-checkbox>
            </div>
          </section>
          <footer class="modal-card-foot flex-rsbc p-0-8">
            <button class="button" type="button" @click.prevent="cancel">取消</button>
            <button type="button" class="button is-danger is-outlined fas fa-trash"
                    v-if='!isCreate'
                    @click.prevent='deleteMember(curMember)'>
            </button>
            <button class="button is-primary"
                    v-if='isCreate'
                    @click.prevent='createMember(curMember)'>
              新增
            </button>
            <button class="button is-primary"
                    v-else
                    @click.prevent='updateMember(curMember)'>
              更新
            </button>
          </footer>
        </div>
    </b-modal>
  </div>
</template>

<script>
import { grades } from '@/js/constants';
import { mapActions, mapGetters } from 'vuex';

const initMember = {
  name: '',
  grade: 103,
  beTeacher: false,
  beAlternate: false,
  timestamp: null,
};

export default {
  data() {
    return {
      isCreate: true,
      curMember: {
        name: '',
        grade: 103,
        beTeacher: false,
        beAlternate: false,
        timestamp: null,
      },
      grades,
    };
  },
  methods: {
    showDialogToCreateMember() {
      this.curMember = { ...initMember };
      this.openDialog();
      this.isCreate = true;
    },
    showDialogToEditMember(member) {
      this.curMember = { ...member };
      this.openDialog();
      this.isCreate = false;
    },
    ...mapActions(['openDialog', 'createMember', 'updateMember', 'deleteMember', 'closeDialog', 'cancel']),
  },
  computed: {
    ...mapGetters(['members', 'showDialog']),
  },
};
</script>

<style lang='scss' scoped>
@import '@/styles/gw-utilities.scss';

// overwrite table css of buefy
.table {
  margin: 0 auto;
}
.table th, .table td {
  vertical-align: middle !important;
}
</style>
