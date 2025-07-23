
export const usePerformance = () => {
  const startTime = ref<number>(0)
  const metrics = ref<Record<string, number>>({})

  const markStart = (name: string) => {
    startTime.value = performance.now()
    if (typeof performance.mark !== 'undefined') {
      performance.mark(`${name}-start`)
    }
  }

  const markEnd = (name: string) => {
    const endTime = performance.now()
    const duration = endTime - startTime.value
    metrics.value[name] = duration

    if (typeof performance.mark !== 'undefined') {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }

    return duration
  }

  const getMetrics = () => {
    return { ...metrics.value }
  }

  const logBundleSize = () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('navigation')
      if (entries.length > 0) {
        const nav = entries[0] as PerformanceNavigationTiming
        console.log('Performance Metrics:', {
          domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          loadComplete: nav.loadEventEnd - nav.loadEventStart,
          transferSize: nav.transferSize,
          encodedBodySize: nav.encodedBodySize,
          decodedBodySize: nav.decodedBodySize
        })
      }
    }
  }

  const measureComponentLoad = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    markStart(name)
    try {
      const result = await fn()
      markEnd(name)
      return result
    } catch (error) {
      markEnd(name)
      throw error
    }
  }

  return {
    markStart,
    markEnd,
    getMetrics,
    logBundleSize,
    measureComponentLoad,
    metrics: readonly(metrics)
  }
}