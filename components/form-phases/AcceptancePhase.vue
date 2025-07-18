<template>
  <div class="space-y-6">
    <UFormField
      label="Acceptance Criteria (Optional)"
      :error="error"
      class="text-gray-500"
    >
      <div class="space-y-6">
        <div
          v-for="(criteria, index) in acceptanceCriteria"
          :key="index"
          class="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <h4 class="font-medium text-gray-500 mb-4">
            {{ index + 1 }}. {{ objectives[index] || `Objective ${index + 1}` }}:
          </h4>

          <!-- Given Conditions -->
          <div class="space-y-3 mb-4">
            <label class="text-sm font-medium text-gray-500">Given (Context) (Optional):</label>
            <div class="space-y-2">
              <div
                v-for="(given, givenIndex) in criteria.given"
                :key="givenIndex"
                class="flex items-center gap-2"
              >
                <UInput
                  v-model="criteria.given[givenIndex]"
                  placeholder="Given condition..."
                  class="flex-1"
                  @update:model-value="handleUpdate"
                  @keydown.enter="handleGivenEnter($event, index, givenIndex)"
                  @keydown.backspace="handleGivenBackspace($event, index, givenIndex)"
                />
                <UButton
                  v-if="criteria.given.length > 1"
                  variant="outline"
                  color="error"
                  size="sm"
                  @click="removeGiven(index, givenIndex)"
                >
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </UButton>
              </div>
              <UButton
                variant="outline"
                color="primary"
                size="sm"
                class="text-gray-500"
                @click="addGiven(index)"
              >
                <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                Add Given
              </UButton>
            </div>
          </div>

          <!-- When Conditions -->
          <div class="space-y-3 mb-4">
            <label class="text-sm font-medium text-gray-500">When (Action) (Optional):</label>
            <div class="space-y-2">
              <div
                v-for="(when, whenIndex) in criteria.when"
                :key="whenIndex"
                class="flex items-center gap-2"
              >
                <UInput
                  v-model="criteria.when[whenIndex]"
                  placeholder="When action..."
                  class="flex-1"
                  @update:model-value="handleUpdate"
                  @keydown.enter="handleWhenEnter($event, index, whenIndex)"
                  @keydown.backspace="handleWhenBackspace($event, index, whenIndex)"
                />
                <UButton
                  v-if="criteria.when.length > 1"
                  variant="outline"
                  color="error"
                  size="sm"
                  @click="removeWhen(index, whenIndex)"
                >
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </UButton>
              </div>
              <UButton
                variant="outline"
                color="primary"
                size="sm"
                class="text-gray-500"
                @click="addWhen(index)"
              >
                <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                Add When
              </UButton>
            </div>
          </div>

          <!-- Then Conditions -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-gray-500">Then (Expected Result) (Optional):</label>
            <div class="space-y-2">
              <div
                v-for="(then, thenIndex) in criteria.then"
                :key="thenIndex"
                class="flex items-center gap-2"
              >
                <UInput
                  v-model="criteria.then[thenIndex]"
                  placeholder="Then result..."
                  class="flex-1"
                  @update:model-value="handleUpdate"
                  @keydown.enter="handleThenEnter($event, index, thenIndex)"
                  @keydown.backspace="handleThenBackspace($event, index, thenIndex)"
                />
                <UButton
                  v-if="criteria.then.length > 1"
                  variant="outline"
                  color="error"
                  size="sm"
                  @click="removeThen(index, thenIndex)"
                >
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </UButton>
              </div>
              <UButton
                variant="outline"
                color="primary"
                size="sm"
                class="text-gray-500"
                @click="addThen(index)"
              >
                <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                Add Then
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
interface AcceptanceCriteria {
  given: string[]
  when: string[]
  then: string[]
}

