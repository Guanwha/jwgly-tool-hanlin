<template>
  <div>
    <div class="flex-rsbc">
      <button class="button space-top space-bottom"
              @click.prevent='resetReadingStatus()'>
          初始化
      </button>
      <button class="button space-top space-bottom"
              :class="[(readingSetupStatus === 1) ? 'is-dark' : 'is-primary']"
              @click.prevent='switchReadingSetupOperation()'>
          切換 已讀/未下課
      </button>
    </div>
    <div class='space-bottom' v-if='readingSetupStatus === 1'>請選擇 已讀 人員</div>
    <div class='space-bottom' v-if='readingSetupStatus === 2'>請選擇 未下課 人員</div>
    <!-- read status table -->
    <div class='table-reading-status'>
      <div class="cell" v-for='member in members' :key='member.id'>
        <button class='button'
                :class="[(!member.readingStatus) ? '' :
                         (member.readingStatus === 1) ? 'is-dark' : 'is-primary']"
                @click.prevent='switchReadingStatus(member)'>
          {{ member.name }}
        </button>
      </div>
    </div>
    <!-- readme -->
    <hr>
    <div class='readme'>
      <div>顏色說明：</div>
      <div><button class='button is-dark'></button><span>已讀</span></div>
      <div><button class='button'></button><span>未讀</span></div>
      <div><button class='button is-primary'></button><span>未下課</span></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  methods: {
    ...mapActions(['resetReadingStatus', 'switchReadingSetupOperation', 'switchReadingStatus']),
  },
  computed: {
    ...mapGetters(['readingSetupStatus', 'members']),
  },
};
</script>

<style lang='scss' scoped>
@import '@/styles/gw-utilities.scss';

.table-reading-status {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .cell {
    width: 25%;
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
