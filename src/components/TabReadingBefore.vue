<template>
  <div>
    <button class="button space-top space-bottom"
            :class="[(readingSetupStatus === 0) ? 'is-danger' : 'is-warning']"
            @click.prevent='switchReadingSetupOperation()'>
        切換
    </button>
    <div v-if='readingSetupStatus === 0'>請選擇 已讀 人員</div>
    <div v-if='readingSetupStatus === 1'>請選擇 未下課 人員</div>
    <!-- read status table -->
    <div>

    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  methods: {
    ...mapActions(['switchReadingSetupOperation']),
  },
  computed: {
    ...mapGetters(['readingSetupStatus']),
  },
};
</script>

<style>

</style>
