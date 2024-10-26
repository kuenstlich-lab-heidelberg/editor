import { createStore } from 'vuex';
import conversations from './conversations';

export default createStore({
  modules: {
    conversations,
  },
});
