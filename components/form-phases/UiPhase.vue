<template>
  <div class="space-y-6">
    <div v-if="uiSpecs && uiSpecs.length > 0" class="space-y-8">
              <div
          v-for="(uiSpec, uiIndex) in uiSpecs"
          :key="uiIndex"
          class="border border-gray-200 rounded-lg p-6 bg-gray-50"
        >
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-medium text-gray-900">UI Specification {{ uiIndex + 1 }}</h4>
          <UButton
            v-if="uiSpecs && uiSpecs.length > 1"
            variant="outline"
            color="error"
            size="sm"
            @click="removeUiSpec(uiIndex)"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4" />
          </UButton>
        </div>

        <div class="space-y-4">
          <UFormField
            label="UI Name"
            :error="getNameFieldError?.(uiIndex)"
            :class="{ 'error-field': getNameFieldError?.(uiIndex) }"
          >
            <UInput
              v-model="uiSpec.name"
              placeholder="e.g., Login Form, Dashboard, Profile Page"
              @update:model-value="handleUpdate"
            />
          </UFormField>

          <UFormField
            label="Design"
            :error="getDesignFieldError?.(uiIndex)"
            :class="{ 'error-field': getDesignFieldError?.(uiIndex) }"
          >
            <div class="space-y-2">
              <!-- Design field with embedded image -->
              <div class="border border-gray-300 rounded-md bg-white">
                <div class="p-3 min-h-[80px]">
                  <div v-if="isImageFile(uiSpec.design)" class="mb-3">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-700">Design Image: {{ getImageFileName(uiSpec.design) }}</span>
                      <UButton variant="outline" size="sm" color="error" @click="clearImageWrapper(uiIndex)">
                        <UIcon name="i-heroicons-trash" class="w-4 h-4 mr-1" />
                        Remove Image
                      </UButton>
                    </div>
                    <img
                      :src="getImagePreviewUrl(uiSpec.design)"
                      alt="Design image"
                      class="max-w-full h-auto max-h-32 object-contain rounded border border-gray-200"
                    >
                  </div>
                  <div
                    v-else
                    class="flex items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer"
                    @paste="handleImagePasteWrapper($event, uiIndex)"
                    @click="() => triggerImageUpload(uiIndex)"
                  >
                    <div class="text-center">
                      <UIcon name="i-heroicons-photo" class="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p class="text-sm text-gray-500">Click "Attach Image" or paste an image here</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <UButton variant="outline" size="sm" @click="() => triggerImageUpload(uiIndex)">
                  <UIcon name="i-heroicons-photo" class="w-4 h-4 mr-2" />
                  Attach Image
                </UButton>
                <input
                  :id="`image-input-${uiIndex}`"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageUploadWrapper($event, uiIndex)"
                >
                <span class="text-sm text-gray-500">or paste image directly</span>
              </div>
            </div>
          </UFormField>

          <UFormField label="Note (Optional)">
            <UTextarea
              v-model="uiSpec.note"
              :rows="2"
              placeholder="Additional notes, considerations, or special requirements..."
              @update:model-value="handleUpdate"
            />
          </UFormField>
        </div>
      </div>
    </div>

    <UButton variant="outline" color="primary" @click="addUiSpec">
      <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
      Add UI Specification
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface UiSpec {
  name: string
  design: string | File
  note?: string
}

interface Props {
  modelValue: UiSpec[] | undefined
  error?: string
  getNameFieldError?: (index: number) => string | undefined
  getDesignFieldError?: (index: number) => string | undefined
}

interface Emits {
  (e: 'update:modelValue', value: UiSpec[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const uiSpecs = computed({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value)
})

const handleUpdate = () => {
  emit('update:modelValue', uiSpecs.value)
}

// Image utilities
const {
  handleImagePaste,
  handleImageUpload,
  triggerImageUpload,
  clearImage,
  getImagePreviewUrl,
  getImageFileName,
  isImageFile
} = useImageUtils()

// UI specification management methods
const addUiSpec = () => {
  if (!uiSpecs.value) {
    uiSpecs.value = []
  }
  uiSpecs.value.push({
    name: '',
    design: '',
    note: ''
  })
  handleUpdate()
}

const removeUiSpec = (index: number) => {
  if (uiSpecs.value && uiSpecs.value.length > 1) {
    uiSpecs.value.splice(index, 1)
    handleUpdate()
  }
}

// Wrapper functions to pass the required parameters
const handleImagePasteWrapper = (event: ClipboardEvent, uiIndex: number) => {
  handleImagePaste(event, uiSpecs.value, uiIndex, handleUpdate)
}

const handleImageUploadWrapper = (event: Event, uiIndex: number) => {
  handleImageUpload(event, uiSpecs.value, uiIndex, handleUpdate)
}

const clearImageWrapper = (uiIndex: number) => {
  clearImage(uiSpecs.value, uiIndex, handleUpdate)
}
</script>