<template>
  <section>
    <b-tabs type="is-boxed" expanded>
      <b-tab-item label="成員" icon="users"><TabMembers/></b-tab-item>
      <b-tab-item label="讀書前" icon="clipboard-list">讀書前紀錄</b-tab-item>
      <b-tab-item label="讀書中" icon="chalkboard-teacher">讀書中使用</b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import TabMembers from '@/components/TabMembers.vue';

export default {
  components: {
    TabMembers,
  },
};
</script>

<style>

</style>
