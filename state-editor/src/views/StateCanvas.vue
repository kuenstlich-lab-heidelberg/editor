<template>
  <splitpanes 
      ref="splitPanes" 
      class="default-theme full-height"  
      @resized="handleResize">
    <!-- Editor-Bereich -->
    <pane min-size="40%"  :size="paneSize">
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
    <pane min-size="20%"  :size="100-paneSize">
      <PropertyViewState v-if="draw2dFrameContent" :draw2dFrame="draw2dFrameContent"/>
      <PropertyViewTriggerLabel v-if="draw2dFrameContent" :draw2dFrame="draw2dFrameContent"/>
      <PropertyViewTriggerConnection v-if="draw2dFrameContent" :draw2dFrame="draw2dFrameContent"/>
    </pane>
  </splitpanes>
</template>

<script>
import { nextTick } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import PropertyViewState from './PropertyViewState.vue';
import PropertyViewTriggerLabel from './PropertyViewTriggerLabel.vue';
import PropertyViewTriggerConnection from './PropertyViewTriggerConnection.vue';

export default {
  components: {
    Splitpanes,
    Pane,
    PropertyViewState,
    PropertyViewTriggerLabel,
    PropertyViewTriggerConnection
  },
  data() {
    return {
      draw2dFrameContent: null,
      paneSize: 50,
      blocked: false,
    };
  },
  computed: {
    ...mapGetters('conversations', ['conversationDiagram', 'documentRequestTrigger', 'conversationName']),
    draw2dFrame() {
      return this.$refs.draw2dFrame;
    }
  },
  watch: {
    conversationDiagram: {
      handler(newConversationDiagram) {
        if(this.blocked){
          this.blocked = false;
          return
        }

        if (newConversationDiagram && this.draw2dFrameContent) {
          const iframe = this.draw2dFrame.contentWindow;
          iframe.postMessage({ type: 'setDocument', data: JSON.parse(JSON.stringify(newConversationDiagram)) }, '*');
        }
      },
      immediate: true, // Immediately run the handler when component is created
    }
  },

  methods: {
    ...mapActions('conversations', ['saveConversation', 'updateConversationDiagram']),

    async saveReceivedDocument() {
      await this.saveConversation();
    },
    updateDraw2dFrame() {
      // Check if the draw2dFrame ref is set
      if (this.$refs.draw2dFrame) {
        this.draw2dFrameContent = this.$refs.draw2dFrame.contentWindow;
      }
    },
    handleResize(event) {
      this.paneSize = event[0].size;
      localStorage.setItem('paneSize', this.paneSize);
      console.log(this.paneSize)
    },
    loadDividerPosition() {
      // Load pane size from local storage
      const savedSize = localStorage.getItem('paneSize');
      if (savedSize !== null) {
        this.paneSize = parseFloat(savedSize);
      }
    },
  },
  mounted() {
    nextTick(() => {
      this.updateDraw2dFrame();
      if (this.conversationDiagram && this.draw2dFrameContent) {  
        setTimeout(() => {
          this.draw2dFrameContent.postMessage({ type: 'setDocument', data: JSON.parse(JSON.stringify(this.conversationDiagram)) }, '*');
        }, 500);
        
      }
    });

    // Load divider position from local storage on mount
    this.loadDividerPosition();

    // Add event listener for the iframe load event
    const iframe = this.$refs.draw2dFrame;
    iframe.addEventListener('load', this.onIframeLoad);

    // Event listener for messages from the iframe
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      const message = event.data;
      if (message.type === 'updateDocumentData') {
        this.blocked = true
        this.updateConversationDiagram(message.data)
      }
    });
  }
};
</script>

<style scoped>
.full-height {
  height: 100vh;
  display: flex;
}

/* Ensure each pane inside splitpanes takes full height */
.splitpanes {
  height: 100%;
  display: flex;
}

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
