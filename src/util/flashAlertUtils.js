export function findDetailMessage(err) {
  let a = err.message
  let b
  if (err.response) {
    if (err.response.data) {
      try {
        if (Array.isArray(err.response.data.errors)) {
          // probably a canvas api
          a = err.response.data.errors[0].message
          b = err.message
        } else if (err.response.data.message) {
          // probably a canvas api too
          a = err.response.data.message
          b = err.message
        }
      } catch (ignore) {
        a = err.message
      }
    }
  }
  return {a, b}
}

export const isLoadingChunkError = a => {
  return typeof a === 'string' && a.toLowerCase().includes('loading chunk')
}