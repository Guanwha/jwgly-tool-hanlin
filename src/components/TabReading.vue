<template>
  <div>
    <!-- copy to clipboard -->
    <b-collapse
        aria-id="contentIdForA11y2"
        class="panel"
        animation="slide"
        :open.sync="showSetting">
        <div class='block-header has-background-white-ter'
             slot="trigger"
             role="button"
             aria-controls="contentIdForA11y2">
          <div class='is-left has-text-weight-bold'>功能：</div>
          <ul>
            <button class="button is-info mr-0-5" @click.stop='copyMembers'>複製名單</button>
            <button class="button space-top space-bottom" @click.stop='[getMembers(), clearHaveReadList(), clearNeedReadList()]'>
                <i class="fas fa-sync"></i>
            </button>
          </ul>
        </div>
        <ul>
          <li class='has-text-left'>
            <b-switch
                style='height: 36px;'
                rounded.number="true"
                size=""
                v-model='hasInClass'>{{ switchTextHasInClass }}</b-switch>
          </li>
        </ul>
    </b-collapse>
    <!-- last updated time -->
    <div class="updated-time">最後更新時間：{{ lastUpdatedTime }}</div>
    <!-- members in wating list -->
    <div class='block-header has-background-white-ter'>
      <div class='is-left has-text-weight-bold'>未讀：</div>
      <div>
        <div>
          <button class="button is-info mr-0-5" @click.stop='copyClassMembers'>開桌名單</button>
          <button class="button is-dark" :disabled='isEmptyHaveReadList'
                  @click.prevent='[finishReadingStatus(haveReadList), clearHaveReadList()]'>送出已讀人員</button>
        </div>
        <div class='flex-rrc'>
          <button class="button is-danger mt-0-5" @click.stop='copyLouduMembers'>老杜桌名單</button>
        </div>
      </div>
    </div>
    <ul class='table-reading mb-3'>
      <li class="cell" v-for='member in membersNeedRead' :key='member.id'>
        <button class='button text-left'
                :class="[ isSelectedInWaitingList(member.id) ? 'is-dark' : '',
                          classHasReadBtn(member.hasRead) ]"
                @click.prevent='addToHaveReadList(member.id)'>
          {{ grades[member.grade] }} {{ member.name }}
          <span v-if='member.beTeacher' class='has-text-danger ml-0-5'>可開</span>
          <span v-if='member.beAlternate' class='has-text-grey-light ml-0-5'>候補</span>
        </button>
      </li>
    </ul>
    <!-- members in class -->
    <div class='block-header has-background-white-ter'>
      <div class='is-left has-text-weight-bold'>未下課/飛行中：</div>
      <div>
        <button class="button mr-0-5" @click.prevent='[finishAllClassStatus(), clearNeedReadList()]'>一鍵下課 ⇪</button>
        <button class="button" :disabled='isEmptyNeedReadList'
                @click.prevent='[finishClassStatus(needReadList), clearNeedReadList()]'>下課 ⇪</button>
      </div>
    </div>
    <ul class='table-reading mb-3'>
      <li class="cell" v-for='member in membersInClass' :key='member.id'>
        <button class='button text-left' :class="{ 'is-primary': !isSelectedInClassList(member.id) }"
                @click.prevent='addToNeedReadList(member.id)'>
          {{ grades[member.grade] }} {{ member.name }}
          <span v-if='member.beTeacher' class='has-text-danger ml-0-5'>可開</span>
          <span v-if='member.beAlternate' class='has-text-grey-light ml-0-5'>候補</span>
        </button>
      </li>
    </ul>
    <!-- readme -->
    <hr>
    <div class='readme'>
      <div>顏色說明：</div>
      <div><button class='button is-dark'></button><span>已讀</span></div>
      <div><button class='button'></button><span>未讀</span></div>
      <div><button class='button is-primary'></button><span>未下課 / 飛行中</span></div>
      <div><button class='button btn-reserved'></button><span>預定老杜桌</span></div>
    </div>
  </div>
</template>