interface Props {
  modelValue: AcceptanceCriteria[]
  objectives: string[]
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: AcceptanceCriteria[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const acceptanceCriteria = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleUpdate = () => {
  emit('update:modelValue', acceptanceCriteria.value)
}

// Given management methods
const addGiven = (criteriaIndex: number) => {
  acceptanceCriteria.value[criteriaIndex].given.push('')
  handleUpdate()
}

const removeGiven = (criteriaIndex: number, givenIndex: number) => {
  if (acceptanceCriteria.value[criteriaIndex].given.length > 1) {
    acceptanceCriteria.value[criteriaIndex].given.splice(givenIndex, 1)
    handleUpdate()
  }
}

// When management methods
const addWhen = (criteriaIndex: number) => {
  acceptanceCriteria.value[criteriaIndex].when.push('')
  handleUpdate()
}

const removeWhen = (criteriaIndex: number, whenIndex: number) => {
  if (acceptanceCriteria.value[criteriaIndex].when.length > 1) {
    acceptanceCriteria.value[criteriaIndex].when.splice(whenIndex, 1)
    handleUpdate()
  }
}

// Then management methods
const addThen = (criteriaIndex: number) => {
  acceptanceCriteria.value[criteriaIndex].then.push('')
  handleUpdate()
}

const removeThen = (criteriaIndex: number, thenIndex: number) => {
  if (acceptanceCriteria.value[criteriaIndex].then.length > 1) {
    acceptanceCriteria.value[criteriaIndex].then.splice(thenIndex, 1)
    handleUpdate()
  }
}

// Keyboard handlers
const handleGivenEnter = (event: KeyboardEvent, criteriaIndex: number, givenIndex: number) => {
  event.preventDefault()
  addGiven(criteriaIndex)
  setTimeout(() => {
    const criteriaContainers = document.querySelectorAll('.border.border-gray-200.rounded-lg.p-4.bg-gray-50') as NodeListOf<HTMLElement>
    if (criteriaContainers[criteriaIndex]) {
      const givenInputs = criteriaContainers[criteriaIndex].querySelectorAll(`input[placeholder="Given condition..."]`) as NodeListOf<HTMLInputElement>
      const newInputIndex = givenIndex + 1
      if (givenInputs[newInputIndex]) {
        givenInputs[newInputIndex].focus()
      }
    }
  }, 100)
}

const handleWhenEnter = (event: KeyboardEvent, criteriaIndex: number, whenIndex: number) => {
  event.preventDefault()
  addWhen(criteriaIndex)
  setTimeout(() => {
    const criteriaContainers = document.querySelectorAll('.border.border-gray-200.rounded-lg.p-4.bg-gray-50') as NodeListOf<HTMLElement>
    if (criteriaContainers[criteriaIndex]) {
      const whenInputs = criteriaContainers[criteriaIndex].querySelectorAll(`input[placeholder="When action..."]`) as NodeListOf<HTMLInputElement>
      const newInputIndex = whenIndex + 1
      if (whenInputs[newInputIndex]) {
        whenInputs[newInputIndex].focus()
      }
    }
  }, 100)
}

const handleThenEnter = (event: KeyboardEvent, criteriaIndex: number, thenIndex: number) => {
  event.preventDefault()
  addThen(criteriaIndex)
  setTimeout(() => {
    const criteriaContainers = document.querySelectorAll('.border.border-gray-200.rounded-lg.p-4.bg-gray-50') as NodeListOf<HTMLElement>
    if (criteriaContainers[criteriaIndex]) {
      const thenInputs = criteriaContainers[criteriaIndex].querySelectorAll(`input[placeholder="Then result..."]`) as NodeListOf<HTMLInputElement>
      const newInputIndex = thenIndex + 1
      if (thenInputs[newInputIndex]) {
        thenInputs[newInputIndex].focus()
      }
    }
  }, 100)
}

const handleGivenBackspace = (event: KeyboardEvent, criteriaIndex: number, givenIndex: number) => {
  const input = event.target as HTMLInputElement
  if (input.value === '' && acceptanceCriteria.value[criteriaIndex].given.length > 1) {
    event.preventDefault()
    removeGiven(criteriaIndex, givenIndex)
    setTimeout(() => {
      const prevInput = document.querySelector(`input[placeholder="Given condition..."]`) as HTMLInputElement
      if (prevInput) {
        prevInput.focus()
      }
    }, 100)
  }
}

const handleWhenBackspace = (event: KeyboardEvent, criteriaIndex: number, whenIndex: number) => {
  const input = event.target as HTMLInputElement
  if (input.value === '' && acceptanceCriteria.value[criteriaIndex].when.length > 1) {
    event.preventDefault()
    removeWhen(criteriaIndex, whenIndex)
    setTimeout(() => {
      const prevInput = document.querySelector(`input[placeholder="When action..."]`) as HTMLInputElement
      if (prevInput) {
        prevInput.focus()
      }
    }, 100)
  }
}

const handleThenBackspace = (event: KeyboardEvent, criteriaIndex: number, thenIndex: number) => {
  const input = event.target as HTMLInputElement
  if (input.value === '' && acceptanceCriteria.value[criteriaIndex].then.length > 1) {
    event.preventDefault()
    removeThen(criteriaIndex, thenIndex)
    setTimeout(() => {
      const prevInput = document.querySelector(`input[placeholder="Then result..."]`) as HTMLInputElement
      if (prevInput) {
        prevInput.focus()
      }
    }, 100)
  }
}
</script>