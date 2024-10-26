import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

export default {
  namespaced: true,
  state: {
    conversations: [],
    conversationJson: [],
    conversationName: "unknown.json",
    loading: false,
    error: null,
    documentRequestTrigger: false,
  },
  mutations: {
    SET_CONVERSATIONS(state, conversations) {
      state.conversations = conversations;
    },
    SET_CONVERSATION_JSON(state, data) {
      state.conversationJson = data;
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
        const conversationJson = await response.data.text(); 
        commit('SET_CONVERSATION_JSON', conversationJson); 
        commit('SET_CONVERSATION_NAME', fileName);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.detail || 'Error downloading file');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },


    async saveConversation({ commit }, { fileName, conversationDocument }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
          // Convert JSON document to a Blob for submission
    // Convert JSON document to pretty-printed format without additional escaping
          const formattedJson = JSON.stringify(conversationDocument, null, 4);
          console.log(formattedJson) 
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
    conversationJson: (state) => state.conversationJson,
    conversationName: (state) => state.conversationName,

    documentRequestTrigger: (state) => state.documentRequestTrigger,

    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
