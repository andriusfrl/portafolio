import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'

function App() {
  const heroRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const heroEl = heroRef.current
      if (!heroEl) return
      const progress = Math.min(1, window.scrollY / (heroEl.offsetHeight * 0.55))
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Navbar scrollProgress={scrollProgress} />
      <main>
        <div ref={heroRef}>
          <Hero />
        </div>
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </>
  )
}

export default App
