import Vue from 'vue';
// Buefy modules
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
// custom modules
import App from './App.vue';
import store from './store';
import './styles/customBuefy.scss';

// Buefy
Vue.use(Buefy, {
  defaultIconPack: 'fas',
  defaultContainerElement: '#content',
});
Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
