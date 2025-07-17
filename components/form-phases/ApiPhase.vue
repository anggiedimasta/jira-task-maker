<template>
  <div class="space-y-6">
    <div v-if="apiSpecs && apiSpecs.length > 0" class="space-y-8">
      <div
        v-for="(apiSpec, apiIndex) in apiSpecs"
        :key="apiIndex"
        class="border border-gray-200 rounded-lg p-6 bg-gray-50"
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-medium text-gray-900">API Specification {{ apiIndex + 1 }}</h4>
          <UButton
            v-if="apiSpecs && apiSpecs.length > 1"
            variant="outline"
            color="error"
            size="sm"
            @click="removeApiSpec(apiIndex)"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4" />
          </UButton>
        </div>

        <div class="space-y-4">
          <UFormField
            label="API Name"
            :error="error"
            :class="{ 'error-field': error }"
          >
            <UInput
              v-model="apiSpec.name"
              placeholder="e.g., User Authentication API"
              @update:model-value="handleUpdate"
            />
          </UFormField>

          <UFormField
            label="Endpoint URL"
            :error="error"
            :class="{ 'error-field': error }"
          >
            <UInput
              v-model="apiSpec.endpointUrl"
              placeholder="https://api.example.com/auth"
              @update:model-value="handleUpdate"
            />
          </UFormField>

          <div class="border border-gray-200 rounded-lg p-4 bg-white">
            <h5 class="font-medium text-gray-900 mb-4">API Contract</h5>

            <div class="space-y-4">
              <UFormField
                label="HTTP Method"
                :error="error"
                :class="{ 'error-field': error }"
              >
                <select
                  v-model="apiSpec.contract.method"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  @change="handleUpdate"
                >
                  <option value="">Select HTTP method</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                  <option value="HEAD">HEAD</option>
                  <option value="OPTIONS">OPTIONS</option>
                </select>
              </UFormField>

              <UFormField
                label="Request Payload (JSON)"
                :error="error"
                :class="{ 'error-field': error }"
              >
                <UTextarea
                  :value="apiSpec.contract.requestPayload"
                  :rows="4"
                  placeholder='{\n  "email": "string",\n  "password": "string"\n}'
                  class="font-mono text-sm"
                  @input="handleJsonInputWrapper($event, apiIndex, 'requestPayload')"
                />
              </UFormField>

              <UFormField
                label="Response Payload (JSON)"
                :error="error"
                :class="{ 'error-field': error }"
              >
                <UTextarea
                  :value="apiSpec.contract.responsePayload"
                  :rows="4"
                  placeholder='{\n  "token": "string",\n  "user": {\n    "id": "string",\n    "email": "string"\n  }\n}'
                  class="font-mono text-sm"
                  @input="handleJsonInputWrapper($event, apiIndex, 'responsePayload')"
                />
              </UFormField>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UButton variant="outline" color="primary" @click="addApiSpec">
      <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
      Add API Specification
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface ApiContract {
  method: string
  requestPayload: string
  responsePayload: string
}

interface ApiSpec {
  name: string
  endpointUrl: string
  contract: ApiContract
}

interface Props {
  modelValue: ApiSpec[] | undefined
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: ApiSpec[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const apiSpecs = computed({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value)
})

const handleUpdate = () => {
  emit('update:modelValue', apiSpecs.value)
}

// API specification management methods
const addApiSpec = () => {
  if (!apiSpecs.value) {
    apiSpecs.value = []
  }
  apiSpecs.value.push({
    name: '',
    endpointUrl: '',
    contract: {
      method: '',
      requestPayload: '',
      responsePayload: ''
    }
  })
  handleUpdate()
}

const removeApiSpec = (index: number) => {
  if (apiSpecs.value && apiSpecs.value.length > 1) {
    apiSpecs.value.splice(index, 1)
    handleUpdate()
  }
}

// JSON utilities
const { handleJsonInput } = useJsonUtils()

// Wrapper function to pass the required parameters
const handleJsonInputWrapper = (event: Event, apiIndex: number, field: 'requestPayload' | 'responsePayload') => {
  handleJsonInput(event, apiSpecs.value, apiIndex, field, handleUpdate)
}
</script>