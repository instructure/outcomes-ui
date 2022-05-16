import {useState, useCallback} from 'react'

const useBoolean = initialState => {
  const [state, setState] = useState(Boolean(initialState))
  const setTrue = useCallback(() => setState(true), [])
  const setFalse = useCallback(() => setState(false), [])

  return [state, setTrue, setFalse]
}

export default useBoolean
