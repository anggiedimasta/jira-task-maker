<template>
  <div class="form-wizard">
    <div class="flex gap-6 min-h-screen">
      <!-- Left Section - Notes (Collapsible) -->
      <div
        class="transition-all duration-300 ease-in-out bg-gray-50 border-r border-gray-200 sticky top-0 h-screen overflow-hidden"
        :class="notesCollapsed ? 'w-0 p-0' : 'w-1/3 p-6'"
      >
        <div v-if="!notesCollapsed" class="h-full">
          <LazyNotesSection
            v-model="form.notes"
            :error="getFieldError('notes')"
          />
        </div>
      </div>

      <!-- Toggle Button for Notes -->
      <UButton
        :class="notesCollapsed ? 'left-0' : 'left-1/3'"
        class="fixed left-0 top-1/2 transform -translate-y-1/2 z-10 transition-all"
        @click="toggleNotes"
        :icon="notesCollapsed ? 'i-heroicons-arrow-right' : 'i-heroicons-arrow-left'"
        size="sm"
        color="primary"
      />

      <!-- Right Section - Form Wizard -->
      <div class="flex-1 p-6">
        <UCard class="w-full h-full overflow-auto">
          <!-- Header -->
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  Jira Task Maker
                </h1>
                <p class="text-gray-600 mt-1">
                  Create well-structured Jira tasks with ease
                </p>
              </div>
              <UBadge
                v-if="step < steps.length"
                :label="`Step ${step + 1} of ${steps.length}`"
                color="primary"
                class="text-gray-500"
              />
            </div>
          </template>

          <!-- Progress Bar -->
          <div v-if="step < steps.length" class="mb-6">
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                class="h-2 rounded-full transition-all duration-300"
                :class="progressBarColor"
                :style="{ width: `${((step + 1) / steps.length) * 100}%` }"
              />
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>{{ steps[step].label }}</span>
              <span>{{ Math.round(((step + 1) / steps.length) * 100) }}%</span>
            </div>
          </div>

          <!-- Form Steps - Lazy loaded components -->
          <div v-if="step < steps.length">
            <div class="space-y-6">
              <!-- Step Content -->
              <div>
                <h3 class="text-lg font-semibold mb-4 text-gray-900">
                  {{ steps[step].label }}
                </h3>

                <!-- Dynamic Form Fields - Lazy loaded -->
                <KeepAlive>
                  <component 
                    :is="currentStepComponent"
                    v-model="currentStepValue"
                    v-bind="currentStepProps"
                  />
                </KeepAlive>

                <p
                  v-if="steps[step].description"
                  class="text-sm text-gray-500 mt-2"
                >
                  {{ steps[step].description }}
                </p>
              </div>
            </div>

            <!-- Navigation -->
            <div class="flex justify-between mt-8">
              <UButton
                v-if="!isFirstStep"
                variant="outline"
                @click="previousStep"
                icon="i-heroicons-arrow-left"
              >
                Back
              </UButton>
              <div v-else />

              <UButton
                :color="isLastStep ? 'green' : 'primary'"
                @click="handleNextStep"
                :loading="isGenerating"
                :icon="isLastStep ? 'i-heroicons-document-text' : 'i-heroicons-arrow-right'"
                :icon-trailing="!isLastStep"
              >
                {{ isLastStep ? 'Generate Jira Task' : 'Next' }}
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePerformance } from '~/composables/usePerformance'

// Performance monitoring
const { markStart, markEnd, measureComponentLoad } = usePerformance()

// Lazy import form phase components for better code splitting
const LazyNotesSection = defineAsyncComponent(() => 
  measureComponentLoad('NotesSection', () => import('~/components/form-phases/NotesSection.vue'))
)

const LazyObjectivePhase = defineAsyncComponent(() => 
  measureComponentLoad('ObjectivePhase', () => import('~/components/form-phases/ObjectivePhase.vue'))
)

const LazyAcceptancePhase = defineAsyncComponent(() => 
  measureComponentLoad('AcceptancePhase', () => import('~/components/form-phases/AcceptancePhase.vue'))
)

const LazyTechnicalPhase = defineAsyncComponent(() => 
  measureComponentLoad('TechnicalPhase', () => import('~/components/form-phases/TechnicalPhase.vue'))
)

