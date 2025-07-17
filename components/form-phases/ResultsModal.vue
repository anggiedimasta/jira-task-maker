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
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-content">
          <!-- Action Buttons -->
          <div class="action-buttons">
            <button
              class="btn btn-outline"
              @click="handleDownload"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Download Markdown
            </button>

            <button
              :class="['btn', copied ? 'btn-success' : 'btn-primary']"
              @click="handleCopy"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="copied" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              {{ copied ? 'Copied!' : 'Copy to Clipboard' }}
            </button>
          </div>

          <!-- Tabs -->
          <div class="tabs-container">
            <div class="tabs-header">
              <button
                v-for="tab in tabs"
                :key="tab.label"
                :class="['tab-btn', { active: activeTab === tab.label }]"
                @click="activeTab = tab.label"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="tab.label === 'Markdown'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ tab.label }}
              </button>
            </div>

            <div class="tab-content">
              <div v-if="activeTab === 'Markdown'" class="markdown-content">
                <textarea
                  :value="markdown"
                  readonly
                  class="markdown-textarea"
                  rows="20"
                />
              </div>
              <div v-else-if="activeTab === 'Preview'" class="preview-content">
                <div class="preview-container">
                  <div class="markdown-preview" v-html="markdownPreview"/>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions">
            <button
              class="btn btn-outline"
              @click="handleReset"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Start Over
            </button>
            <button
              class="btn btn-primary"
              @click="handleEdit"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Edit Task
            </button>
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
  { label: 'Markdown', icon: 'code' },
  { label: 'Preview', icon: 'eye' }
]

const markdownPreview = computed(() => {
  let markdown = props.markdown

  // Convert Jira tables to HTML tables
  const tableRegex = /(\|\|[^|]+\|[^|]*\|[^|]*\|\|[\s\S]*?)(?=\n\n|\n$|$)/g
  markdown = markdown.replace(tableRegex, (match) => {
    const lines = match.trim().split('\n')
    if (lines.length < 2) return match

    const headerLine = lines[0]
    const dataLines = lines.slice(1)

    // Parse header
    const headerMatch = headerLine.match(/\|\|([^|]+)\|\|([^|]*)\|\|([^|]*)\|\|/)
    if (!headerMatch) return match

    let html = '<table><thead><tr>'
    html += `<th>${headerMatch[1].trim()}</th>`
    html += `<th>${headerMatch[2].trim()}</th>`
    html += `<th>${headerMatch[3].trim()}</th>`
    html += '</tr></thead><tbody>'

    // Parse data rows
    dataLines.forEach(line => {
      const dataMatch = line.match(/\|([^|]+)\|([^|]*)\|([^|]*)\|/)
      if (dataMatch) {
        html += '<tr>'
        html += `<td>${dataMatch[1].trim()}</td>`
        html += `<td>${dataMatch[2].trim()}</td>`
        html += `<td>${dataMatch[3].trim()}</td>`
        html += '</tr>'
      }
    })

    html += '</tbody></table>'
    return html
  })

  // Enhanced text to HTML conversion for preview with Jira text formatting support
  const result = markdown
    // Jira headings (process in order from largest to smallest) - use word boundaries to be more specific
    .replace(/^h6\.\s+(.*)$/gim, '<h6>$1</h6>')
    .replace(/^h5\.\s+(.*)$/gim, '<h5>$1</h5>')
    .replace(/^h4\.\s+(.*)$/gim, '<h4>$1</h4>')
    .replace(/^h3\.\s+(.*)$/gim, '<h3>$1</h3>')
    .replace(/^h2\.\s+(.*)$/gim, '<h2>$1</h2>')
    .replace(/^h1\.\s+(.*)$/gim, '<h1>$1</h1>')
    // Jira code blocks (process BEFORE text effects to avoid conflicts)
    .replace(/\{code:(\w+)\}([\s\S]*?)\{code\}/gim, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/\{code\}([\s\S]*?)\{code\}/gim, '<pre><code>$1</code></pre>')
    // Jira quotes
    .replace(/\{quote\}([\s\S]*?)\{quote\}/gim, '<blockquote>$1</blockquote>')
    .replace(/^bq\. (.*$)/gim, '<blockquote>$1</blockquote>')
    // Jira color formatting
    .replace(/\{color:red\}([^}]*)\{color\}/g, '<span style="color: red;">$1</span>')
    .replace(/\{color:([^}]+)\}([^}]*)\{color\}/g, '<span style="color: $1;">$2</span>')
    // Jira text effects (process AFTER code blocks to avoid conflicts)
    .replace(/\*([^*]+)\*/g, '<strong>$1</strong>') // strong
    .replace(/_([^_]+)_/g, '<em>$1</em>') // emphasis
    .replace(/\{\{([^}]+)\}\}/g, '<code>$1</code>') // monospaced
    .replace(/\+\+([^+]+)\+\+/g, '<ins>$1</ins>') // inserted
    // .replace(/(?<!\w)--([^-]+)--(?!\w)/g, '<del>$1</del>') // deleted - commented out to avoid conflicts
    .replace(/\^([^^]+)\^/g, '<sup>$1</sup>') // superscript
    .replace(/~([^~]+)~/g, '<sub>$1</sub>') // subscript
    // Jira lists
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/^# (.*$)/gim, '<li>$1</li>')
    // Jira images
    .replace(/!([^!]+)!/g, '<img src="$1" alt="Image" style="max-width: 100%; height: auto;">')
    .replace(/!([^|]+)\|([^!]+)!/g, '<img src="$1" alt="Image" style="max-width: 100%; height: auto;" $2>')
    // Horizontal dividers
    .replace(/^----$/gm, '<hr style="border: none; border-top: 2px solid #ccc; margin: 20px 0;">')
    // Line breaks
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')

  return result
})

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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

