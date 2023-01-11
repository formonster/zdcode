import { useRef, useState } from "react"

const useAutoRecoverState = <T>(initState: T, delay: number = 1000) => {
  const [_state, _setState] = useState(initState)

  const timerRef = useRef<any>()

  const setState = (state: T) => {
    _setState(state)

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      clearTimeout(timerRef.current)
      _setState(initState)
      timerRef.current = null
    }, delay)
  }

  return [_state, setState] as const
}

export default useAutoRecoverState