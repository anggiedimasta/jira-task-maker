<template>
  <div class="form-wizard">
    <div class="flex gap-6 min-h-screen">
      <!-- Left Section - Notes -->
      <div
        class="w-1/3 bg-gray-50 p-6 border-r border-gray-200 sticky top-0 h-screen overflow-hidden"
      >
        <NotesSection
          v-model="form.notes"
          :error="getFieldError('notes')"
        />
      </div>

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

          <!-- Form Steps -->
          <div v-if="step < steps.length">
            <div class="space-y-6">
              <!-- Step Content -->
              <div>
                <h3 class="text-lg font-semibold mb-4 text-gray-900">
                  {{ steps[step].label }}
                </h3>

                <!-- Dynamic Form Fields -->
                <div v-if="steps[step].key === 'objective'" class="space-y-4">
                  <ObjectivePhase
                    v-model="form.objective"
                    :error="getFieldError('objective')"
                  />
                </div>

                <div
                  v-else-if="steps[step].key === 'acceptance'"
                  class="space-y-6"
                >
                  <AcceptancePhase
                    v-model="form.acceptance"
                    :objectives="form.objective"
                    :error="getFieldError('acceptance')"
                  />
                </div>

                <div v-else-if="steps[step].key === 'tech'" class="space-y-6">
                  <TechnicalPhase
                    v-model="form.tech"
                    :objectives="form.objective"
                    :error="getFieldError('tech')"
                  />
                </div>

                <div v-else-if="steps[step].key === 'api'" class="space-y-6">
                  <ApiPhase
                    v-model="form.api"
                    :error="getFieldError('api')"
                  />
                </div>

                <div v-else-if="steps[step].key === 'ui'" class="space-y-6">
                  <UiPhase
                    v-model="form.ui"
                    :error="getFieldError('ui')"
                    :get-name-field-error="getUiNameFieldError"
                    :get-design-field-error="getUiDesignFieldError"
                  />
                </div>

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
                class="text-gray-500"
                @click="previousStep"
              >
                <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
                Back
              </UButton>
              <div v-else />

              <UButton
                :color="isLastStep ? 'success' : 'primary'"
                class="navy-primary text-gray-500"
                @click="handleNextStep"
              >
                <template v-if="isLastStep">
                  <UIcon
                    name="i-heroicons-document-text"
                    class="w-4 h-4 mr-2"
                  />
                  <span>Generate Jira Task</span>
                </template>
                <template v-else>
                  <span>Next</span>
                  <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
                </template>
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, watch } from 'vue'
import { useFormState } from '~/composables/useFormState'
import { useFormValidation } from '~/composables/useFormValidation'
import { useMarkdownGeneration } from '~/composables/useMarkdownGeneration'
import { useModalState } from '~/composables/useModalState'

// Import form phase components
import ObjectivePhase from '~/components/form-phases/ObjectivePhase.vue'
import AcceptancePhase from '~/components/form-phases/AcceptancePhase.vue'
import TechnicalPhase from '~/components/form-phases/TechnicalPhase.vue'
import ApiPhase from '~/components/form-phases/ApiPhase.vue'
import UiPhase from '~/components/form-phases/UiPhase.vue'
import NotesSection from '~/components/form-phases/NotesSection.vue'

// Modal state
const { openModal } = useModalState()

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
  setCopied,
  getCurrentStep
} = useFormState()

const {
  validateField,
  getFieldError,
  getUiNameFieldError,
  getUiDesignFieldError,
  validateCurrentStep,
} = useFormValidation()

const {
  generateMarkdown
} = useMarkdownGeneration()
const { copyToClipboard } = useClipboardUtils()

const markdown = computed(() => {
  return generateMarkdown(form.value)
})

// Methods
const handleNextStep = () => {
  const currentKey = getCurrentStep().key

  const isValid = validateCurrentStep(form.value, currentKey)

  if (isValid) {
    if (isLastStep.value) {
      // Show modal instead of proceeding
      openModal(markdown.value)
      // Auto copy to clipboard
      handleCopy()
    } else {
      nextStep()
    }
  } else {
    const errorMessage = getFieldError(currentKey) || 'Please check your input and try again.'
    const { add } = useToast()
    add({
      title: 'Validation Error',
      description: errorMessage,
      color: 'error'
    })
  }
}

const handleCopy = async () => {
  const { add } = useToast()
  const success = await copyToClipboard(markdown.value)
  if (success) {
    setCopied(true)
    add({
      title: 'Success',
      description: 'Markdown copied to clipboard!',
      color: 'success'
    })
    setTimeout(() => setCopied(false), 3000)
  } else {
    add({
      title: 'Error',
      description: 'Failed to copy to clipboard',
      color: 'error'
    })
  }
}



// Watch for changes in objectives and sync acceptance criteria and technical steps
watch(() => form.value.objective.length, (newLength, oldLength) => {
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
    // Objectives were removed, remove corresponding acceptance criteria
    while (form.value.acceptance.length > newLength) {
      form.value.acceptance.pop()
    }
    // Remove corresponding technical step groups
    while (form.value.tech.stepGroups.length > newLength) {
      form.value.tech.stepGroups.pop()
    }
  }
})

// Watch for changes in UI specifications and validate
watch(() => form.value.ui, () => {
  validateField('ui', form.value.ui)
}, { deep: true })
</script>