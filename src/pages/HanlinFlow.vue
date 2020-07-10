<template>
  <section>
    <loading :active.sync="isLoading"></loading>
    <b-tabs type="is-boxed" expanded>
      <b-tab-item label="成員" icon="users"><TabMembers/></b-tab-item>
      <b-tab-item label="讀書前" icon="clipboard-list"><TabReadingBefore/></b-tab-item>
      <b-tab-item label="讀書中" icon="chalkboard-teacher"><TabReading/></b-tab-item>
    </b-tabs>
    <div>{{ displayVersion }}</div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TabMembers from '@/components/TabMembers.vue';
import TabReadingBefore from '@/components/TabReadingBefore.vue';
import TabReading from '@/components/TabReading.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  components: {
    TabMembers,
    TabReadingBefore,
    TabReading,
    Loading,
  },
  created() {
    this.getMembers();
  },
  methods: {
    ...mapActions(['getMembers']),
  },
  computed: {
    displayVersion() {
      return `v. ${process.env.VUE_APP_VERSION}`;
    },
    ...mapGetters(['isLoading']),
  },
};
</script>

<style>

</style>
