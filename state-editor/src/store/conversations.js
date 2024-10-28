import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

export default {
  namespaced: true,
  state: {
    conversations: [],
    conversationConfig: [],
    conversationDiagram: [],
    conversationName: "unknown.json",
    loading: false,
    error: null,
    documentRequestTrigger: false,
  },
  mutations: {
    SET_CONVERSATIONS(state, conversations) {
      state.conversations = conversations;
    },
    SET_CONVERSATION_CONFIG(state, data) {
      state.conversationConfig = data;
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
    TRIGGER_DOCUMENT_REQUEST(state) {
      state.documentRequestTrigger = !state.documentRequestTrigger; // Toggle the trigger
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

    async updateConversationDiagram({ commit }, data) {
      commit('SET_CONVERSATION_DIAGRAM', data);
    },

    async saveConversation({ commit,state }, { fileName }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
          const formattedJson = JSON.stringify({
            "config": state.conversationConfig,
            "diagram": state.conversationDiagram
          }, null, 4);

          const blob = new Blob([formattedJson], { type: 'application/json' });
          const formData = new FormData();
          formData.append('file', blob, fileName);

          // Send POST request to backend
          await axios.post(`${API_BASE_URL}/conversations/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          commit('SET_CONVERSATION_NAME', fileName);
        } catch (error) {
          commit('SET_ERROR', error.response?.data?.detail || 'Error saving document');
          throw error;
        } finally {
          commit('SET_LOADING', false);
        }
    },

    // Action to toggle the document request trigger
    triggerDocumentRequest({ commit }) {
      commit('TRIGGER_DOCUMENT_REQUEST');
    },
  },
  getters: {
    conversations: (state) => state.conversations,
    conversationConfig: (state) => state.conversationConfig,
    conversationDiagram: (state) => state.conversationDiagram,
    conversationName: (state) => state.conversationName,

    documentRequestTrigger: (state) => state.documentRequestTrigger,

    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
