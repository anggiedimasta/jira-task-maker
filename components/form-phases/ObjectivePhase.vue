<template>
  <div class="space-y-4">
    <UFormField
      label="Objectives"
      :error="error"
      :class="{ 'error-field': error }"
      class="text-gray-500"
    >
      <div class="space-y-3">
        <div
          v-for="(objective, index) in objectives"
          :key="index"
          class="flex items-center gap-2"
        >
          <UInput
            v-model="objectives[index]"
            :placeholder="`Objective ${index + 1}...`"
            class="flex-1 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 hover:border-gray-400"
            @update:model-value="handleUpdate"
            @keydown.enter="handleObjectiveEnter($event, index)"
            @keydown.backspace="handleObjectiveBackspace($event, index)"
          />
          <UButton
            v-if="objectives.length > 1"
            variant="outline"
            color="error"
            size="sm"
            @click="removeObjective(index)"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4" />
          </UButton>
        </div>
      </div>
                <UButton
            variant="outline"
            color="primary"
            size="sm"
            class="mt-3 text-gray-500"
            @click="addObjective"
          >
            <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
            Add Objective
          </UButton>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string[]
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const objectives = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleUpdate = () => {
  emit('update:modelValue', objectives.value)
}

const addObjective = () => {
  objectives.value.push('')
  handleUpdate()
}

const removeObjective = (index: number) => {
  if (objectives.value.length > 1) {
    objectives.value.splice(index, 1)
    handleUpdate()
  }
}

const handleObjectiveEnter = (event: KeyboardEvent, index: number) => {
  event.preventDefault()
  addObjective()
  // Focus the next input after a short delay
  setTimeout(() => {
    const nextInput = document.querySelector(`input[placeholder="Objective ${index + 2}..."]`) as HTMLInputElement
    if (nextInput) {
      nextInput.focus()
    }
  }, 100)
}

const handleObjectiveBackspace = (event: KeyboardEvent, index: number) => {
  const input = event.target as HTMLInputElement
  if (input.value === '' && objectives.value.length > 1) {
    event.preventDefault()
    removeObjective(index)
    // Focus the previous input after removal
    setTimeout(() => {
      const prevInput = document.querySelector(`input[placeholder="Objective ${index}..."]`) as HTMLInputElement
      if (prevInput) {
        prevInput.focus()
      }
    }, 100)
  }
}
</script>