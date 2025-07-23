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

          <!-- Preview Example Button -->
          <UButton
            @click="handlePreviewExample"
            icon="i-heroicons-eye"
            color="primary"
          >
            Preview Example
          </UButton>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Form Wizard - Lazy loaded for better performance -->
        <ClientOnly fallback-tag="div" fallback="Loading...">
          <LazyFormWizard />
        </ClientOnly>
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

    <!-- Global Modal - Lazy loaded -->
    <ClientOnly>
      <LazyResultsModal
        :model-value="showModal"
        :markdown="modalMarkdown"
        :copied="copied"
        @update:model-value="showModal = $event"
        @download="handleDownload"
        @copy="handleCopy"
        @reset="handleReset"
        @edit="handleEdit"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// SEO and meta optimizations
useSeoMeta({
  title: 'Jira Task Maker - Professional Task Creation Tool',
  ogTitle: 'Jira Task Maker - Professional Task Creation Tool',
  description: 'Create well-structured Jira tasks with ease using our professional templates and guided workflow.',
  ogDescription: 'Create well-structured Jira tasks with ease using our professional templates and guided workflow.',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})

// Performance optimizations
definePageMeta({
  mode: 'spa' // Client-side rendering for better interactivity
})

// Reactive state
const showModal = ref(false)
const modalMarkdown = ref('')
const copied = ref(false)

// Lazy imports for better code splitting
const LazyFormWizard = defineAsyncComponent(() => import('~/components/FormWizard.vue'))
const LazyResultsModal = defineAsyncComponent(() => import('~/components/form-phases/ResultsModal.vue'))

// Event handlers
const handlePreviewExample = () => {
  // Sample markdown for preview
  modalMarkdown.value = `# Sample Jira Task

## Objective
Create a responsive user authentication system with modern security practices.

## Acceptance Criteria
- [ ] User can login with email and password
- [ ] Password reset functionality via email
- [ ] Session management with JWT tokens
- [ ] Rate limiting for login attempts

## Technical Requirements
- Use Vue 3 with TypeScript
- Implement OAuth 2.0 integration
- Add unit tests with 90% coverage

## API Requirements
\`\`\`json
{
  "endpoint": "/api/auth/login",
  "method": "POST",
  "body": {
    "email": "user@example.com",
    "password": "securePassword"
  }
}
\`\`\`

## UI/UX Requirements
- Mobile-first responsive design
- Loading states and error handling
- Accessibility compliance (WCAG 2.1)
`
  showModal.value = true
}

const handleDownload = () => {
  if (!modalMarkdown.value) return
  
  const blob = new Blob([modalMarkdown.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'jira-task.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const handleCopy = async () => {
  if (!modalMarkdown.value) return
  
  try {
    await navigator.clipboard.writeText(modalMarkdown.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

const handleReset = () => {
  showModal.value = false
  modalMarkdown.value = ''
  // Add reset logic for form wizard if needed
}

const handleEdit = () => {
  showModal.value = false
  // Add edit logic to focus back on form wizard
}

// Listen for form wizard events
const handleFormComplete = (markdown: string) => {
  modalMarkdown.value = markdown
  showModal.value = true
}

// Provide form complete handler to child components
provide('onFormComplete', handleFormComplete)
</script>

<style scoped>
/* Optimized styles using Tailwind utilities */
</style>