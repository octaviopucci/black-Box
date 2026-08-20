import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Procedures } from './components/Procedures'
import { Philosophy } from './components/Philosophy'
import { Results } from './components/Results'
import { Team } from './components/Team'
import { Contact, Footer } from './components/Contact'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Procedures />
        <Philosophy />
        <Results />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
