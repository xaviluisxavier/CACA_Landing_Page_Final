import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import ResearchAreas from '../components/sections/ResearchAreas';
import Partners from '../components/sections/Partners';
import Opportunities from '../components/sections/Opportunities';
import Contact from '../components/sections/Contact';
import News from '../components/sections/News';
import Events from '../components/sections/Events';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ResearchAreas />
        <Partners />
        <Opportunities />
        <Events />
        <News />
        <Contact />
        
      </main>
      <Footer />
    </>
  );
}