<template>
  <q-dialog :model-value="props.modelValue" @hide="closeDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Add Group</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="groupName" label="Name" placeholder="Trip to Paris" />
        <q-input v-model="groupDescription" label="Description" type="textarea"
          placeholder="Inspired by Emily in Paris, but with more spreadsheets than stilettos! Let’s split every baguette, beret, and breathtaking view—because even in Paris, someone has to keep track of the euros!" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="secondary" v-close-popup />
        <q-btn flat label="Add" color="secondary" @click="onAdd" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'add'])

const groupName = ref('')
const groupDescription = ref('')

function closeDialog() {
  emit('update:modelValue', false)
}

function onAdd() {
  emit('add', groupName.value, groupDescription.value)
  closeDialog()
  groupName.value = ''
  groupDescription.value = ''
}
</script>
