<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <!-- Header -->
        <div class="modal-header">
          <h3 class="modal-title">Generated Jira Task</h3>
          <button
            class="modal-close-btn"
            @click="() => emit('update:modelValue', false)"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>
        </div>

        <div class="modal-content">
          <!-- Action Buttons -->
          <div class="action-buttons">
            <UButton
              variant="outline"
              @click="handleDownload"
              icon="i-heroicons-arrow-down-tray"
            >
              Download Markdown
            </UButton>

            <UButton
              :color="copied ? 'green' : 'primary'"
              @click="handleCopy"
              :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
            >
              {{ copied ? 'Copied!' : 'Copy to Clipboard' }}
            </UButton>
          </div>

          <!-- Tabs -->
          <div class="tabs-container">
            <div class="tabs-header">
              <UButton
                v-for="tab in tabs"
                :key="tab.label"
                :variant="activeTab === tab.label ? 'solid' : 'ghost'"
                @click="activeTab = tab.label"
                :icon="tab.icon"
                size="sm"
              >
                {{ tab.label }}
              </UButton>
            </div>

            <div class="tab-content">
              <div v-if="activeTab === 'Markdown'" class="markdown-content">
                <UTextarea
                  :value="markdown"
                  readonly
                  class="markdown-textarea"
                  :rows="20"
                  resize
                />
              </div>
              <div v-else-if="activeTab === 'Preview'" class="preview-content">
                <div class="preview-container">
                  <MarkdownPreview :content="markdown" />
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions">
            <UButton
              variant="outline"
              @click="handleReset"
              icon="i-heroicons-arrow-path"
            >
              Start Over
            </UButton>
            <UButton
              color="primary"
              @click="handleEdit"
              icon="i-heroicons-pencil"
            >
              Edit Task
            </UButton>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: boolean
  markdown: string
  copied: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'download' | 'copy' | 'reset' | 'edit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed(() => props.modelValue)
const activeTab = ref('Markdown')

const tabs = [
  { label: 'Markdown', icon: 'i-heroicons-code-bracket' },
  { label: 'Preview', icon: 'i-heroicons-eye' }
]

const handleOverlayClick = () => {
  emit('update:modelValue', false)
}

const handleDownload = () => {
  emit('download')
}

const handleCopy = () => {
  emit('copy')
}

const handleReset = () => {
  emit('reset')
}

const handleEdit = () => {
  emit('edit')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 56rem;
  width: 100%;
  max-height: 90vh;
  margin: 1rem;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.modal-close-btn {
  padding: 0.5rem;
  color: #9ca3af;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  color: #4b5563;
  background-color: #f3f4f6;
}

.modal-content {
  flex: 1;
  padding: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.tabs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.tab-content {
  flex: 1;
  overflow: hidden;
}

.markdown-content,
.preview-content {
  height: 100%;
  overflow: auto;
}

.markdown-textarea {
  width: 100%;
  height: 100%;
  resize: none;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  font-family: monospace;
  font-size: 0.875rem;
}

.preview-container {
  height: 100%;
  overflow: auto;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>