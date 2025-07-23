<template>
  <div class="markdown-preview" v-html="processedContent"></div>
</template>

<script setup lang="ts">
interface Props {
  content: string
}

const props = defineProps<Props>()

// Use a computed property for efficient reactive markdown processing
const processedContent = computed(() => {
  if (!props.content) return ''
  
  return processMarkdown(props.content)
})

// Optimized markdown processing function
function processMarkdown(markdown: string): string {
  // Enhanced text to HTML conversion for preview with standard markdown support
  return markdown
    // Standard markdown headings (process in order from largest to smallest)
    .replace(/^###\s+(.*)$/gim, '<h3>$1</h3>')
    .replace(/^##\s+(.*)$/gim, '<h2>$1</h2>')
    .replace(/^#\s+(.*)$/gim, '<h1>$1</h1>')
    // Standard markdown code blocks (process BEFORE text effects to avoid conflicts)
    .replace(/```(\w+)\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/```\n([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    // Standard markdown text effects (process AFTER code blocks to avoid conflicts)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/\*([^*]+)\*/g, '<em>$1</em>') // italic
    .replace(/`([^`]+)`/g, '<code>$1</code>') // inline code
    // Standard markdown lists
    .replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>') // ordered lists
    .replace(/^\*\s+(.*$)/gim, '<li>$1</li>') // unordered lists
    .replace(/^-\s+(.*$)/gim, '<li>$1</li>') // unordered lists
    // Horizontal dividers
    .replace(/^---$/gm, '<hr style="border: none; border-top: 2px solid #ccc; margin: 20px 0;">')
    // Collapsible details (HTML details/summary)
    .replace(/<details>\n<summary>([^<]+)<\/summary>\n\n([\s\S]*?)<\/details>/gim, '<details><summary>$1</summary><div style="margin-top: 1rem; padding-left: 1rem; border-left: 3px solid #e5e7eb;">$2</div></details>')
    // Line breaks
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
}
</script>

<style scoped>
.markdown-preview {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #374151;
  max-width: 100%;
}

.markdown-preview :deep(h1) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 2rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3b82f6;
}

.markdown-preview :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 1.5rem 0 0.75rem 0;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.markdown-preview :deep(h3) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 1.25rem 0 0.75rem 0;
}

.markdown-preview :deep(h4),
.markdown-preview :deep(h5),
.markdown-preview :deep(h6) {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 1rem 0 0.5rem 0;
}

.markdown-preview :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.75;
}

.markdown-preview :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}

.markdown-preview :deep(em) {
  font-style: italic;
  color: #4b5563;
}

.markdown-preview :deep(code) {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.875rem;
  color: #dc2626;
}

.markdown-preview :deep(pre) {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.markdown-preview :deep(pre code) {
  background: transparent;
  border: 0;
  padding: 0;
  color: #e5e7eb;
  font-size: 0.875rem;
  line-height: 1.5;
}

.markdown-preview :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #4b5563;
  font-style: italic;
}

.markdown-preview :deep(hr) {
  border: 0;
  border-top: 2px solid #e5e7eb;
  margin: 2rem 0;
}

.markdown-preview :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.markdown-preview :deep(thead) {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}

.markdown-preview :deep(th) {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  font-weight: 700;
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.markdown-preview :deep(td) {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
  font-size: 0.875rem;
  color: #374151;
  background-color: white;
  transition: background-color 0.2s ease;
}

.markdown-preview :deep(tr:hover) {
  background-color: #f8fafc;
}

.markdown-preview :deep(tr:hover td) {
  background-color: #f8fafc;
}

.markdown-preview :deep(tbody tr:nth-child(even)) {
  background-color: #f9fafb;
}

.markdown-preview :deep(details) {
  margin: 1rem 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.markdown-preview :deep(details summary) {
  background-color: #f9fafb;
  padding: 1rem;
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.markdown-preview :deep(details summary:hover) {
  background-color: #f3f4f6;
}

.markdown-preview :deep(details[open] summary) {
  border-bottom: 1px solid #e5e7eb;
}

.markdown-preview :deep(details > div) {
  padding: 1rem;
  background-color: white;
}

.markdown-preview :deep(li) {
  margin-bottom: 0.25rem;
  line-height: 1.5;
}

.markdown-preview :deep(ol),
.markdown-preview :deep(ul) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.markdown-preview :deep(ol) {
  list-style-type: decimal;
}

.markdown-preview :deep(ul) {
  list-style-type: disc;
}

/* Special styling for Jira-specific elements */
.markdown-preview :deep(span[style*="color: red"]) {
  background-color: #fef2f2;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #fecaca;
  font-weight: 600;
}

/* Responsive design */
@media (max-width: 768px) {
  .markdown-preview {
    font-size: 0.875rem;
  }

  .markdown-preview :deep(h1) {
    font-size: 1.25rem;
  }

  .markdown-preview :deep(h2) {
    font-size: 1.125rem;
  }

  .markdown-preview :deep(table) {
    font-size: 0.75rem;
  }

  .markdown-preview :deep(th),
  .markdown-preview :deep(td) {
    padding: 0.5rem;
  }
}
</style>