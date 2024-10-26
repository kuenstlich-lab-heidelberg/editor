  <template>
    <v-app id="app">

        <app-toolbar @requestDocument="handleRequestDocument" />

        <v-main class="content-area">
          <router-view  ref="iframeContainer"></router-view>
        </v-main>

    </v-app>
  </template>


  <script>
  import AppToolbar from './components/AppToolbar.vue'; 


  export default {
    components: {
      AppToolbar
    },
    methods: {
      handleRequestDocument() {
        // Call the requestDraw2dDocument method in the Iframe component
      // Check if the router-view has a component and that component has the method
      const iframeComponent = this.$refs.iframeContainer;

      if (iframeComponent && iframeComponent.requestDraw2dDocument) {
        iframeComponent.requestDraw2dDocument(); // Call the method directly on the component
        console.log("Request sent to iframe component");
      } else {
        console.error("Iframe component or requestDraw2dDocument method not found");
      }
        console.log("Request")
      },
    },
  };
  </script>


  <style scoped>
  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }


  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
  }
  </style>
