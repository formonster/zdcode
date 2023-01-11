import { useEffect, useRef } from "react"

export const useUnInitEffect = (callback: React.EffectCallback, deps?: React.DependencyList) => {
  const initRef = useRef(true)
  console.log('deps', deps);
  
  useEffect(() => {
    console.log('useUnInitEffect');
    
    if (initRef.current) {
      initRef.current = false
      return
    }
    callback()
  }, deps)
}