<template>
  <v-container>
    <!-- System Prompt Section -->
    <h4>System Prompt</h4>
    <v-textarea
      id="systemPrompt"
      v-model="systemPrompt"
      outlined
      rows="5"
      placeholder="Enter system prompt here..."
      style="width: 100%;"
    ></v-textarea>

    <!-- Inventory Section -->
    <h4>Inventory</h4>
    <v-row class="align-center">
      <v-col cols="5">
        <v-text-field
          v-model="newItem.key"
          label="New Item Key"
          placeholder="Enter key"
          outlined
          dense
          full-width
        ></v-text-field>
      </v-col>
      <v-col cols="5">
        <v-text-field
          v-model="newItem.value"
          label="New Item Value"
          placeholder="Enter value"
          outlined
          dense
          full-width
        ></v-text-field>
      </v-col>
      <v-col cols="2" class="d-flex align-center">
        <v-btn @click="addItem" color="primary" block>Add Item</v-btn>
      </v-col>
    </v-row>

    <!-- Inventory Table -->
    <v-table  density="compact">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in inventory" :key="key">
          <td>{{ key }}</td>
          <td>
            <v-text-field
              v-model="inventory[key]"
              @change="updateInventory"
              outlined
              dense
              full-width
            ></v-text-field>
          </td>
          <td>
            <v-btn icon @click="removeItem(key)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'PropertyView',
  data() {
    return {
      newItem: { key: '', value: '' }, // New item to be added
    };
  },
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
    inventory: {
      get() {
        return this.conversationConfig.inventory || {};
      },
      set(value) {
        this.updateConversationConfig({
          ...this.conversationConfig,
          inventory: value,
        });
      },
    },
  },
  methods: {
    ...mapActions('conversations', ['updateConversationConfig', 'addInventoryItem', 'updateInventoryItem', 'removeInventoryItem']),
    
    addItem() {
      if (this.newItem.key && this.newItem.value !== undefined) {
        // Create a copy of the inventory and add the new key-value pair
        const updatedInventory = { ...this.inventory, [this.newItem.key]: this.newItem.value };
        
        // Update the Vuex store with the new inventory object
        this.updateConversationConfig({
          ...this.conversationConfig,
          inventory: updatedInventory,
        });
        
        // Reset the form
        this.newItem = { key: '', value: '' };
      }
    },

    updateInventory() {
      // Update inventory in Vuex store
      this.updateConversationConfig({
        ...this.conversationConfig,
        inventory: { ...this.inventory },
      });
    },

    removeItem(key) {
      // Delete the item from the inventory object
      const updatedInventory = { ...this.inventory };
      delete updatedInventory[key];
      this.updateConversationConfig({
        ...this.conversationConfig,
        inventory: updatedInventory,
      });
    },
  },
};
</script>

<style scoped>
.v-textarea,
.v-text-field {
  width: 100%;
}

.v-btn {
  text-transform: uppercase;
}

.align-center {
  align-items: center;
}


</style>
