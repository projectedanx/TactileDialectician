import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Custom React hook that detects if the current viewport is mobile-sized.
 * Utilizes matchMedia for responsive state management and listens for resize events.
 *
 * @returns {boolean} True if the viewport width is below the 768px breakpoint, false otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
