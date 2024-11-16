import { useEffect, useState } from "react"

export const useIsFirstRender = () => {
  const [isFirst, setIsFirst] = useState(true)
  useEffect(() => { setIsFirst(false) }, [])
  return isFirst
}