import { ref } from 'vue'
import { z } from 'zod'

// Acceptance criteria structure - all fields optional
const acceptanceCriteriaSchema = z.object({
  given: z.array(z.string().min(3, 'Given condition must be at least 3 characters').optional().or(z.literal(''))).optional().or(z.literal([])),
  when: z.array(z.string().min(3, 'When condition must be at least 3 characters').optional().or(z.literal(''))).optional().or(z.literal([])),
  then: z.array(z.string().min(3, 'Then condition must be at least 3 characters').optional().or(z.literal(''))).optional().or(z.literal([]))
})

// Technical step structure
const techStepSchema = z.object({
  step: z.string().min(3, 'Technical step must be at least 3 characters').max(500, 'Technical step must be less than 500 characters').optional().or(z.literal('')),
  fileReference: z.string().max(200, 'File reference must be less than 200 characters').optional().or(z.literal(''))
})

// API contract structure - all fields optional
const apiContractSchema = z.object({
  method: z.string().min(1, 'HTTP method is required').optional().or(z.literal('')),
  requestPayload: z.string().min(1, 'Request payload is required').optional().or(z.literal('')),
  responsePayload: z.string().min(1, 'Response payload is required').optional().or(z.literal(''))
})

// UI specification structure
const uiSpecSchema = z.array(z.object({
  name: z.string().max(200, 'UI name must be less than 200 characters').optional().or(z.literal('')),
  design: z.union([z.string(), z.instanceof(File)]).optional().or(z.literal('')),
  note: z.string().max(300, 'Note must be less than 300 characters').optional().or(z.literal(''))
})).optional()

// API specification structure - all fields optional
const apiSpecSchema = z.array(z.object({
  name: z.string().min(1, 'API name is required').optional().or(z.literal('')),
  endpointUrl: z.string().url('Please enter a valid endpoint URL').min(1, 'Endpoint URL is required').optional().or(z.literal('')),
  contract: apiContractSchema
})).optional()

// Technical step group structure (per objective) - all fields optional
const techStepGroupSchema = z.object({
  steps: z.array(techStepSchema).optional().or(z.literal([]))
})

// Technical specification structure - all fields optional
const techSpecSchema = z.object({
  stepGroups: z.array(techStepGroupSchema).optional().or(z.literal([])),
  figma: z.string().url('Please enter a valid Figma URL').optional().or(z.literal('')),
  epicBranch: z.string().max(200, 'Epic branch must be less than 200 characters').optional().or(z.literal('')),
  repository: z.string().url('Please enter a valid repository URL').optional().or(z.literal('')),
  page: z.string().url('Please enter a valid page URL').optional().or(z.literal('')),
  account: z.string().max(200, 'Account must be less than 200 characters').optional().or(z.literal(''))
})

// Zod Schema for form validation - all fields optional
export const formSchema = z.object({
  objective: z.array(z.string().min(5, 'Objective must be at least 5 characters long').max(500, 'Objective must be less than 500 characters').optional().or(z.literal('')))
    .optional().or(z.literal([])),
  acceptance: z.array(acceptanceCriteriaSchema)
    .optional().or(z.literal([])),
  tech: techSpecSchema,
  api: apiSpecSchema.optional(),
  ui: uiSpecSchema,
  notes: z.string()
    .max(1000, 'Additional notes must be less than 1000 characters')
    .optional()
})

// TypeScript type derived from Zod schema
export type FormState = z.infer<typeof formSchema>

