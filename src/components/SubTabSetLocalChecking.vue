<template>
  <div>
    <div class="flex-rsbc">
      <button class="button space-top space-bottom" style='width: 5rem;'
              @click.prevent='resetChecks()'>
          初始化
      </button>
      <button class="button space-top space-bottom" style='width: 5rem;'
              @click.prevent='getMembers()'>
          <i class="fas fa-sync"></i>
      </button>
    </div>
    <div class='space-bottom'>狀態不會同步，請隨意使用</div>
    <!-- read status table -->
    <div class='table-reading-status'>
      <div class="cell" v-for='member in members' :key='member.id'>
        <button class='button'
                :class="[(!checks[member.id]) ? '' : 'is-success']"
                @click.prevent='setCheck(member.id)'>
          {{ member.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      checks: {},
    };
  },
  methods: {
    resetChecks() {
      this.checks = {};
    },
    setCheck(id) {
      if (this.checks[id]) {
        this.$set(this.checks, id, !this.checks[id]);
      }
      else {
        this.$set(this.checks, id, true);
      }
    },
    ...mapActions(['getMembers']),
  },
  computed: {
    ...mapGetters(['members']),
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
