<template>
  <div class="space-y-6">
    <!-- Technical Details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="Figma Link (Optional)" :error="error">
        <UInput
          v-model="techData.figma"
          placeholder="https://www.figma.com/file/..."
          @update:model-value="handleUpdate"
        />
      </UFormField>

      <UFormField label="Epic Branch (Optional)" :error="error">
        <UInput
          v-model="techData.epicBranch"
          placeholder="Leave empty - to be filled by Lead"
          @update:model-value="handleUpdate"
        />
      </UFormField>

      <UFormField
        label="Repository *"
        :error="error"
        :class="{ 'error-field': error }"
      >
        <UInput
          v-model="techData.repository"
          placeholder="https://github.com/..."
          @update:model-value="handleUpdate"
        />
      </UFormField>

      <UFormField
        label="Page URL *"
        :error="error"
        :class="{ 'error-field': error }"
      >
        <UInput
          v-model="techData.page"
          placeholder="https://app.example.com/..."
          @update:model-value="handleUpdate"
        />
      </UFormField>

      <UFormField
        label="Account *"
        :error="error"
        :class="{ 'error-field': error }"
      >
        <UInput
          v-model="techData.account"
          placeholder="dev.genesis@company.com"
          @update:model-value="handleUpdate"
        />
      </UFormField>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-200 my-6" />

    <!-- Technical Steps -->
    <UFormField
      label="Technical Steps *"
      :error="error"
      :class="{ 'error-field': error }"
    >
      <div class="space-y-6">
        <div
          v-for="(stepGroup, groupIndex) in techData.stepGroups"
          :key="groupIndex"
          class="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <h4 class="font-medium text-gray-900 mb-4">
            {{ groupIndex + 1 }}. {{ objectives[groupIndex] || `Objective ${groupIndex + 1}` }}:
          </h4>
          <div class="space-y-3">
            <div
              v-for="(techStep, stepIndex) in stepGroup.steps"
              :key="stepIndex"
              class="flex items-start gap-3"
            >
              <div
                class="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium"
              >
                {{ stepIndex + 1 }}
              </div>
              <div class="flex-1 flex gap-3">
                <UInput
                  v-model="techStep.fileReference"
                  placeholder="📁 File (optional)"
                  class="w-48 text-sm"
                  @update:model-value="handleUpdate"
                />
                <UInput
                  v-model="techStep.step"
                  :placeholder="`Technical step ${stepIndex + 1} for ${objectives[groupIndex] || `Objective ${groupIndex + 1}`}...`"
                  class="flex-1"
                  @update:model-value="handleUpdate"
                  @keydown.enter="handleTechStepEnter($event, groupIndex, stepIndex)"
                  @keydown.backspace="handleTechStepBackspace($event, groupIndex, stepIndex)"
                />
              </div>
              <UButton
                v-if="stepGroup.steps.length > 1"
                variant="outline"
                color="error"
                size="sm"
                @click="removeTechStep(groupIndex, stepIndex)"
              >
                <UIcon name="i-heroicons-trash" class="w-4 h-4" />
              </UButton>
            </div>
          </div>
          <UButton
            variant="outline"
            color="primary"
            size="sm"
            class="mt-3"
            @click="addTechStep(groupIndex)"
          >
            <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
            Add Technical Step
          </UButton>
        </div>
      </div>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
interface TechStep {
  step: string
  fileReference?: string
}

interface StepGroup {
  steps: TechStep[]
}

interface TechData {
  figma?: string
  epicBranch?: string
  repository: string
  page: string
  account: string
  stepGroups: StepGroup[]
}

interface Props {
  modelValue: TechData
  objectives: string[]
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: TechData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const techData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleUpdate = () => {
  emit('update:modelValue', techData.value)
}

// Technical step management methods
const addTechStep = (groupIndex: number) => {
  techData.value.stepGroups[groupIndex].steps.push({
    step: '',
    fileReference: ''
  })
  handleUpdate()
}

const removeTechStep = (groupIndex: number, stepIndex: number) => {
  if (techData.value.stepGroups[groupIndex].steps.length > 1) {
    techData.value.stepGroups[groupIndex].steps.splice(stepIndex, 1)
    handleUpdate()
  }
}

// Technical step keyboard handlers
const handleTechStepEnter = (event: KeyboardEvent, groupIndex: number, stepIndex: number) => {
  event.preventDefault()
  addTechStep(groupIndex)
  // Focus the next input after a short delay
  setTimeout(() => {
    const inputs = document.querySelectorAll(`input[placeholder^="Technical step"]`) as NodeListOf<HTMLInputElement>
    const newInputIndex = stepIndex + 1
    if (inputs[newInputIndex]) {
      inputs[newInputIndex].focus()
    }
  }, 100)
}

const handleTechStepBackspace = (event: KeyboardEvent, groupIndex: number, stepIndex: number) => {
  const input = event.target as HTMLInputElement
  if (input.value === '' && techData.value.stepGroups[groupIndex].steps.length > 1) {
    event.preventDefault()
    removeTechStep(groupIndex, stepIndex)
    // Focus the previous input after removal
    setTimeout(() => {
      const inputs = document.querySelectorAll(`input[placeholder^="Technical step"]`) as NodeListOf<HTMLInputElement>
      const prevInputIndex = stepIndex - 1
      if (inputs[prevInputIndex]) {
        inputs[prevInputIndex].focus()
      }
    }, 100)
  }
}
</script>