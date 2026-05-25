import React from 'react';
import { NavBar } from '../components/NavBar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { Roles } from '../components/Roles';
import { Impact } from '../components/Impact';
import { CTABand } from '../components/CTABand';
import { Footer } from '../components/Footer';
export function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-200 selection:text-sky-900">
      <NavBar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Roles />
        <Impact />
        <CTABand />
      </main>
      <Footer />
    </div>);

}