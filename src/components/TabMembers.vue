<template>
  <div>成員</div>
</template>

<script>
// import * as firebase from 'firebase/app';
import firebase from '@/js/firebase';

export default {
  data() {
    return {
      refMembers: null,
      members: {},
    };
  },
  created() {
    this.getMembers();
  },
  methods: {
    getMembers() {
      this.refMembers = firebase.database().ref('/members/');

      this.refMembers.once('value').then((snapshot) => {
        const val = snapshot.val();
        // do something
        console.log(val);
      });
    },
  },
};
</script>

<style>

</style>
