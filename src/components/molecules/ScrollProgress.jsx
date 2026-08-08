import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './ScrollProgress.css'

export default function ScrollProgress() {
  const { pathname } = useLocation()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(0)

    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  return (
    <div className="scroll-progress" aria-hidden>
      <span style={{ width: `${progress}%` }} />
    </div>
  )
}
