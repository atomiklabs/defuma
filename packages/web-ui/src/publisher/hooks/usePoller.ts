import { useEffect, useRef } from 'react'

export const usePoller = (fn, delay) => {
  const savedCallback = useRef() as React.MutableRefObject<Function>
  // Remember the latest fn.
  useEffect(() => {
    savedCallback.current = fn
  }, [fn])
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
  //run at start too
  useEffect(() => {
    fn()
  }, [])
}
