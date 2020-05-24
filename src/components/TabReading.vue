<template>
  <div>
    <!-- read status table -->
    <div class='block-header has-background-white-ter'>
      <div class='is-left has-text-weight-bold'>未讀：</div>
      <button class="button is-dark" @click.prevent='finishReadingStatus(haveReadList)'>送出已讀人員</button>
    </div>
    <ul class='table-reading'>
      <li class="cell" v-for='member in membersNeedRead' :key='member.id'>
        <button class='button' :class="{ 'is-dark': isSelected(member.id) }"
                @click.prevent='addToHaveReadList(member.id)'>
          {{ grades[member.grade] }} {{ member.name }}
        </button>
      </li>
    </ul>
    <hr>
    <div class='block-header has-background-white-ter'>
      <div class='is-left has-text-weight-bold'>未下課：</div>
      <div>
        <button class="button is-primary mr-0-5">一鍵下課 ⇪</button>
        <button class="button is-dark">下課 ⇪</button>
      </div>
    </div>
    <!-- readme -->
    <hr>
    <div class='readme'>
      <div>顏色說明：</div>
      <div><button class='button'></button><span>未讀</span></div>
      <div><button class='button is-dark'></button><span>已讀</span></div>
      <div><button class='button is-primary'></button><span>未下課</span></div>
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
      haveReadList: [],
    };
  },
  methods: {
    isSelected(curID) {
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
    ...mapActions(['switchReadingSetupOperation', 'switchReadingStatus', 'finishReadingStatus']),
  },
  computed: {
    ...mapGetters(['readingSetupStatus', 'members', 'membersNeedRead']),
  },
};
</script>

<style lang='scss'>
.block-header {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.mr-0-5 {
  margin-right: 0.5rem;
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
  width: 50%;
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
