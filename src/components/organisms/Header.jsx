import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Burger } from '@mantine/core'
import Logo from '../atoms/Logo'
import './Header.css'

const linkClass = ({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')

export default function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

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
          <NavLink to="/writers" className={linkClass} onClick={close}>
            Writers
          </NavLink>
          <NavLink to="/submit" className={linkClass} onClick={close}>
            Submit
          </NavLink>
          <NavLink to="/wallpapers" className={linkClass} onClick={close}>
            Wallpapers
          </NavLink>
          <NavLink to="/about" className={linkClass} onClick={close}>
            About
          </NavLink>
          <NavLink to="/enquiry" className={linkClass} onClick={close}>
            Enquiry
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
