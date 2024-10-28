<template>
    <div class="property-view"  v-if="jsonData.type === 'StateShape'">
        <h3>State</h3>
        <input
            id="stateName"
            type="text"
            v-model="jsonData.name"
            @input="onDataChange"
        />

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
        },
        },
      };
    },
    methods: {
      onDataChange() { 
        if (this.draw2dFrame ) {
            var data = JSON.parse(JSON.stringify( this.jsonData ));
            this.draw2dFrame.postMessage({ type: 'setShapeData', data: data },'*');
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
  </style>
  