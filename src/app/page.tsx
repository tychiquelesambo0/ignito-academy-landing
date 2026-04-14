'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import { CheckCircle2, GraduationCap, Clock, FileText, Globe, BookOpen, Laptop, Users, Award, Menu, X } from 'lucide-react'

export default function Home() {
  const { t } = useLanguage()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const timelineRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = timelineRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('timeline-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  
  const handleApplyClick = useCallback(() => {
    setMobileMenuOpen(false)
    window.location.href = 'https://admissions.ignitoacademy.com/apply?tab=dossier'
  }, [router])
  
  const handleLoginClick = useCallback(() => {
    setMobileMenuOpen(false)
    window.location.href = 'https://admissions.ignitoacademy.com/apply?tab=connexion'
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0 z-50">
        {/* Main bar */}
        <div className="container mx-auto px-4 flex items-center justify-between h-[64px]">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/ignito-logo.svg"
              alt="Ignito Academy"
              width={153}
              height={34}
              priority
              className="h-[32px] w-auto"
            />
          </Link>

          {/* Centre nav links — desktop only */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Admissions and Blog links hidden — coming soon */}
          </nav>

          {/* Right controls — desktop */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              onClick={handleApplyClick}
              className="bg-[#021463] hover:bg-[#021463]/90 text-white min-h-[40px] px-5 text-sm font-semibold rounded-md"
            >
              {t('landing.nav.apply')}
            </Button>
            <Button
              onClick={handleLoginClick}
              variant="outline"
              className="border-[#021463]/30 text-[#021463] hover:bg-[#021463]/5 hover:text-[#021463] min-h-[40px] px-5 text-sm font-semibold rounded-md bg-transparent"
            >
              {t('landing.nav.login')}
            </Button>
          </div>

          {/* Mobile right: lang toggle + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
              className="p-2 min-h-[48px] min-w-[48px] flex items-center justify-center text-[#021463] rounded-md hover:bg-[#021463]/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F8FAFC] border-t border-[#E2E8F0] px-4 py-4 flex flex-col gap-1">
            {/* Admissions and Blog links hidden — coming soon */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2 mt-1">
              <Button
                onClick={handleApplyClick}
                className="bg-[#021463] hover:bg-[#021463]/90 text-white min-h-[48px] w-full text-sm font-semibold rounded-md"
              >
                {t('landing.nav.apply')}
              </Button>
              <Button
                onClick={handleLoginClick}
                variant="outline"
                className="border-[#021463]/30 text-[#021463] hover:bg-[#021463]/5 hover:text-[#021463] min-h-[48px] w-full text-sm font-semibold rounded-md bg-transparent"
              >
                {t('landing.nav.login')}
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-gradient relative text-white overflow-hidden">
          {/* Decorative floating orbs */}
          <div className="hero-orb-1 absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full opacity-[0.12] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #4EA6F5 0%, transparent 70%)' }} />
          <div className="hero-orb-2 absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.10] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #4EA6F5 0%, transparent 70%)' }} />
          <div className="hero-orb-3 absolute -bottom-20 left-1/3 w-[320px] h-[320px] rounded-full opacity-[0.08] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #7ec8ff 0%, transparent 70%)' }} />

          {/* Fine dot-grid texture */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* Content */}
          <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
            <div className="hero-content max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('landing.hero.title')}
              </h1>
              <p className="text-lg md:text-xl mb-10 text-white/85 max-w-xl mx-auto leading-relaxed">
                {t('landing.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="https://admissions.ignitoacademy.com/apply?tab=dossier">
                  <Button size="lg" className="bg-[#4EA6F5] hover:bg-[#3a92e0] text-white min-h-[52px] px-10 text-base font-semibold rounded-md w-full sm:w-auto shadow-lg shadow-[#4EA6F5]/30">
                    {t('landing.hero.cta_primary')}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" onClick={handleLoginClick} className="border-white/40 text-white hover:bg-white/10 hover:text-white min-h-[52px] px-10 text-base font-semibold rounded-md bg-transparent w-full sm:w-auto backdrop-blur-sm">
                  {t('landing.nav.login')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 4-Year Journey Timeline (Horizontal) */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                {t('landing.journey.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('landing.journey.subtitle')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('landing.journey.subtitle2')}
              </p>
            </div>
            
            <div ref={timelineRef}>
            {/* Desktop Timeline */}
            <div className="hidden md:flex items-center justify-between max-w-5xl mx-auto relative">
              {/* Connector line draws left → right */}
              <div className="tl-connector absolute top-[32px] left-0 right-0 h-0.5 bg-border" />

              {/* Year 1 */}
              <div className="tl-col flex flex-col items-center relative z-10" style={{ animationDelay: '0.25s' }}>
                <div className="tl-icon w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4" style={{ animationDelay: '0.25s' }}>
                  <FileText className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm mb-1">{t('landing.journey.year0')}</div>
                  <div className="font-bold text-lg mb-1">{t('landing.journey.year0_title')}</div>
                  <div className="text-xs text-muted-foreground">{t('landing.journey.year0_location')}</div>
                </div>
              </div>

              {/* Year 2 */}
              <div className="tl-col flex flex-col items-center relative z-10" style={{ animationDelay: '0.65s' }}>
                <div className="tl-icon w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4" style={{ animationDelay: '0.65s' }}>
                  <Award className="w-8 h-8 text-slate-500" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm mb-1 text-muted-foreground">{t('landing.journey.year1')}</div>
                  <div className="font-bold text-lg mb-1">{t('landing.journey.year1_title')}</div>
                  <div className="text-xs text-muted-foreground">{t('landing.journey.year1_location')}</div>
                </div>
              </div>

              {/* Year 3 */}
              <div className="tl-col flex flex-col items-center relative z-10" style={{ animationDelay: '1.05s' }}>
                <div className="tl-icon w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4" style={{ animationDelay: '1.05s' }}>
                  <GraduationCap className="w-8 h-8 text-slate-500" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm mb-1 text-muted-foreground">{t('landing.journey.year2')}</div>
                  <div className="font-bold text-lg mb-1">{t('landing.journey.year2_title')}</div>
                  <div className="text-xs text-muted-foreground">{t('landing.journey.year2_location')}</div>
                </div>
              </div>

              {/* Year 4 — final */}
              <div className="tl-col flex flex-col items-center relative z-10" style={{ animationDelay: '1.45s' }}>
                <div className="tl-icon-final w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 relative" style={{ animationDelay: '1.45s' }}>
                  <GraduationCap className="w-8 h-8 text-primary-foreground" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                    {t('landing.journey.year3_badge')}
                  </span>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm mb-1 text-primary">{t('landing.journey.year3')}</div>
                  <div className="font-bold text-lg mb-1 text-primary">{t('landing.journey.year3_title')}</div>
                  <div className="text-xs text-muted-foreground">{t('landing.journey.year3_location')}</div>
                </div>
              </div>
            </div>
            
            {/* Mobile Timeline */}
            <div className="md:hidden space-y-6">
              {[0, 1, 2, 3].map((year) => {
                const delay = year * 0.42
                const isFinal = year === 3
                return (
                  <div
                    key={year}
                    className="tl-item flex gap-4"
                    style={{ animationDelay: `${delay}s` }}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`tl-icon${isFinal ? '-final' : ''} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          year === 0 || isFinal ? 'bg-primary' : 'bg-slate-200'
                        }`}
                        style={{ animationDelay: `${delay}s` }}
                      >
                        {year === 0 && <FileText className="w-6 h-6 text-primary-foreground" />}
                        {year === 1 && <Award className="w-6 h-6 text-slate-500" />}
                        {year === 2 && <GraduationCap className="w-6 h-6 text-slate-500" />}
                        {year === 3 && <GraduationCap className="w-6 h-6 text-primary-foreground" />}
                      </div>
                      {year < 3 && (
                        <div
                          className="tl-line w-0.5 flex-1 bg-border mt-2"
                          style={{ animationDelay: `${delay + 0.32}s` }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className={`text-sm font-semibold mb-1 ${isFinal ? 'text-primary' : ''}`}>
                        {t(`landing.journey.year${year}`)}
                      </div>
                      <div className={`font-bold text-lg mb-1 ${isFinal ? 'text-primary' : ''}`}>
                        {t(`landing.journey.year${year}_title`)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t(`landing.journey.year${year}_location`)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            </div> {/* end timelineRef wrapper */}
          </div>
        </section>

        {/* Foundation Diploma Section */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                  {t('landing.foundation.badge')}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                {t('landing.foundation.title')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('landing.foundation.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-4 sm:p-8 rounded-lg border border-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/25">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">{t('landing.foundation.benefit1_title')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t('landing.foundation.benefit1_desc')}</p>
              </div>
              
              <div className="bg-white p-4 sm:p-8 rounded-lg border border-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/25">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">{t('landing.foundation.benefit2_title')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t('landing.foundation.benefit2_desc')}</p>
              </div>
              
              <div className="bg-white p-4 sm:p-8 rounded-lg border border-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/25 sm:col-span-2 md:col-span-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">{t('landing.foundation.benefit3_title')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t('landing.foundation.benefit3_desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                {t('landing.curriculum.title')}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mb-12">
                {t('landing.curriculum.subtitle')}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                        {num}
                      </div>
                      <div className="text-lg">{t(`landing.curriculum.subject${num}`)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="card-featured bg-slate-900 text-white p-8 rounded-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-8 h-8 text-accent" />
                    <h3 className="font-serif text-2xl font-bold">{t('landing.curriculum.details_title')}</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm text-slate-400 mb-1">{t('landing.curriculum.duration_label')}</div>
                        <div className="text-sm font-normal">{t('landing.curriculum.duration_value')}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Users className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm text-slate-400 mb-1">{t('landing.curriculum.mode_label')}</div>
                        <div className="text-sm font-normal">{t('landing.curriculum.mode_value')}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm text-slate-400 mb-1">{t('landing.curriculum.requirement_label')}</div>
                        <div className="text-sm font-normal">{t('landing.curriculum.requirement_value')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground min-h-[56px] px-8">
                  {t('landing.curriculum.download_cta')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bourse d'Excellence du Fondateur ── */}
        <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 70%)' }} />

          <div className="container mx-auto px-4 relative z-10">

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⭐ {t('landing.scholarship.badge')}
              </span>
            </div>

            {/* Headline */}
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-5 leading-tight">
                {t('landing.scholarship.title')}
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-3">
                {t('landing.scholarship.subtitle')}
              </p>
              <p className="text-slate-400 leading-relaxed">
                {t('landing.scholarship.description')}
              </p>
            </div>

            {/* Coverage cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12">
              <div className="rounded-xl border border-amber-500/30 p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-amber-500/20 hover:border-amber-500/50" style={{ background: 'rgba(245,158,11,0.08)' }}>
                <div className="text-3xl mb-3">🎓</div>
                <p className="font-bold text-white text-base mb-1">{t('landing.scholarship.covers_tuition')}</p>
                <p className="text-slate-400 text-sm">{t('landing.scholarship.covers_tuition_desc')}</p>
              </div>
              <div className="rounded-xl border border-amber-500/30 p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-amber-500/20 hover:border-amber-500/50" style={{ background: 'rgba(245,158,11,0.08)' }}>
                <div className="text-3xl mb-3">📶</div>
                <p className="font-bold text-white text-base mb-1">{t('landing.scholarship.covers_internet')}</p>
                <p className="text-slate-400 text-sm">{t('landing.scholarship.covers_internet_desc')}</p>
              </div>
              <div className="rounded-xl border border-amber-500/30 p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-amber-500/20 hover:border-amber-500/50" style={{ background: 'rgba(245,158,11,0.08)' }}>
                <div className="text-3xl mb-3">🏆</div>
                <p className="font-bold text-white text-base mb-1">{t('landing.scholarship.covers_slots')}</p>
                <p className="text-slate-400 text-sm">{t('landing.scholarship.covers_slots_desc')}</p>
              </div>
            </div>

            {/* Eligibility criteria */}
            <div className="max-w-2xl mx-auto mb-10">
              <p className="text-center text-xs font-bold uppercase tracking-widest text-amber-400 mb-5">
                {t('landing.scholarship.criteria_title')}
              </p>
              <div className="space-y-3">
                {[
                  t('landing.scholarship.criteria_1'),
                  t('landing.scholarship.criteria_2'),
                  t('landing.scholarship.criteria_3'),
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-sm text-slate-200">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
              <div className="text-center space-y-3">
              <Button
                onClick={handleApplyClick}
                className="w-full sm:w-auto min-h-[52px] px-8 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-md text-base transition-all shadow-lg shadow-amber-500/30"
              >
                {t('landing.scholarship.cta')}
              </Button>
              <p className="text-xs text-slate-400">{t('landing.scholarship.note')}</p>
            </div>

          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                {t('landing.why_choose.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('landing.why_choose.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-border text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/25">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('landing.why_choose.benefit1_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('landing.why_choose.benefit1_desc')}</p>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-border text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/25">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('landing.why_choose.benefit2_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('landing.why_choose.benefit2_desc')}</p>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-border text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/25">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('landing.why_choose.benefit3_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('landing.why_choose.benefit3_desc')}</p>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-lg border border-border text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/25">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('landing.why_choose.benefit4_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('landing.why_choose.benefit4_desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="cta-gradient relative overflow-hidden">
          {/* Floating orbs — white-toned on blue */}
          <div className="hero-orb-1 absolute -top-20 -left-20 w-[380px] h-[380px] rounded-full opacity-[0.15] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
          <div className="hero-orb-2 absolute top-1/2 -right-28 w-[460px] h-[460px] rounded-full opacity-[0.12] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
          <div className="hero-orb-3 absolute -bottom-16 left-1/3 w-[300px] h-[300px] rounded-full opacity-[0.10] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #021463 0%, transparent 70%)' }} />

          {/* Dot-grid texture */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #021463 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* Content */}
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="cta-content max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#021463] mb-4">
                {t('landing.final_cta.title')}
              </h2>
              <p className="text-lg md:text-xl font-normal text-[#021463] mb-10 max-w-2xl mx-auto leading-relaxed">
                {t('landing.final_cta.subtitle')}
              </p>
              <Link href="https://admissions.ignitoacademy.com/apply?tab=dossier" className="block w-full sm:w-auto sm:inline-block">
                <Button size="lg" className="w-full sm:w-auto bg-[#021463] hover:bg-[#021463]/90 text-white min-h-[56px] px-8 sm:px-12 text-lg font-semibold rounded-md shadow-lg shadow-[#021463]/30">
                  {t('landing.final_cta.cta')}
                </Button>
              </Link>
              <p className="text-sm font-normal text-[#021463] mt-5">{t('landing.final_cta.note')}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <Link href="/" className="inline-flex mb-4">
                  <Image
                    src="/ignito-logo-white.svg"
                    alt="Ignito Academy"
                    width={153}
                    height={34}
                    className="h-[32px] w-auto"
                  />
                </Link>
                <p className="text-sm text-slate-400">
                  {t('landing.footer.description')}
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">{t('landing.footer.quick_links')}</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="https://admissions.ignitoacademy.com/apply?tab=dossier" className="hover:text-white">{t('landing.footer.apply')}</Link></li>
                  <li><Link href="https://admissions.ignitoacademy.com/apply?tab=connexion" className="hover:text-white">{t('landing.footer.track')}</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">{t('landing.footer.contact')}</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>{t('landing.footer.address')}</li>
                  <li>{t('landing.footer.phone')}</li>
                  <li>{t('landing.footer.email')}</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
              {t('landing.footer.copyright')}
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
