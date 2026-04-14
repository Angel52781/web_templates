import './App.css'
import { Header } from './components/Header/Header'
import { Footer } from './sections/Footer/Footer'
import { Hero } from './sections/Hero/Hero'
import { Services } from './sections/Services/Services'

function App() {
  return (
    <div className="app">
      <div id="top" />
      <Header clinicName="Aurora Dental" phone="+51 987 654 321" />
      <main className="main">
        <Hero clinicName="Aurora Dental" />
        <Services />
      </main>
      <Footer clinicName="Aurora Dental" />
    </div>
  )
}

export default App
