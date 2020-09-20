<template>
  <b-tabs type="is-boxed" expanded>
    <b-tab-item label="狀態" icon="clipboard-list"><SubTabSetReadingStatus/></b-tab-item>
    <b-tab-item label="老杜桌" icon="book-medical"><SubTabSetHasRead/></b-tab-item>
    <b-tab-item label="檢查表" icon="check-square"></b-tab-item>
  </b-tabs>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SubTabSetReadingStatus from './SubTabSetReadingStatus.vue';
import SubTabSetHasRead from './SubTabSetHasRead.vue';

export default {
  components: {
    SubTabSetReadingStatus,
    SubTabSetHasRead,
  },
  methods: {
    ...mapActions(['getMembers', 'resetReadingStatus', 'switchReadingSetupOperation', 'switchReadingStatus']),
  },
  computed: {
    ...mapGetters(['readingSetupStatus', 'members', 'lastUpdatedTime']),
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
