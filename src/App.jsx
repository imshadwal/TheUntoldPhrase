import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/organisms/Header'
import Footer from './components/organisms/Footer'
import Loader from './components/atoms/Loader'
import Home from './pages/Home'
import Writings from './pages/Writings'
import WritingDetail from './pages/WritingDetail'
import Writers from './pages/Writers'
import WriterDetail from './pages/WriterDetail'
import Submit from './pages/Submit'
import About from './pages/About'
import Enquiry from './pages/Enquiry'
import Wallpapers from './pages/Wallpapers'
import Feedback from './pages/Feedback'
import Privacy from './pages/Privacy'
import AnonymousStories from './pages/AnonymousStories'
import AnonymousStoryDetail from './pages/AnonymousStoryDetail'
import NotFound from './pages/NotFound'
import AnonInvite from './components/molecules/AnonInvite'
import ScrollTopButton from './components/molecules/ScrollTopButton'
import ScrollProgress from './components/molecules/ScrollProgress'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function RouteLoader() {
  const { pathname } = useLocation()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setBusy(true)
    const t = setTimeout(() => setBusy(false), 420)
    return () => clearTimeout(t)
  }, [pathname])

  if (!busy) return null
  return (
    <div className="route-loader" aria-hidden={false}>
      <Loader label="Loading" />
    </div>
  )
}

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-shell__main">
        <ScrollToTop />
        <Header />
        <ScrollProgress />
        <main className="main">
          <RouteLoader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/writings" element={<Writings />} />
            <Route path="/writings/:slug" element={<WritingDetail />} />
            <Route path="/writers" element={<Writers />} />
            <Route path="/writers/:slug" element={<WriterDetail />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/about" element={<About />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/contact" element={<Navigate to="/enquiry" replace />} />
            <Route path="/wallpapers" element={<Wallpapers />} />
            <Route path="/anonymous-stories" element={<AnonymousStories />} />
            <Route path="/anonymous-stories/:slug" element={<AnonymousStoryDetail />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <AnonInvite />
        <ScrollTopButton />
      </div>
    </div>
  )
}
