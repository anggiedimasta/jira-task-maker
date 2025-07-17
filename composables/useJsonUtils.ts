interface ApiContract {
  method: string
  requestPayload: string
  responsePayload: string
}

interface ApiSpec {
  name: string
  endpointUrl: string
  contract: ApiContract
}

export function useJsonUtils() {
  const formatJson = (jsonString: string): string => {
    try {
      const parsed = JSON.parse(jsonString)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return jsonString
    }
  }

  const handleJsonInput = (
    event: Event,
    apiSpecs: ApiSpec[],
    apiIndex: number,
    field: 'requestPayload' | 'responsePayload',
    handleUpdate: () => void
  ) => {
    const target = event.target as HTMLTextAreaElement
    const formatted = formatJson(target.value)

    if (apiSpecs && apiSpecs[apiIndex]) {
      apiSpecs[apiIndex].contract[field] = formatted
      handleUpdate()
    }
  }

  return {
    formatJson,
    handleJsonInput
  }
}