interface UiSpec {
  name: string
  design: string | File
  note?: string
}

export function useImageUtils() {
  const handleImagePaste = async (
    event: ClipboardEvent,
    uiSpecs: UiSpec[],
    uiIndex: number,
    handleUpdate: () => void
  ) => {
    const clipboardData = event.clipboardData
    if (!clipboardData) return

    const items = Array.from(clipboardData.items)
    const imageItem = items.find(item => item.type.startsWith('image/'))

    if (imageItem) {
      event.preventDefault()

      const file = imageItem.getAsFile()
      if (!file) return

      try {
        if (uiSpecs && uiSpecs[uiIndex]) {
          uiSpecs[uiIndex].design = file
          handleUpdate()

          const { add } = useToast()
          add({
            title: 'Image Attached',
            description: `Image "${file.name}" has been attached as binary file`,
            color: 'success'
          })
        }
      } catch {
        const { add } = useToast()
        add({
          title: 'Attachment Failed',
          description: 'Failed to attach image file',
          color: 'error'
        })
      }
    }
  }

  const handleImageUpload = async (
    event: Event,
    uiSpecs: UiSpec[],
    uiIndex: number,
    handleUpdate: () => void
  ) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (file && file.type.startsWith('image/')) {
      try {
        if (uiSpecs && uiSpecs[uiIndex]) {
          uiSpecs[uiIndex].design = file
          handleUpdate()

          const { add } = useToast()
          add({
            title: 'Image Attached',
            description: `Image "${file.name}" has been attached as binary file`,
            color: 'success'
          })
        }
      } catch {
        const { add } = useToast()
        add({
          title: 'Upload Failed',
          description: 'Failed to attach image file',
          color: 'error'
        })
      }
    } else if (file) {
      const { add } = useToast()
      add({
        title: 'Invalid File',
        description: 'Please select an image file',
        color: 'error'
      })
    }

    // Reset the input
    target.value = ''
  }

  const triggerImageUpload = (uiIndex: number) => {
    const input = document.getElementById(`image-input-${uiIndex}`) as HTMLInputElement
    if (input) {
      input.click()
    }
  }

  const clearImage = (
    uiSpecs: UiSpec[],
    uiIndex: number,
    handleUpdate: () => void
  ) => {
    if (uiSpecs && uiSpecs[uiIndex]) {
      uiSpecs[uiIndex].design = ''
      handleUpdate()

      const { add } = useToast()
      add({
        title: 'Image Removed',
        description: 'Image has been removed from the design field',
        color: 'success'
      })
    }
  }

  const getImagePreviewUrl = (design: string | File): string => {
    if (design instanceof File) {
      return URL.createObjectURL(design)
    }
    return ''
  }

  const getImageFileName = (design: string | File): string => {
    if (design instanceof File) {
      return design.name
    }
    return ''
  }

  const isImageFile = (design: string | File): boolean => {
    return design instanceof File && design.type.startsWith('image/')
  }

  return {
    handleImagePaste,
    handleImageUpload,
    triggerImageUpload,
    clearImage,
    getImagePreviewUrl,
    getImageFileName,
    isImageFile
  }
}