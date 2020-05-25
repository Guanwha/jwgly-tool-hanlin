<template>
  <section>
    <b-tabs type="is-boxed" expanded>
      <b-tab-item label="成員" icon="users"><TabMembers/></b-tab-item>
      <b-tab-item label="讀書前" icon="clipboard-list"><TabReadingBefore/></b-tab-item>
      <b-tab-item label="讀書中" icon="chalkboard-teacher"><TabReading/></b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import TabMembers from '@/components/TabMembers.vue';
import TabReadingBefore from '@/components/TabReadingBefore.vue';
import TabReading from '@/components/TabReading.vue';

export default {
  components: {
    TabMembers,
    TabReadingBefore,
    TabReading,
  },
  created() {
    this.getMembers();
  },
  methods: {
    ...mapActions(['getMembers']),
  },
};
</script>

<style>

</style>
