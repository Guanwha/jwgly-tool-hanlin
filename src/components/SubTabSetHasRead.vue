<template>
  <div>
    <div class="flex-rsbc">
      <button class="button space-top space-bottom" style='width: 5rem;'
              @click.prevent='resetHasRead()'>
          初始化
      </button>
      <button class="button space-top space-bottom" style='width: 5rem;'
              @click.prevent='getMembers()'>
          <i class="fas fa-sync"></i>
      </button>
    </div>
    <div class='space-bottom'>請選擇 已讀老杜桌 人員</div>
    <!-- read status table -->
    <div class='table-reading-status'>
      <div class="cell" v-for='member in members' :key='member.id'>
        <button class='button'
                :class="[(!member.hasRead) ? '' : 'is-danger']"
                @click.prevent='switchHasRead(member)'>
          {{ member.name }}
        </button>
      </div>
    </div>
    <!-- readme -->
    <hr class='mt-0'>
    <div class='readme'>
      <div>顏色說明：</div>
      <div><button class='button is-danger'></button><span>已讀老杜桌</span></div>
      <div><button class='button btn-reserved'></button><span>預定老杜桌</span></div>
      <div><button class='button'></button><span>未讀老杜桌</span></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  methods: {
    ...mapActions(['getMembers', 'resetHasRead', 'switchHasRead']),
  },
  computed: {
    ...mapGetters(['members']),
  },
};
</script>

<style lang='scss' scoped>
@import '@/styles/gw-utilities.scss';
@import '@/styles/button.scss';

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
.updated-time {
  @include flex-rrc;
  @include mt-1;
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
