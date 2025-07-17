import { ref, computed, readonly } from 'vue'
import type { FormState } from './useFormValidation'

export interface FormStep {
  label: string
  key: keyof FormState
  description: string
}

export function useFormState() {
  const step = ref(0)
  const copied = ref(false)

  const form = ref<FormState>({
    objective: [''],
    acceptance: [{
      given: [''],
      when: [''],
      then: ['']
    }],
    tech: {
      stepGroups: [
        {
          steps: [
            {
              step: '',
              fileReference: ''
            }
          ]
        }
      ],
      figma: '',
      epicBranch: '',
      repository: '',
      page: '',
      account: ''
    },
    api: [{
      name: '',
      endpointUrl: '',
      contract: {
        method: '',
        requestPayload: '',
        responsePayload: ''
      }
    }],
    ui: [{
      name: '',
      design: '',
      note: ''
    }],
    notes: ''
  })

  const steps: FormStep[] = [
    {
      label: 'Objective',
      key: 'objective',
      description: 'Describe what needs to be accomplished'
    },
    {
      label: 'Acceptance Criteria',
      key: 'acceptance',
      description: 'Define the acceptance criteria using Given-When-Then format'
    },
    {
      label: 'Technical Specification',
      key: 'tech',
      description: 'Provide technical details, architecture, and implementation approach'
    },
    {
      label: 'API Specification',
      key: 'api',
      description: 'Define API endpoints, request/response formats (optional)'
    },
    {
      label: 'UI Specification',
      key: 'ui',
      description: 'Describe UI/UX requirements, mockups, or design notes (optional)'
    }
  ]

  const progressBarColor = computed(() => {
    const progress = ((step.value + 1) / steps.length) * 100
    if (progress < 33) return 'bg-red-500'
    if (progress < 66) return 'bg-yellow-500'
    return 'bg-green-500'
  })

  const progressPercentage = computed(() => {
    return Math.round(((step.value + 1) / steps.length) * 100)
  })

  const isFirstStep = computed(() => step.value === 0)
  const isLastStep = computed(() => step.value === steps.length - 1)
  const isCompleted = computed(() => step.value >= steps.length)

  const nextStep = () => {
    if (step.value < steps.length - 1) {
      step.value++
    }
  }

  const previousStep = () => {
    if (step.value > 0) {
      step.value--
    }
  }

  const reset = () => {
    step.value = 0
    form.value = {
      objective: [''],
      acceptance: [{
        given: [''],
        when: [''],
        then: ['']
      }],
      tech: {
        stepGroups: [{
          steps: [{
            step: '',
            fileReference: ''
          }]
        }],
        figma: '',
        epicBranch: '',
        repository: '',
        page: '',
        account: ''
      },
      api: [{
        name: '',
        endpointUrl: '',
        contract: {
          method: '',
          requestPayload: '',
          responsePayload: ''
        }
      }],
      ui: [{
        name: '',
        design: '',
        note: ''
      }],
      notes: ''
    }
    copied.value = false
  }

  const editTask = () => {
    step.value = 0
  }

  const setCopied = (value: boolean) => {
    copied.value = value
  }

  const getCurrentStep = () => steps[step.value]

  return {
    // State
    step: readonly(step),
    form,
    copied: readonly(copied),
    steps,

    // Computed
    progressBarColor,
    progressPercentage,
    isFirstStep,
    isLastStep,
    isCompleted,

    // Methods
    nextStep,
    previousStep,
    reset,
    editTask,
    setCopied,
    getCurrentStep
  }
}