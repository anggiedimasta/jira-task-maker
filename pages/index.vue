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
          <button
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            @click="handlePreviewExample"
          >
            <UIcon name="i-heroicons-eye" class="w-4 h-4 mr-2" />
            Preview Example
          </button>
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

const { showModal, modalMarkdown, modalCopied, closeModal, setModalCopied, openModal } = useModalState()
const { downloadMarkdown, generateMarkdown } = useMarkdownGeneration()
const { copyToClipboard } = useClipboardUtils()

// Mock data for preview example
const generateMockData = () => {
  return {
    objective: [
      'Implement user authentication system with JWT tokens',
      'Create user profile management functionality',
      'Add role-based access control (RBAC)'
    ],
    acceptance: [
      {
        given: [
          'User is not authenticated',
          'User has valid credentials'
        ],
        when: [
          'User submits login form',
          'System validates credentials'
        ],
        then: [
          'System returns JWT token',
          'User is redirected to dashboard',
          'Session is maintained for 24 hours'
        ]
      },
      {
        given: [
          'User is authenticated',
          'User profile page exists'
        ],
        when: [
          'User navigates to profile page',
          'User updates profile information'
        ],
        then: [
          'Profile information is displayed',
          'Changes are saved to database',
          'Success message is shown'
        ]
      },
      {
        given: [
          'User has admin role',
          'RBAC system is configured'
        ],
        when: [
          'User accesses admin panel',
          'User assigns roles to other users'
        ],
        then: [
          'Admin panel is accessible',
          'Role assignments are saved',
          'Audit log is updated'
        ]
      }
    ],
    tech: {
      stepGroups: [
        {
          steps: [
            {
              step: 'Set up JWT authentication middleware',
              fileReference: 'middleware/auth.js'
            },
            {
              step: 'Create login API endpoint',
              fileReference: 'api/auth/login.js'
            },
            {
              step: 'Implement token validation',
              fileReference: 'utils/jwt.js'
            }
          ]
        },
        {
          steps: [
            {
              step: 'Create user profile component',
              fileReference: 'components/UserProfile.vue'
            },
            {
              step: 'Implement profile update API',
              fileReference: 'api/users/profile.js'
            },
            {
              step: 'Add form validation',
              fileReference: 'utils/validation.js'
            }
          ]
        },
        {
          steps: [
            {
              step: 'Design RBAC database schema',
              fileReference: 'migrations/rbac_schema.sql'
            },
            {
              step: 'Create role management API',
              fileReference: 'api/admin/roles.js'
            },
            {
              step: 'Implement permission checking',
              fileReference: 'utils/permissions.js'
            }
          ]
        }
      ],
      figma: 'https://www.figma.com/file/example/auth-system-design',
      epicBranch: 'feature/user-authentication-system',
      repository: 'https://github.com/company/auth-system',
      page: '/auth',
      account: 'admin@company.com'
    },
    api: [
      {
        name: 'Login API',
        endpointUrl: '/api/auth/login',
        contract: {
          method: 'POST',
          requestPayload: '{\n  "email": "user@example.com",\n  "password": "securepassword"\n}',
          responsePayload: '{\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "user": {\n    "id": 1,\n    "email": "user@example.com",\n    "role": "user"\n  }\n}'
        }
      },
      {
        name: 'Update Profile API',
        endpointUrl: '/api/users/profile',
        contract: {
          method: 'PUT',
          requestPayload: '{\n  "name": "John Doe",\n  "avatar": "data:image/jpeg;base64,...",\n  "bio": "Software developer"\n}',
          responsePayload: '{\n  "success": true,\n  "user": {\n    "id": 1,\n    "name": "John Doe",\n    "avatar": "https://example.com/avatars/1.jpg",\n    "bio": "Software developer"\n  }\n}'
        }
      }
    ],
    ui: [
      {
        name: 'Login Form',
        design: '⚠️ ATTACH IMAGE: login-form-mockup.png (156.7 KB) - Please attach the binary image file "login-form-mockup.png" to this Jira issue',
        note: 'Responsive design with dark mode support'
      },
      {
        name: 'User Profile Page',
        design: '⚠️ ATTACH IMAGE: profile-page-mockup.png (203.4 KB) - Please attach the binary image file "profile-page-mockup.png" to this Jira issue',
        note: 'Include avatar upload functionality'
      },
      {
        name: 'Admin Panel',
        design: '⚠️ ATTACH IMAGE: admin-panel-mockup.png (189.2 KB) - Please attach the binary image file "admin-panel-mockup.png" to this Jira issue',
        note: 'Role management interface with drag-and-drop'
      }
    ],
    notes: 'This task is part of the larger authentication system overhaul. Dependencies include:\n\n- Database migration for user roles\n- Frontend routing updates\n- Security audit completion\n- Performance testing for JWT token validation\n\nTesting requirements:\n- Unit tests for all API endpoints\n- Integration tests for authentication flow\n- E2E tests for user journey\n- Security penetration testing'
  }
}

const handlePreviewExample = () => {
  const mockData = generateMockData()
  const mockMarkdown = generateMarkdown(mockData)
  openModal(mockMarkdown)
}

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