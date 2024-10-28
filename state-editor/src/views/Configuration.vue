<template>
  <div>
    <h3>Configuration</h3>
    <label for="systemPrompt">System Prompt:</label>
    <textarea
      id="systemPrompt"
      v-model="systemPrompt"
      rows="5"
      placeholder="Enter system prompt here..."
      style="width: 100%;"
    ></textarea>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'PropertyView',
  computed: {
    ...mapGetters('conversations', ['conversationConfig']),
    systemPrompt: {
      get() {
        return this.conversationConfig.system_prompt;
      },
      set(value) {
        // Commit the updated system prompt to the store
        this.updateConversationConfig({ ...this.conversationConfig, system_prompt: value });
      },
    },
  },
  methods: {
    ...mapActions('conversations', ['updateConversationConfig']),
  },
};
</script>

<style scoped>
textarea {
  resize: vertical; /* Allow vertical resizing only */
}
</style>
