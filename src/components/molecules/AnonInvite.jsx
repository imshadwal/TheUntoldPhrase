import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Text, Title } from '@mantine/core'
import './AnonInvite.css'

const STORAGE_KEY = 'tup-anon-invite-seen'
const CHARACTER_SRC = '/images/anon/whisper-character.jpg'

function readSeen() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}

export default function AnonInvite() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const titleId = useId()
  const closeRef = useRef(null)
  const onAnon = pathname.startsWith('/anonymous-stories')

  const [seen, setSeen] = useState(readSeen)
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const dismiss = useCallback(() => {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(() => {
      markSeen()
      setSeen(true)
      setOpen(false)
      setLeaving(false)
    }, 420)
  }, [leaving])

  useEffect(() => {
    if (onAnon || seen) return undefined
    const t = window.setTimeout(() => setOpen(true), 900)
    return () => window.clearTimeout(t)
  }, [onAnon, seen])

  useEffect(() => {
    if (!open || leaving) return undefined
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, leaving, dismiss])

  function goShare() {
    markSeen()
    setSeen(true)
    setOpen(false)
    navigate('/anonymous-stories#send')
  }

  if (onAnon) return null

  return (
    <>
      {open ? (
        <aside
          className={`anon-drop${leaving ? ' is-leaving' : ''}`}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
        >
          <div className="anon-drop__string" aria-hidden="true">
            <span />
            <span />
          </div>

          <div className="anon-drop__card">
            <button
              ref={closeRef}
              type="button"
              className="anon-drop__close"
              onClick={dismiss}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="anon-drop__tape" aria-hidden="true" />

            <figure className="anon-drop__face">
              <img src={CHARACTER_SRC} alt="" width={120} height={120} decoding="async" />
            </figure>

            <div className="anon-drop__copy">
              <Text className="anon-drop__whisper" component="p">
                psst…
              </Text>
              <Title order={2} id={titleId} className="anon-drop__title">
                Got a story you can’t put your name on?
              </Title>
              <Text className="anon-drop__support" component="p">
                Leave it with us — no byline, just the words you never said out loud.
              </Text>

              <div className="anon-drop__actions">
                <Button type="button" color="wine" radius="xl" onClick={goShare}>
                  Share anonymously →
                </Button>
                <button type="button" className="anon-drop__later" onClick={dismiss}>
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </aside>
      ) : null}

      {seen && !open ? (
        <Link
          to="/anonymous-stories#send"
          className="anon-float"
          aria-label="Anonymous Stories — share without a byline"
        >
          <span className="anon-float__face">
            <img src={CHARACTER_SRC} alt="" width={64} height={64} decoding="async" />
          </span>
          <span className="anon-float__copy">
            <span className="anon-float__title">Anonymous Stories</span>
          </span>
        </Link>
      ) : null}
    </>
  )
}