export function useFormValidation() {
  // Store validation errors
  const validationErrors = ref<Record<string, string>>({})
  // Store UI-specific validation errors
  const uiValidationErrors = ref<Record<number, string>>({})
  // Store UI field-specific validation errors
  const uiFieldErrors = ref<Record<number, { name?: string, design?: string }>>({})

  const validateField = (key: keyof FormState, value: string | string[] | Array<{ given: string[], when: string[], then: string[] }> | { stepGroups: Array<{ steps: Array<{ step: string, fileReference?: string }> }>, figma?: string, epicBranch?: string, repository?: string, page?: string, account?: string } | Array<{ name: string, endpointUrl: string, contract: { method: string, requestPayload: string, responsePayload: string } }> | Array<{ name: string, design: string, note?: string }> | undefined) => {
    try {
      // Create a partial schema for the current field
      const fieldSchema = z.object({ [key]: formSchema.shape[key] })
      fieldSchema.parse({ [key]: value })

      // Clear error if validation passes
      validationErrors.value[key] = ''
    } catch (error) {
      if (error instanceof z.ZodError) {
        validationErrors.value[key] = 'Validation failed'
      }
    }
  }

  const getFieldError = (key: keyof FormState): string => {
    return validationErrors.value[key] || ''
  }

  const getUiFieldError = (uiIndex: number): string => {
    return uiValidationErrors.value[uiIndex] || ''
  }

  const getUiNameFieldError = (uiIndex: number): string => {
    return uiFieldErrors.value[uiIndex]?.name || ''
  }

  const getUiDesignFieldError = (uiIndex: number): string => {
    return uiFieldErrors.value[uiIndex]?.design || ''
  }

  const validateCurrentStep = (form: FormState, currentKey: keyof FormState): boolean => {
    // Special handling for UI validation
    if (currentKey === 'ui') {
      const uiSpecs = form[currentKey] as Array<{ name: string, design: string, note?: string }>
      const errors: string[] = []

      if (uiSpecs && uiSpecs.length > 0) {
        uiSpecs.forEach((uiSpec, index) => {
          // Check if name is filled
          const hasName = Boolean(uiSpec.name?.trim())
          // Check if design is filled (must be a File object)
          const hasDesign = Boolean(uiSpec.design && typeof uiSpec.design === 'object' && 'name' in uiSpec.design)

          // If name is filled, design image must also be filled
          if (hasName && !hasDesign) {
            const errorMsg = `Design image is required when UI name is provided for UI specification ${index + 1}`
            errors.push(errorMsg)
          }

          // If design image is filled, name must also be filled
          if (hasDesign && !hasName) {
            const errorMsg = `UI name is required when design image is provided for UI specification ${index + 1}`
            errors.push(errorMsg)
          }
        })
      }

      if (errors.length > 0) {
        // Clear any previous UI-specific errors
        uiValidationErrors.value = {}
        uiFieldErrors.value = {}

        // Set individual errors for each UI spec
        errors.forEach((error) => {
          // Extract the UI spec number from the error message
          const match = error.match(/UI specification (\d+)/)
          if (match) {
            const uiSpecNumber = parseInt(match[1]) - 1 // Convert to 0-based index
            uiValidationErrors.value[uiSpecNumber] = error

            // Set field-specific errors
            if (!uiFieldErrors.value[uiSpecNumber]) {
              uiFieldErrors.value[uiSpecNumber] = {}
            }

            if (error.includes('Design image is required')) {
              uiFieldErrors.value[uiSpecNumber].design = 'Design image is required when UI name is provided'
            } else if (error.includes('UI name is required')) {
              uiFieldErrors.value[uiSpecNumber].name = 'UI name is required when design image is provided'
            }
          }
        })

        // Set a general error for the UI section
        validationErrors.value[currentKey] = 'Please fix the validation errors above'
        return false
      } else {
        validationErrors.value[currentKey] = ''
        uiValidationErrors.value = {}
        uiFieldErrors.value = {}
        return true
      }
    }

    try {
      // Validate only the current field
      const fieldSchema = z.object({ [currentKey]: formSchema.shape[currentKey] })
      fieldSchema.parse({ [currentKey]: form[currentKey] })

      // Clear error if validation passes
      validationErrors.value[currentKey] = ''
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Get specific error message for objectives
        if (currentKey === 'objective') {
          const objectives = form[currentKey] as string[]
          if (objectives.length === 0) {
            // Objectives are optional, so empty array is valid
            validationErrors.value[currentKey] = ''
            return true
          } else if (objectives.some(obj => obj.trim().length > 0 && obj.trim().length < 5)) {
            validationErrors.value[currentKey] = 'Each objective must be at least 5 characters long'
          } else {
            validationErrors.value[currentKey] = ''
            return true
          }
        } else if (currentKey === 'acceptance') {
          // Provide specific error messages for acceptance criteria
          const acceptanceCriteria = form[currentKey] as Array<{ given: string[], when: string[], then: string[] }>
          const errors: string[] = []

          if (acceptanceCriteria.length === 0) {
            // Acceptance criteria are optional, so empty array is valid
            validationErrors.value[currentKey] = ''
            return true
          }

          acceptanceCriteria.forEach((criteria, index) => {
            // Check individual condition lengths (only for filled conditions)
            criteria.given.forEach((given, givenIndex) => {
              if (given.trim().length > 0 && given.trim().length < 3) {
                errors.push(`Given condition ${givenIndex + 1} in criteria ${index + 1} must be at least 3 characters`)
              }
            })
            criteria.when.forEach((when, whenIndex) => {
              if (when.trim().length > 0 && when.trim().length < 3) {
                errors.push(`When condition ${whenIndex + 1} in criteria ${index + 1} must be at least 3 characters`)
              }
            })
            criteria.then.forEach((then, thenIndex) => {
              if (then.trim().length > 0 && then.trim().length < 3) {
                errors.push(`Then condition ${thenIndex + 1} in criteria ${index + 1} must be at least 3 characters`)
              }
            })
          })

          validationErrors.value[currentKey] = errors.length > 0 ? errors[0] : ''
          return errors.length === 0
        } else if (currentKey === 'tech') {
          // Provide specific error messages for technical specification
          const techSpec = form[currentKey] as { repository?: string, page?: string, account?: string, stepGroups: Array<{ steps: Array<{ step: string, fileReference?: string }> }> }
          const errors: string[] = []

          // Check individual step lengths (only for filled steps)
          techSpec.stepGroups.forEach((stepGroup, groupIndex) => {
            stepGroup.steps.forEach((step, stepIndex) => {
              if (step.step.trim().length > 0 && step.step.trim().length < 3) {
                errors.push(`Technical step ${stepIndex + 1} in objective ${groupIndex + 1} must be at least 3 characters`)
              }
            })
          })

          validationErrors.value[currentKey] = errors.length > 0 ? errors[0] : ''
          return errors.length === 0
        } else if (currentKey === 'api') {
          // Provide specific error messages for API specification
          const apiSpecs = form[currentKey] as Array<{ name: string, endpointUrl: string, contract: { method: string, requestPayload: string, responsePayload: string } }>
          const errors: string[] = []

          if (apiSpecs && apiSpecs.length > 0) {
            apiSpecs.forEach((apiSpec, index) => {
              // Check if any field is filled for this API spec
              const hasAnyField = Boolean(
                apiSpec.name?.trim() ||
                apiSpec.endpointUrl?.trim() ||
                apiSpec.contract.method?.trim() ||
                apiSpec.contract.requestPayload?.trim() ||
                apiSpec.contract.responsePayload?.trim()
              )

              if (hasAnyField) {
                // If any field is filled, all fields must be filled
                if (!apiSpec.name?.trim()) {
                  errors.push(`API name is required for API specification ${index + 1}`)
                }
                if (!apiSpec.endpointUrl?.trim()) {
                  errors.push(`Endpoint URL is required for API specification ${index + 1}`)
                }
                if (!apiSpec.contract.method?.trim()) {
                  errors.push(`HTTP method is required for API specification ${index + 1}`)
                }
                if (!apiSpec.contract.requestPayload?.trim()) {
                  errors.push(`Request payload is required for API specification ${index + 1}`)
                }
                if (!apiSpec.contract.responsePayload?.trim()) {
                  errors.push(`Response payload is required for API specification ${index + 1}`)
                }
              }
            })
          }

          validationErrors.value[currentKey] = errors.length > 0 ? errors[0] : ''
          return errors.length === 0
        } else {
          validationErrors.value[currentKey] = ''
          return true
        }
      }
      return false
    }
  }

  const canProceed = (form: FormState, currentKey: keyof FormState): boolean => {
    const fieldValue = form[currentKey]

    if (currentKey === 'objective') {
      // Objectives are optional, so always allow proceeding
      const hasNoError = Boolean(!validationErrors.value[currentKey])
      return hasNoError
    }

    if (currentKey === 'acceptance') {
      // Acceptance criteria are optional, so always allow proceeding
      const hasNoError = Boolean(!validationErrors.value[currentKey])
      return hasNoError
    }

    if (currentKey === 'tech') {
      // Technical specification is optional, so always allow proceeding
      const hasNoError = Boolean(!validationErrors.value[currentKey])
      return hasNoError
    }

    if (currentKey === 'api') {
      const apiSpecs = fieldValue as Array<{ name: string, endpointUrl: string, contract: { method: string, requestPayload: string, responsePayload: string } }>
      // API is optional, so if no specs provided, it's valid
      if (!apiSpecs || apiSpecs.length === 0) {
        return true
      }
      // If specs provided, check that each one is either completely empty or completely filled
      const hasValidSpecs = apiSpecs.every(apiSpec => {
        const hasAnyField = Boolean(
          apiSpec.name?.trim() ||
          apiSpec.endpointUrl?.trim() ||
          apiSpec.contract.method?.trim() ||
          apiSpec.contract.requestPayload?.trim() ||
          apiSpec.contract.responsePayload?.trim()
        )
        if (hasAnyField) {
          return Boolean(
            apiSpec.name?.trim() &&
            apiSpec.endpointUrl?.trim() &&
            apiSpec.contract.method?.trim() &&
            apiSpec.contract.requestPayload?.trim() &&
            apiSpec.contract.responsePayload?.trim()
          )
        }
        return true // Empty spec is valid
      })
      const hasNoError = Boolean(!validationErrors.value[currentKey])
      return hasValidSpecs && hasNoError
    }

    if (currentKey === 'ui') {
      const uiSpecs = fieldValue as Array<{ name: string, design: string, note?: string }>
      // UI is optional, so if no specs provided, it's valid
      if (!uiSpecs || uiSpecs.length === 0) {
        return true
      }
      // Check that each spec is either completely empty or has both name and design filled
      const hasValidSpecs = uiSpecs.every((uiSpec) => {
        const hasName = Boolean(uiSpec.name?.trim())
        const hasDesign = Boolean(uiSpec.design && typeof uiSpec.design === 'object' && 'name' in uiSpec.design)

        // If name is filled, design image must also be filled
        if (hasName && !hasDesign) {
          return false
        }
        // If design image is filled, name must also be filled
        if (hasDesign && !hasName) {
          return false
        }

        return true // Either both required fields are filled or both are empty
      })
      const hasNoError = Boolean(!validationErrors.value[currentKey])
      return hasValidSpecs && hasNoError
    }

    // For any other field, always allow proceeding since all fields are optional
    const hasNoError = Boolean(!validationErrors.value[currentKey])
    return hasNoError
  }

  const clearErrors = () => {
    validationErrors.value = {}
  }

  return {
    validationErrors,
    validateField,
    getFieldError,
    getUiFieldError,
    getUiNameFieldError,
    getUiDesignFieldError,
    validateCurrentStep,
    canProceed,
    clearErrors
  }
}