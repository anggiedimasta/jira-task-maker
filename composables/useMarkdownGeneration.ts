import type { FormState } from './useFormValidation'

export function useMarkdownGeneration() {
  const { copyToClipboard } = useClipboardUtils()
  const generateMarkdown = (form: FormState): string => {
    let md = ''

    // Objective
    md += `h2. Objective\n`
    if (Array.isArray(form.objective)) {
      form.objective.forEach((obj, index) => {
        if (obj.trim()) {
          md += `${index + 1}. ${obj}\n`
        }
      })
    } else {
      md += `${form.objective}\n`
    }
    md += '\n'

    // Divider after Objective
    md += `----\n\n`

    // Acceptance Criteria
    md += `h2. Acceptance Criteria\n{code:gherkin}\n`
    if (Array.isArray(form.acceptance)) {
      form.acceptance.forEach((criteria, index) => {
        md += `${index + 1}. ${form.objective[index] || `Objective ${index + 1}`}:\n`

        // Given conditions
        criteria.given.forEach(given => {
          if (given.trim()) {
            md += `   Given ${given}\n`
          }
        })

        // When conditions
        criteria.when.forEach(when => {
          if (when.trim()) {
            md += `   When ${when}\n`
          }
        })

        // Then conditions
        criteria.then.forEach(then => {
          if (then.trim()) {
            md += `   Then ${then}\n`
          }
        })

        md += '\n'
      })
    } else {
      md += `${form.acceptance}\n`
    }
    md += `{code}\n\n`

    // Divider after Acceptance Criteria
    md += `----\n\n`

    // Technical Specification
    md += `h2. Technical Specification\n\n`

    // Technical Details (moved before Technical Steps)
    if (form.tech.figma || form.tech.epicBranch || form.tech.repository || form.tech.page || form.tech.account) {
      md += `h3. Technical Details\n`
      if (form.tech.figma) {
        md += `*Figma:* ${form.tech.figma}\n`
      }
      if (form.tech.epicBranch) {
        md += `*Epic Branch:* ${form.tech.epicBranch}\n`
      }
      if (form.tech.repository) {
        md += `*Repository:* ${form.tech.repository}\n`
      }
      if (form.tech.page) {
        md += `*Page:* ${form.tech.page}\n`
      }
      if (form.tech.account) {
        md += `*Account:* ${form.tech.account}\n`
      }
      md += '\n'
    }

    // Technical Steps
    if (form.tech.stepGroups && form.tech.stepGroups.length > 0) {
      md += `h3. Technical Steps\n`
      form.tech.stepGroups.forEach((stepGroup, groupIndex) => {
        if (stepGroup.steps.some(step => step.step.trim())) {
          md += `${groupIndex + 1}. ${form.objective[groupIndex] || `Objective ${groupIndex + 1}`}:
`
          stepGroup.steps.forEach((techStep, stepIndex) => {
            if (techStep.step.trim()) {
              if (techStep.fileReference?.trim()) {
                md += `   ${stepIndex + 1}. ${techStep.step} *(File: ${techStep.fileReference})*\n`
              } else {
                md += `   ${stepIndex + 1}. ${techStep.step}\n`
              }
            }
          })
          md += '\n'
        }
      })
    }

    // Divider after Technical Specification
    md += `----\n\n`

    // API Specification (if provided)
    if (form.api && form.api.length > 0 && form.api.some(api => api.name?.trim())) {
      md += `h2. API Specification\n\n`

      // Create table with the three columns
      md += `||API Name||Endpoint URL||Contract API||\n`

      form.api.forEach(api => {
        if (api.name?.trim()) {
          // Create API contract summary
          const apiContract = `Method: ${api.contract.method}\nRequest: ${api.contract.requestPayload}\nResponse: ${api.contract.responsePayload}`

          md += `|${api.name}|${api.endpointUrl}|{code:json}\n${apiContract}\n{code}|\n`
        }
      })

      md += '\n'

      // Divider after API Specification
      md += `----\n\n`
    }

    // UI Specification (if provided)
    if (form.ui && form.ui.length > 0 && form.ui.some(ui => ui.name?.trim() || ui.design)) {
      md += `h2. UI Specification\n\n`

      // Create table with the three columns
      md += `||UI Name||Design||Notes||\n`

      form.ui.forEach((ui) => {
        if (ui.name?.trim() || ui.design) {
          let designContent = ''
          let notesContent = ''

          // Check if design is a File object
          if (ui.design instanceof File) {
            const fileName = ui.design.name
            const fileSize = (ui.design.size / 1024).toFixed(1) // Convert to KB
            designContent = `*{color:red}ATTACH IMAGE: ${fileName} (${fileSize} KB){color}*\n*Please attach the binary image file "${fileName}" to this Jira issue*`
          } else if (typeof ui.design === 'string' && ui.design.trim()) {
            designContent = ui.design
          }

          if (ui.note?.trim()) {
            notesContent = ui.note
          }

          md += `|${ui.name || ''}|${designContent}|${notesContent}|\n`
        }
      })

      md += '\n'

      // Divider after UI Specification
      md += `----\n\n`
    }

    // Additional Notes (if provided)
    if (form.notes?.trim()) {
      md += `h2. Additional Notes\n${form.notes}\n\n`
    }

    const finalMarkdown = md.trim()
    console.log('Final markdown generated:', {
      totalLength: finalMarkdown.length,
      containsFileReferences: finalMarkdown.includes('ATTACH IMAGE:'),
      fileReferenceCount: (finalMarkdown.match(/ATTACH IMAGE:/g) || []).length,
      dividerCount: (finalMarkdown.match(/----/g) || []).length
    })
    return finalMarkdown
  }

  const downloadMarkdown = (markdown: string, filename: string = 'jira-task.md') => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAllImages = (form: FormState) => {
    const images: Array<{ file: File, filename: string }> = []

    // Extract images from UI specifications
    if (form.ui && form.ui.length > 0) {
      form.ui.forEach((ui, index) => {
        if (ui.design instanceof File && ui.name?.trim()) {
          const filename = `${ui.name.replace(/[^a-zA-Z0-9]/g, '-')}-${index + 1}`

          images.push({
            file: ui.design,
            filename: `${filename}.${ui.design.name.split('.').pop() || 'png'}`
          })
        }
      })
    }

    // Download each image as binary file
    images.forEach(({ file, filename }) => {
      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log(`Image downloaded as binary: ${filename}`)
    })

    return images.length
  }

  return {
    generateMarkdown,
    downloadMarkdown,
    downloadAllImages,
    copyToClipboard
  }
}