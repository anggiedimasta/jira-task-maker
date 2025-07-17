<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Jira Task Maker</h1>
              <p class="text-gray-600">Create professional Jira tasks with structured templates</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Form Wizard -->
        <FormWizard />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 Jira Task Maker. Built with Nuxt 3 and Vue 3.</p>
          <p class="mt-2 text-sm">
            Streamline your Jira task creation process with structured templates and professional formatting.
          </p>
        </div>
      </div>
    </footer>

    <!-- Global Modal -->
    <ResultsModal
      :model-value="showModal"
      :markdown="modalMarkdown"
      :copied="modalCopied"
      @update:model-value="(value) => showModal = value"
      @download="handleDownload"
      @copy="handleCopy"
      @reset="handleReset"
      @edit="handleEdit"
    />
  </div>
</template>

<script setup lang="ts">

import FormWizard from '~/components/FormWizard.vue'
import ResultsModal from '~/components/form-phases/ResultsModal.vue'
import { useModalState } from '~/composables/useModalState'
import { useMarkdownGeneration } from '~/composables/useMarkdownGeneration'
import { useClipboardUtils } from '~/composables/useClipboardUtils'

const { showModal, modalMarkdown, modalCopied, closeModal, setModalCopied } = useModalState()
const { downloadMarkdown } = useMarkdownGeneration()
const { copyToClipboard } = useClipboardUtils()



const handleDownload = () => {
  const { add } = useToast()
  downloadMarkdown(modalMarkdown.value)
  add({
    title: 'Download Started',
    description: 'Markdown file download initiated',
    color: 'success'
  })
}



const handleCopy = async () => {
  const { add } = useToast()

  // Check if markdown contains file references
  const hasImages = modalMarkdown.value.includes('ATTACH IMAGE:')
  const imageCount = (modalMarkdown.value.match(/ATTACH IMAGE:/g) || []).length

  console.log('Copying markdown with file references:', {
    hasImages,
    imageCount,
    markdownLength: modalMarkdown.value.length,
    containsFileReferences: modalMarkdown.value.includes('ATTACH IMAGE:')
  })

  const success = await copyToClipboard(modalMarkdown.value)
  if (success) {
    setModalCopied(true)
    const message = hasImages
      ? `Markdown copied to clipboard with ${imageCount} file reference${imageCount > 1 ? 's' : ''}!`
      : 'Markdown copied to clipboard!'
    add({
      title: 'Success',
      description: message,
      color: 'success'
    })
    setTimeout(() => setModalCopied(false), 3000)
  } else {
    add({
      title: 'Error',
      description: 'Failed to copy to clipboard',
      color: 'error'
    })
  }
}

const handleReset = () => {
  closeModal()
  // Reset form logic will be handled by FormWizard
}

const handleEdit = () => {
  closeModal()
  // Edit logic will be handled by FormWizard
}
</script>