/* Custom Markdown Preview Styles */
.markdown-preview {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 100%;
}

.markdown-preview h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 2rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #3182ce;
}

.markdown-preview h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 1.5rem 0 1rem 0;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid #e2e8f0;
}

.markdown-preview h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4a5568;
  margin: 1.25rem 0 0.75rem 0;
}

.markdown-preview h4, .markdown-preview h5, .markdown-preview h6 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4a5568;
  margin: 1rem 0 0.5rem 0;
}

.markdown-preview p {
  margin: 0.75rem 0;
  line-height: 1.7;
}

.markdown-preview strong {
  font-weight: 600;
  color: #2d3748;
}

.markdown-preview em {
  font-style: italic;
  color: #4a5568;
}

.markdown-preview code {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
  color: #e53e3e;
}

.markdown-preview pre {
  background-color: #2d3748;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.markdown-preview pre code {
  background: none;
  border: none;
  padding: 0;
  color: #e2e8f0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.markdown-preview blockquote {
  border-left: 4px solid #3182ce;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #4a5568;
  font-style: italic;
}

.markdown-preview hr {
  border: none;
  border-top: 2px solid #e2e8f0;
  margin: 2rem 0;
  height: 1px;
}

.markdown-preview table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  line-height: 1.6;
}

.markdown-preview thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.markdown-preview th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  padding: 1rem 1.25rem;
  text-align: left;
  border: none;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
}

.markdown-preview th:first-child {
  border-top-left-radius: 0.75rem;
}

.markdown-preview th:last-child {
  border-top-right-radius: 0.75rem;
}

.markdown-preview td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
  background-color: white;
  transition: background-color 0.2s ease;
}

.markdown-preview tr:last-child td {
  border-bottom: none;
}

.markdown-preview tr:last-child td:first-child {
  border-bottom-left-radius: 0.75rem;
}

.markdown-preview tr:last-child td:last-child {
  border-bottom-right-radius: 0.75rem;
}

.markdown-preview tr:hover {
  background-color: #f8fafc;
}

.markdown-preview tr:hover td {
  background-color: #f8fafc;
}

