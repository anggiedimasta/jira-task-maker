import { ref } from 'vue'

// Create a global state that persists across components
const globalModalState = {
  showModal: ref(false),
  modalMarkdown: ref(''),
  modalCopied: ref(false)
}

export const useModalState = () => {
    const openModal = (markdown: string) => {
    globalModalState.modalMarkdown.value = markdown
    globalModalState.modalCopied.value = false
    globalModalState.showModal.value = true
  }

  const closeModal = () => {
    globalModalState.showModal.value = false
  }

  const setModalCopied = (copied: boolean) => {
    globalModalState.modalCopied.value = copied
  }

  return {
    showModal: globalModalState.showModal,
    modalMarkdown: globalModalState.modalMarkdown,
    modalCopied: globalModalState.modalCopied,
    openModal,
    closeModal,
    setModalCopied
  }
}