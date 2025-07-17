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
    objective: [
      'Implement user authentication system with login and registration functionality',
      'Create dashboard interface with user profile management and settings'
    ],
    acceptance: [
      {
        given: [
          'User is on the login page',
          'User has valid credentials'
        ],
        when: [
          'User enters email and password',
          'User clicks the login button'
        ],
        then: [
          'User should be redirected to dashboard',
          'User session should be created and stored'
        ]
      },
      {
        given: [
          'User is logged in and on dashboard',
          'User profile data is available'
        ],
        when: [
          'User clicks on profile settings',
          'User updates their profile information'
        ],
        then: [
          'Profile changes should be saved successfully',
          'Updated information should be displayed immediately'
        ]
      }
    ],
    tech: {
      stepGroups: [
        {
          steps: [
            {
              step: 'Set up JWT authentication middleware',
              fileReference: 'src/middleware/auth.ts'
            },
            {
              step: 'Implement bcrypt password hashing',
              fileReference: 'src/utils/password.ts'
            },
            {
              step: 'Create login and register API endpoints',
              fileReference: 'src/routes/auth.ts'
            }
          ]
        },
        {
          steps: [
            {
              step: 'Create dashboard layout component',
              fileReference: 'src/components/Dashboard.vue'
            },
            {
              step: 'Implement user profile management',
              fileReference: 'src/components/Profile.vue'
            },
            {
              step: 'Add settings configuration',
              fileReference: 'src/components/Settings.vue'
            }
          ]
        }
      ],
      figma: 'https://www.figma.com/file/example/auth-system-design',
      epicBranch: '',
      repository: 'https://github.com/company/auth-system',
      page: 'https://app.example.com/auth',
      account: 'dev.genesis@company.com'
    },
    api: [
      {
        name: 'User Authentication API',
        endpointUrl: 'https://api.example.com/auth',
        contract: {
          method: 'POST',
          requestPayload: '{\n  "email": "string",\n  "password": "string"\n}',
          responsePayload: '{\n  "token": "string",\n  "user": {\n    "id": "string",\n    "email": "string",\n    "name": "string"\n  }\n}'
        }
      }
    ],
    ui: [
      {
        name: 'Login Form',
        design: '',
        note: 'Include remember me checkbox and forgot password link'
      },
      {
        name: 'Dashboard',
        design: '',
        note: 'Responsive design for mobile devices'
      }
    ],
    notes: '• Consider implementing 2FA for enhanced security\n• Add password reset functionality\n• Include user activity logging\n• Plan for scalability with user growth\n• Test with various browsers and devices'
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