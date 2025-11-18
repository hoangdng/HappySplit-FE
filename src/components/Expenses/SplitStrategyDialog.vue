<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Split Strategy</div>
      </q-card-section>

      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
        <q-tab name="equally" label="Equally" />
        <q-tab name="unequally" label="Unequally" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Equally Tab -->
        <q-tab-panel name="equally">
          <q-list>
            <q-item v-for="member in members" :key="member.id" tag="label" clickable>
              <q-item-section avatar>
                <q-checkbox v-model="selectedMembers" :val="member" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ member.name }}</q-item-label>
                <q-item-label caption>{{ member.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <!-- Unequally Tab -->
        <q-tab-panel name="unequally">
          <q-list>
            <q-item v-for="member in members" :key="member.id">
              <q-item-section>
                <q-item-label>{{ member.name }}</q-item-label>
                <q-item-label caption>{{ member.email }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-input v-model.number="unequalSplits[member.id]" type="number" dense outlined suffix="VNĐ"
                  style="width: 150px" :min="0" />
              </q-item-section>
            </q-item>
          </q-list>
          <div class="q-mt-md text-caption text-grey">
            Total: {{ calculateUnequalTotal() }} VNĐ / {{ totalAmount }} VNĐ
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-card-actions align="right">
        <q-btn flat label="Apply" color="primary" @click="applySplit"
          :disable="tab === 'unequally' && !isUnequalValid" />
      </q-card-actions>
      <div v-if="tab === 'unequally' && !isUnequalValid" class="text-negative q-mb-sm text-center">
        Total split amount must equal {{ props.totalAmount }} VNĐ.
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
import type { User } from 'src/stores/user'
import { useGroupStore } from 'src/stores/group'

interface Props {
  modelValue: boolean
  members: User[]
  totalAmount: number
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'apply'])
const groupStore = useGroupStore()

const tab = ref('equally')
const selectedMembers = ref<User[]>([])
watch(() => groupStore.group?.members, (members) => {
  selectedMembers.value = members ?? []
}, { immediate: true })
const unequalSplits = ref<Record<string, number>>({})
const isUnequalValid = computed(() => calculateUnequalTotal() === props.totalAmount)

// Initialize unequal splits when dialog opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.members) {
    // Initialize all members with 0
    props.members.forEach(member => {
      if (!unequalSplits.value[member.id]) {
        unequalSplits.value[member.id] = 0
      }
    })
  }
})

function calculateUnequalTotal(): number {
  return Object.values(unequalSplits.value).reduce((sum, amount) => sum + (amount || 0), 0)
}

function applySplit() {
  if (tab.value === 'equally') {
    emit('apply', {
      strategy: 'equally',
      members: selectedMembers.value
    })
  } else {
    // Filter out members with 0 amount
    const splits: Record<string, number> = {}
    Object.entries(unequalSplits.value)
      .filter(([memberId, amount]) => memberId != null && amount > 0)
      .forEach(([memberId, amount]) => {
        splits[memberId] = amount
      })

    emit('apply', {
      strategy: 'unequally',
      splits
    })
  }

  // close dialog & clear state
  selectedMembers.value = []
  unequalSplits.value = {}
  tab.value = 'equally'
  emit('update:modelValue', false)
}
</script>
