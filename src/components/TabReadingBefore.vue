<template>
  <div>
    <button class="button space-top space-bottom"
            :class="[(readingSetupStatus === 1) ? 'is-danger' : 'is-warning']"
            @click.prevent='switchReadingSetupOperation()'>
        切換 已讀/未下課
    </button>
    <div class='space-bottom' v-if='readingSetupStatus === 1'>請選擇 已讀 人員</div>
    <div class='space-bottom' v-if='readingSetupStatus === 2'>請選擇 未下課 人員</div>
    <!-- read status table -->
    <div class='table-reading-status'>
      <div class="cell" v-for='member in members' :key='member.id'>
        <button class='button'
                :class="[(!member.readingStatus) ? '' :
                         (member.readingStatus === 1) ? 'is-danger' : 'is-warning']"
                @click.prevent='switchReadingStatus(member)'>
          {{ member.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  methods: {
    ...mapActions(['switchReadingSetupOperation', 'switchReadingStatus']),
  },
  computed: {
    ...mapGetters(['readingSetupStatus', 'members']),
  },
};
</script>

<style lang='scss'>
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
</style>
