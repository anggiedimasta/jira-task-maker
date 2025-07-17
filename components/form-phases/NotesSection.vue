<template>
  <div class="h-full flex flex-col">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
    <div class="flex-1 overflow-auto">
      <UTextarea
        v-model="notes"
        :error="error"
        placeholder="Add any additional notes, considerations, or special requirements here..."
        class="w-full h-full resize-none min-h-[500px] text-gray-500"
        :rows="10"
        @update:model-value="handleUpdate"
        @keydown="handleNotesKeydown"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | undefined
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const notes = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value)
})

const handleUpdate = () => {
  emit('update:modelValue', notes.value)
}

// Handle notes textarea keydown for markdown conversion
const handleNotesKeydown = (event: KeyboardEvent) => {
  const target = event.target as HTMLTextAreaElement
  const cursorPosition = target.selectionStart
  const currentValue = target.value

  // Convert * to bullet points
  if (event.key === '*' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault()

    // Check if we're at the beginning of a line or after a space
    const beforeCursor = currentValue.substring(0, cursorPosition)
    const isAtLineStart = beforeCursor.endsWith('\n') || beforeCursor === ''
    const isAfterSpace = beforeCursor.endsWith(' ')

    if (isAtLineStart || isAfterSpace) {
      const newValue = currentValue.substring(0, cursorPosition) + '* ' + currentValue.substring(cursorPosition)
      notes.value = newValue

      // Set cursor position after the bullet point
      setTimeout(() => {
        target.setSelectionRange(cursorPosition + 2, cursorPosition + 2)
      }, 0)
    } else {
      // Just insert the asterisk normally
      const newValue = currentValue.substring(0, cursorPosition) + '*' + currentValue.substring(cursorPosition)
      notes.value = newValue

      setTimeout(() => {
        target.setSelectionRange(cursorPosition + 1, cursorPosition + 1)
      }, 0)
    }
  }

  // Convert number + dot to numbered list
  if (event.key === '.' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
    const beforeCursor = currentValue.substring(0, cursorPosition)
    const isNumberBefore = /^\d+$/.test(beforeCursor.trim().split('\n').pop() || '')

    if (isNumberBefore) {
      event.preventDefault()

      // Find the start of the current line
      const lines = currentValue.split('\n')
      let currentLineIndex = 0
      let charCount = 0

      for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= cursorPosition) {
          currentLineIndex = i
          break
        }
        charCount += lines[i].length + 1 // +1 for newline
      }

      const currentLineText = lines[currentLineIndex]
      const numberMatch = currentLineText.match(/^(\d+)$/)

      if (numberMatch) {
        const number = numberMatch[1]
        const newLineText = `${number}. `
        lines[currentLineIndex] = newLineText

        const newValue = lines.join('\n')
        notes.value = newValue

        // Set cursor position after the numbered list
        const newCursorPosition = charCount + newLineText.length
        setTimeout(() => {
          target.setSelectionRange(newCursorPosition, newCursorPosition)
        }, 0)
      }
    }
  }
}
</script>