const LazyApiPhase = defineAsyncComponent(() => 
  measureComponentLoad('ApiPhase', () => import('~/components/form-phases/ApiPhase.vue'))
)

const LazyUiPhase = defineAsyncComponent(() => 
  measureComponentLoad('UiPhase', () => import('~/components/form-phases/UiPhase.vue'))
)

// Notes sidebar state
const notesCollapsed = ref(false)
const isGenerating = ref(false)

// Use composables
const {
  step,
  form,
  steps,
  progressBarColor,
  isFirstStep,
  isLastStep,
  nextStep,
  previousStep,
  getCurrentStep
} = useFormState()

const {
  getFieldError,
  getUiNameFieldError,
  getUiDesignFieldError,
  validateCurrentStep,
} = useFormValidation()

const { generateMarkdown } = useMarkdownGeneration()

// Optimized computed properties with proper caching
const currentStepComponent = computed(() => {
  const stepKey = steps.value[step.value]?.key
  
  switch (stepKey) {
    case 'objective': return LazyObjectivePhase
    case 'acceptance': return LazyAcceptancePhase
    case 'tech': return LazyTechnicalPhase
    case 'api': return LazyApiPhase
    case 'ui': return LazyUiPhase
    default: return null
  }
})

const currentStepValue = computed({
  get() {
    const stepKey = steps.value[step.value]?.key
    if (!stepKey) return null
    return form.value[stepKey as keyof typeof form.value]
  },
  set(value) {
    const stepKey = steps.value[step.value]?.key
    if (stepKey && value !== null) {
      form.value[stepKey as keyof typeof form.value] = value
    }
  }
})

const currentStepProps = computed(() => {
  const stepKey = steps.value[step.value]?.key
  
  switch (stepKey) {
    case 'acceptance':
      return {
        objectives: form.value.objective,
        error: getFieldError('acceptance')
      }
    case 'tech':
      return {
        objectives: form.value.objective,
        error: getFieldError('tech')
      }
    case 'api':
      return {
        error: getFieldError('api')
      }
    case 'ui':
      return {
        error: getFieldError('ui'),
        'get-name-field-error': getUiNameFieldError,
        'get-design-field-error': getUiDesignFieldError
      }
    default:
      return {
        error: getFieldError(stepKey || '')
      }
  }
})

// Methods
const toggleNotes = () => {
  notesCollapsed.value = !notesCollapsed.value
}

const handleNextStep = async () => {
  const currentKey = getCurrentStep().key

  markStart('validation')
  const isValid = validateCurrentStep(form.value, currentKey)
  markEnd('validation')

  if (isValid) {
    if (isLastStep.value) {
      // Generate markdown and show modal
      isGenerating.value = true
      markStart('markdown-generation')
      
      try {
        const markdown = generateMarkdown(form.value)
        markEnd('markdown-generation')
        
        // Use injection to call parent handler
        const onFormComplete = inject('onFormComplete', () => {})
        onFormComplete(markdown)
      } catch (error) {
        console.error('Error generating markdown:', error)
      } finally {
        isGenerating.value = false
      }
    } else {
      nextStep()
    }
  }
}

// Optimized watchers with debouncing
const debouncedObjectiveWatch = useDebounceFn((newLength: number, oldLength: number) => {
  if (newLength > oldLength) {
    // Objectives were added, add corresponding acceptance criteria
    while (form.value.acceptance.length < newLength) {
      form.value.acceptance.push({
        given: [''],
        when: [''],
        then: ['']
      })
    }
    // Add corresponding technical step groups
    while (form.value.tech.stepGroups.length < newLength) {
      form.value.tech.stepGroups.push({
        steps: [{
          step: '',
          fileReference: ''
        }]
      })
    }
  } else if (newLength < oldLength) {
    // Objectives were removed, remove corresponding items
    while (form.value.acceptance.length > newLength) {
      form.value.acceptance.pop()
    }
    while (form.value.tech.stepGroups.length > newLength) {
      form.value.tech.stepGroups.pop()
    }
  }
}, 300)

// Watch for changes in objectives with debouncing
watch(() => form.value.objective.length, debouncedObjectiveWatch)

// Performance monitoring on mount
onMounted(() => {
  markStart('form-wizard-mount')
  nextTick(() => {
    markEnd('form-wizard-mount')
  })
})
</script>