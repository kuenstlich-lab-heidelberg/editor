<template>
  <v-app-bar color="primary" dark >
    <v-btn icon>
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn text @click="openFileDialog">Load</v-btn>
    <v-btn text @click="triggerSave">Save</v-btn> 
    <v-spacer></v-spacer>

    <FilePickerDialog v-model:dialog="filePickerDialog" />

</v-app-bar>
</template>

<script>
import { mapActions } from 'vuex';
import FilePickerDialog from './FilePickerDialog.vue';

export default {
  components: {
    FilePickerDialog,
  },
  data() {
    return {
      filePickerDialog: false,
    };
  },
  methods: {
    ...mapActions('conversations', ['triggerDocumentRequest']),

    openFileDialog() {
      this.filePickerDialog = true;
    },
    triggerSave() {
      // request the JSON document from the inner IFrame
      this.triggerDocumentRequest();
      console.log("Document request triggered");
    },
  },
};
</script>

<style scoped>
/* Optional custom styles */
</style>
