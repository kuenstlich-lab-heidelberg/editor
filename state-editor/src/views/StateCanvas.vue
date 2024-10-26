<template>
  <splitpanes class="default-theme" @resized="onResize">
    <!-- Editor-Bereich -->
    <pane min-size="40%">
      <div  class="iframe-container">
        <iframe
          ref="draw2dFrame"
          src="/canvas/index.html"
          frameborder="0"
          style="width: 100%; height: 100%; border: none"
        ></iframe>
      </div>
    </pane>

    <!-- Sidebar-Bereich -->
    <pane min-size="20%">
      <div class="sidebar">
        <h3>Palette</h3>
        <div class="palette-item">Item 1</div>
        <div class="palette-item">Item 2</div>
        <div class="palette-item">Item 3</div>
      </div>
    </pane>
  </splitpanes>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

export default {
  components: {
    Splitpanes,
    Pane,
  },
  computed: {
    ...mapGetters('conversations', ['conversationJson', 'documentRequestTrigger', 'conversationName']),
  },
  watch: {
    conversationJson(newConversationJson) {
      if (newConversationJson) {
        const iframe = this.$refs.draw2dFrame.contentWindow;
        iframe.postMessage({ type: 'setDocument', data: newConversationJson }, '*');
      }
    },
    documentRequestTrigger() {
      const iframe = this.$refs.draw2dFrame.contentWindow;
      iframe.postMessage({ type: 'getDocument' }, '*');
    }
  },
  methods: {
    ...mapActions('conversations', ['saveConversation']),

    async saveReceivedDocument(documentData) {
      console.log('Saving received document data:', documentData);
      await this.saveConversation({
        fileName: this.conversationName,
        conversationDocument:documentData,
      });
    },
    onResize() {
      console.log('Resized');
    },
  },
  mounted() {
    // Add event listener for the iframe load event
    const iframe = this.$refs.draw2dFrame;
    iframe.addEventListener('load', this.onIframeLoad);

    // Event listener for messages from the iframe
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      const message = event.data;
      if (message.type === 'documentData') {
        this.saveReceivedDocument(message.data);
      }
    });
  }
};
</script>

<style scoped>
.iframe-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.sidebar {
  background-color: #f4f4f4;
  padding: 10px;
  height: 100%;
  overflow-y: auto;
}

.palette-item {
  padding: 10px;
  margin: 5px;
  background-color: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
}
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
