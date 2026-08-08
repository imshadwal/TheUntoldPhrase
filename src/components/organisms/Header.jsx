import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Burger } from '@mantine/core'
import Logo from '../atoms/Logo'
import './Header.css'

const linkClass = ({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')

const OTHER_LINKS = [
  { to: '/writers', label: 'Writers' },
  { to: '/wallpapers', label: 'Wallpapers' },
  { to: '/enquiry', label: 'Enquiry' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [otherOpen, setOtherOpen] = useState(false)
  const location = useLocation()
  const otherRef = useRef(null)

  const otherActive = OTHER_LINKS.some((item) => location.pathname.startsWith(item.to))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    setOtherOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!otherOpen) return undefined
    const onPointer = (e) => {
      if (otherRef.current && !otherRef.current.contains(e.target)) {
        setOtherOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOtherOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [otherOpen])

  const close = () => {
    setOpen(false)
    setOtherOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <span onClick={close}>
          <Logo size={44} />
        </span>

        <Burger
          className="nav-toggle"
          opened={open}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          color="var(--ink)"
          size="sm"
        />

        <nav className={`site-nav ${open ? 'is-open' : ''}`}>
          <NavLink to="/" end className={linkClass} onClick={close}>
            Home
          </NavLink>
          <NavLink to="/writings" className={linkClass} onClick={close}>
            Writings
          </NavLink>
          <NavLink to="/anonymous-stories" className={linkClass} onClick={close}>
            Anonymous
          </NavLink>
          <NavLink to="/submit" className={linkClass} onClick={close}>
            Submit
          </NavLink>

          <div
            ref={otherRef}
            className={`nav-dropdown${otherOpen ? ' is-open' : ''}${otherActive ? ' is-active' : ''}`}
          >
            <button
              type="button"
              className={`nav-link nav-dropdown__trigger${otherActive ? ' is-active' : ''}`}
              aria-expanded={otherOpen}
              aria-haspopup="true"
              onClick={() => setOtherOpen((v) => !v)}
            >
              Other
              <span className="caret" aria-hidden>
                ▾
              </span>
            </button>
            <div className="nav-dropdown__menu" role="menu">
              {OTHER_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  role="menuitem"
                  className={({ isActive }) =>
                    isActive ? 'nav-dropdown__link is-active' : 'nav-dropdown__link'
                  }
                  onClick={close}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
