import debounce from 'lodash/debounce'

export default (f, ms) => {
  let waiting = null
  let ready = (...args) => {
    let old = waiting
    f(...args).then((r) => old.resolve(r)).catch((e) => old.reject(e))
    waiting = null
  }
  const debouncedThunk = debounce(ready, ms)

  return (...args) => {
    const promise = new Promise((resolve, reject) => waiting = { resolve, reject })
    debouncedThunk(...args)
    return promise
  }
}
