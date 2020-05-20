import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import App from './App.vue';
import store from './store';


Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultContainerElement: '#content',
});
Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
