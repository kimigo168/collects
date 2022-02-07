import DefaultImage from "./default-image.vue";
import labelDetail from './label-detail.vue'
const defaultComponent = {
  install: function (Vue) {
    Vue.component("defaultImage", DefaultImage);
    Vue.component('labelDetail', labelDetail);
  }
}

export default defaultComponent;
