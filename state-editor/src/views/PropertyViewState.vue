<template>
    <div class="property-view"  v-if="jsonData.type === 'StateShape'">
        <h3>State</h3>
        <input
            id="stateName"
            type="text"
            v-model="jsonData.name"
            @input="onDataChange"
        />

        <!-- Ambient Sound ComboBox and Play Button -->
        <div class="sound-selection">
          <v-select
            v-model="jsonData.userData.ambient_sound"
            :items="soundFiles"
            label="Ambient Sound"
            outlined
          ></v-select>
          
          <v-btn icon size="small" @click="playSelectedSound">
            <v-icon size="small">mdi-play</v-icon>
          </v-btn>
              
        </div>
    
        
        <label v-if="jsonData.userData"  for="systemPrompt">System Prompt:</label>
        <textarea
            v-if="jsonData.userData" 
            id="systemPrompt"
            v-model="jsonData.userData.system_prompt"
            @input="onDataChange"
            rows="5"
            placeholder="Enter detailed system instructions here..."
        ></textarea>

    </div>
</template>
  
<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'PropertyView',
    props: {
        draw2dFrame: {
            type: Object,
            required: true,
        },
    },
    data() {
      return {
        jsonData: {
          name: '',
          userData: {
            system_prompt: '',
            ambient_sound: '',
          },
        },
        currentAudio: null,
      };
    },
    computed: {
      ...mapGetters('sounds', ['files', 'currentSoundUrl']), // Get sound files and current sound URL from Vuex store
      soundFiles() {
        return this.files;
      },
    },
    watch: {
      "jsonData.userData.ambient_sound"(newValue, oldValue) {
        this.onDataChange();
      },
    },
    methods: {
      ...mapActions('sounds', ['downloadSound']), // Action to download and play sound

      onDataChange() { 
        if (this.draw2dFrame ) {
            var data = JSON.parse(JSON.stringify( this.jsonData ));
            this.draw2dFrame.postMessage({ type: 'setShapeData', data: data },'*');
        }
      },

      async playSelectedSound() {
        if (!this.jsonData.userData.ambient_sound) return;

        // Stop any currently playing audio
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0; // Reset playback to the start
          this.currentAudio = null;
        }

        // Download and play the selected sound using Vuex action
        await this.downloadSound(this.jsonData.userData.ambient_sound);

        // Play sound from the current URL after download
        if (this.currentSoundUrl) {
          this.currentAudio = new Audio(this.currentSoundUrl); // Store audio instance
          this.currentAudio.play();
          this.currentAudio.onended = () => {
            URL.revokeObjectURL(this.currentSoundUrl);
            this.currentAudio = null; // Clear current audio when done
          };
        }
      },
    },

    mounted() {
        // Event listener for messages from the iframe
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) return;
            const message = event.data;
            if (message.type === 'onStateSelect') {
                this.jsonData = message.data
            }
        });
    }
  };
  </script>
  
  <style scoped>
  .property-view {
    height: 100%;
    overflow-y: auto;
    padding: 10px;
    background-color: #fafafa;
    border-left: 1px solid #ddd;
    box-sizing: border-box; 
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  

  .property-view h3 {
  margin-top: 0;
}

.property-view label {
  display: block;
  margin: 10px 0 5px;
}

.property-view input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.property-view textarea {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical; /* Allows vertical resizing only */
  background-color: #f9f9f9;
  flex: 1;
}

.sound-selection {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.v-combobox {
  flex: 1; 
}
  </style>
  