.markdown-preview tbody tr:nth-child(even) {
  background-color: #fafbfc;
}

.markdown-preview tbody tr:nth-child(even):hover {
  background-color: #f1f5f9;
}

.markdown-preview tbody tr:nth-child(even):hover td {
  background-color: #f1f5f9;
}

/* Code blocks inside table cells */
.markdown-preview td pre {
  background-color: #1f2937;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
  overflow-x: auto;
  border: 1px solid #374151;
}

.markdown-preview td pre code {
  background: none;
  border: none;
  padding: 0;
  color: #e5e7eb;
  font-size: 0.8rem;
  line-height: 1.4;
}

/* Inline code inside table cells */
.markdown-preview td code {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.8rem;
  color: #dc2626;
}

/* Strong text inside table cells */
.markdown-preview td strong {
  font-weight: 600;
  color: #1f2937;
}

/* Emphasized text inside table cells */
.markdown-preview td em {
  font-style: italic;
  color: #6b7280;
}

/* Color spans inside table cells */
.markdown-preview td span[style*="color: red"] {
  background-color: #fef2f2;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #fecaca;
  font-weight: 600;
  display: inline-block;
  margin: 0.25rem 0;
}

.markdown-preview td span[style*="color: red"]:before {
  content: "⚠️ ";
  margin-right: 0.25rem;
}

.markdown-preview li {
  margin: 0.25rem 0;
  line-height: 1.6;
}

.markdown-preview ol, .markdown-preview ul {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.markdown-preview ol {
  list-style-type: decimal;
}

.markdown-preview ul {
  list-style-type: disc;
}

/* Special styling for Jira-specific elements */
.markdown-preview span[style*="color: red"] {
  background-color: #fed7d7;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #feb2b2;
  font-weight: 600;
}

.markdown-preview span[style*="color: red"]:before {
  content: "⚠️ ";
  margin-right: 0.25rem;
}

/* Code block language indicators */
.markdown-preview pre[class*="language-"] {
  position: relative;
}

.markdown-preview pre[class*="language-"]:before {
  content: attr(class);
  position: absolute;
  top: 0;
  right: 0;
  background-color: #4a5568;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0 0.5rem 0 0.25rem;
  text-transform: uppercase;
  font-weight: 600;
}

/* Gherkin code blocks */
.markdown-preview pre code.language-gherkin {
  color: #68d391;
}

.markdown-preview pre code.language-gherkin .keyword {
  color: #f6ad55;
  font-weight: 600;
}

/* JSON code blocks */
.markdown-preview pre code.language-json {
  color: #90cdf4;
}

/* Responsive design */
@media (max-width: 768px) {
  .markdown-preview {
    font-size: 0.875rem;
  }

  .markdown-preview h1 {
    font-size: 1.5rem;
  }

  .markdown-preview h2 {
    font-size: 1.25rem;
  }

  .markdown-preview table {
    font-size: 0.75rem;
  }

  .markdown-preview th,
  .markdown-preview td {
    padding: 0.5rem;
  }
}

.modal-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 64rem;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
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
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-primary:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

.btn-success {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-success:hover {
  background-color: #059669;
  border-color: #059669;
}

.btn-outline {
  background-color: transparent;
  color: #6b7280;
  border-color: #d1d5db;
}

.btn-outline:hover {
  background-color: #f9fafb;
  color: #374151;
  border-color: #9ca3af;
}

.tabs-container {
  margin-bottom: 1.5rem;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #374151;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-content {
  min-height: 400px;
}

.markdown-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  background-color: #f9fafb;
}

.markdown-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.preview-container {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 1rem;
  background-color: #f9fafb;
  max-height: 400px;
  overflow-y: auto;
}

.prose {
  color: #374151;
  line-height: 1.6;
}

.prose h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 2rem;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.25rem;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 1.25rem;
  color: #4b5563;
}

.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

.prose li {
  margin-bottom: 0.25rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>