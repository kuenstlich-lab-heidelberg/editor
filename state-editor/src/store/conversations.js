import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

export default {
  namespaced: true,
  state: {
    conversations: [],
    conversationConfig: {
      system_prompt: "prompt",
      inventory: [],
    },
    conversationDiagram: [],
    conversationName: "unknown.json",
    loading: false,
    error: null
  },
  mutations: {
    SET_CONVERSATIONS(state, conversations) {
      state.conversations = conversations;
    },
    SET_CONVERSATION_CONFIG(state, data) {
      state.conversationConfig = data;
    },
    ADD_INVENTORY_ITEM(state, item) {
      state.conversationConfig.inventory.push(item);
    },
    UPDATE_INVENTORY_ITEM(state, { index, item }) {
      state.conversationConfig.inventory.splice(index, 1, item);
    },
    REMOVE_INVENTORY_ITEM(state, index) {
      state.conversationConfig.inventory.splice(index, 1);
    },
    SET_CONVERSATION_DIAGRAM(state, data) {
      state.conversationDiagram = data;
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_CONVERSATION_NAME(state, newName) {
      state.conversationName = newName;
    },
  },
  actions: {
    async initialize({ dispatch }) {
      // Load the default "document.json" file on initialization
      try {
        await dispatch('downloadConversation', 'document.json');
      } catch (error) {
        console.error('Failed to load default conversation:', error);
      }
    },

    async fetchConversations({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const response = await axios.get(`${API_BASE_URL}/conversations/`);
        commit('SET_CONVERSATIONS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.detail || 'Error fetching conversations');
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async downloadConversation({ commit }, fileName) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const response = await axios.get(`${API_BASE_URL}/conversations/${fileName}`, {
          responseType: 'blob',
        });
        const conversationData = JSON.parse(await response.data.text()); 
        commit('SET_CONVERSATION_CONFIG', conversationData.config); 
        commit('SET_CONVERSATION_DIAGRAM', conversationData.diagram); 
        commit('SET_CONVERSATION_NAME', fileName);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.detail || 'Error downloading file');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateConversationConfig({ commit }, data) {
      commit('SET_CONVERSATION_CONFIG', data);
    },
    addInventoryItem({ commit }, item) {
      commit('ADD_INVENTORY_ITEM', item);
    },
    updateInventoryItem({ commit }, { index, item }) {
      commit('UPDATE_INVENTORY_ITEM', { index, item });
    },
    removeInventoryItem({ commit }, index) {
      commit('REMOVE_INVENTORY_ITEM', index);
    },
    async updateConversationDiagram({ commit }, data) {
      commit('SET_CONVERSATION_DIAGRAM', data);
    },

    async saveConversation({ commit,state }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
          const formattedJson = JSON.stringify({
            "config": state.conversationConfig,
            "diagram": state.conversationDiagram
          }, null, 4);

          const blob = new Blob([formattedJson], { type: 'application/json' });
          const formData = new FormData();
          formData.append('file', blob, state.conversationName);

          // Send POST request to backend
          await axios.post(`${API_BASE_URL}/conversations/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          //commit('SET_CONVERSATION_NAME', fileName);
        } catch (error) {
          commit('SET_ERROR', error.response?.data?.detail || 'Error saving document');
          throw error;
        } finally {
          commit('SET_LOADING', false);
        }
    },
  },
  getters: {
    conversations: (state) => state.conversations,
    conversationConfig: (state) => state.conversationConfig,
    conversationDiagram: (state) => state.conversationDiagram,
    conversationName: (state) => state.conversationName,

    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