<script>
import { grades } from '@/js/constants';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      grades,
      preGrade: 0,
      haveReadList: [], // these members have read
      needReadList: [], // these members is after class
      showSetting: false,
      hasInClass: true,
    };
  },
  methods: {
    isSelectedInWaitingList(curID) {
      return this.haveReadList.findIndex((id) => id === curID) >= 0;
    },
    addToHaveReadList(curID) {
      const idx = this.haveReadList.findIndex((id) => id === curID);
      if (idx >= 0) {
        this.haveReadList.splice(idx, 1);
      }
      else {
        this.$set(this.haveReadList, this.haveReadList.length, curID);
      }
    },
    clearHaveReadList() {
      setTimeout(() => {
        this.haveReadList = [];
      }, 100);
    },
    isSelectedInClassList(curID) {
      return this.needReadList.findIndex((id) => id === curID) >= 0;
    },
    addToNeedReadList(curID) {
      const idx = this.needReadList.findIndex((id) => id === curID);
      if (idx >= 0) {
        this.needReadList.splice(idx, 1);
      }
      else {
        this.$set(this.needReadList, this.needReadList.length, curID);
      }
    },
    clearNeedReadList() {
      setTimeout(() => {
        this.needReadList = [];
      }, 100);
    },
    copyMembers() {
      // prepare message
      let msg = '';
      let num = 0;
      if (this.membersNeedRead.length > 0) {
        msg += '=== 未讀 ===\n';

        // list 未讀＋可開桌
        num = 0;
        this.preGrade = 0;
        this.members.forEach((member) => {
          if (!member.readingStatus && member.beTeacher) {
            if (num === 0) {
              msg += '老師：';
              num += 1;
            }
            msg = this.updateGradeForMessage(msg, member.grade);
            msg += `${member.name}, `;
          }
        });
        if (num > 0) {
          msg += '\n';
        }

        // list 未讀＋不開桌
        num = 0;
        this.preGrade = 0;
        this.members.forEach((member) => {
          if (!member.readingStatus && !member.beTeacher) {
            if (num === 0) {
              msg += '學生：';
              num += 1;
            }
            msg = this.updateGradeForMessage(msg, member.grade);
            msg += `${member.name}, `;
          }
        });
      }

      if (this.hasInClass && this.membersInClass.length > 0) {
        msg += '\n\n=== 未下課/飛行中 ===\n';

        // list 未下課＋可開桌
        num = 0;
        this.preGrade = 0;
        this.members.forEach((member) => {
          if (member.readingStatus === 2 && member.beTeacher) {
            if (num === 0) {
              msg += '老師：';
              num += 1;
            }
            msg = this.updateGradeForMessage(msg, member.grade);
            msg += `${member.name}, `;
          }
        });
        if (num > 0) {
          msg += '\n';
        }

        // list 未讀＋不開桌
        num = 0;
        this.preGrade = 0;
        this.members.forEach((member) => {
          if (member.readingStatus === 2 && !member.beTeacher) {
            if (num === 0) {
              msg += '學生：';
              num += 1;
            }
            msg = this.updateGradeForMessage(msg, member.grade);
            msg += `${member.name}, `;
          }
        });
      }
      // eslint-disable-next-line
      console.log(msg);

      // send to clipboard
      navigator.clipboard.writeText(msg).then(() => {
        /* clipboard successfully set */
        this.success('複製 成功');
      }, (err) => {
        /* clipboard write failed */
        this.danger(`複製 失敗: ${err}`);
      });
    },
    copyClassMembers() {
      // prepare message
      let msg = '';
      if (this.haveReadList.length === 0) {
        this.danger('請先選取要開桌的人員');
        return;
      }
      if (this.haveReadList.length > 4) {
        this.danger('選取超過四個人啦');
        return;
      }

      this.haveReadList.forEach((id) => {
        const curMember = { ...this.members.find((member) => (member.id === id)) };
        msg += `${curMember.name}, `;
      });

      // eslint-disable-next-line
      console.log(msg);

      // send to clipboard
      navigator.clipboard.writeText(msg).then(() => {
        /* clipboard successfully set */
        this.success('複製 成功');
      }, (err) => {
        /* clipboard write failed */
        this.danger(`複製 失敗: ${err}`);
      });
    },
    copyLouduMembers() {
      // prepare message
      let msg = '';
      if (this.membersLoudu.length === 0) {
        this.danger('請先到 讀書前/老杜桌 頁面<br>選取老杜桌的人員');
        return;
      }
      if (this.membersLoudu.length > 3) {
        this.danger('選取超過三個學生啦(不需要選老杜)');
        return;
      }

      this.membersLoudu.forEach((member) => {
        msg += `${member.name}, `;
      });

      // eslint-disable-next-line
      console.log(msg);

      // send to clipboard
      navigator.clipboard.writeText(msg).then(() => {
        /* clipboard successfully set */
        this.success('複製 成功');
      }, (err) => {
        /* clipboard write failed */
        this.danger(`複製 失敗: ${err}`);
      });
    },
    updateGradeForMessage(msg, curGrade) {
      let newMsg = msg;
      this.preGrade = (this.preGrade === 0) ? curGrade : this.preGrade;
      if (this.preGrade !== curGrade) {
        newMsg += '// ';
        this.preGrade = curGrade;
      }
      return newMsg;
    },
    classHasReadBtn(hasReadStatus) {
      switch (hasReadStatus) {
        // case 1: return 'is-danger';
        case 2: return 'btn-reserved';
        default: return '';
      }
    },
    ...mapActions([
      'getMembers',
      'switchReadingSetupOperation',
      'switchReadingStatus',
      'finishReadingStatus',
      'finishClassStatus',
      'finishAllClassStatus',
      'success',
      'danger',
    ]),
  },
  computed: {
    switchTextHasInClass() {
      return (this.hasInClass) ? '顯示未下課/飛行中' : '隱藏未下課/飛行中';
    },
    isEmptyHaveReadList() {
      return this.haveReadList.length === 0;
    },
    isEmptyNeedReadList() {
      return this.needReadList.length === 0;
    },
    membersLoudu() {
      return this.membersNeedRead.filter((member) => member.hasRead === 2);
    },
    ...mapGetters(['members', 'membersNeedRead', 'membersInClass', 'lastUpdatedTime']),
  },
};
</script>

<style lang='scss' scoped>
@import '@/styles/gw-utilities.scss';
@import '@/styles/button.scss';

.block-header {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.updated-time {
  @include flex-rrc;
  @include mt-1;
}
.table-reading {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .cell {
    width: 50%;
    padding: 0.2rem;
    button {
      width: 100%;
      height: 2rem;
      font-weight: bold;
    }
  }
}
.readme {
  margin: 0 auto;
  div {
    margin: 0.5rem;
    display: flex;
    align-items: center;
  }
  button {
    width: 30%;
    margin-right: 0.5rem;
  }
}
</style>
