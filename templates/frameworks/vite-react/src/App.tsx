import { Header } from './components/layout/Header/Header';
import { Footer } from './components/layout/Footer/Footer';
import { Hero } from './components/sections/Hero/Hero';
import { Services } from './components/sections/Services/Services';
import { Process } from './components/sections/Process/Process';
import { Contact } from './components/sections/Contact/Contact';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
