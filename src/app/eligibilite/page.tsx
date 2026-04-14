'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, BookOpen, ChevronRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const AMS_URL = 'https://admissions.ignitoacademy.com'
const INTAKE_YEAR = 2026
const MIN_GRADE = 70
const MAX_AGE_ON_SEPT_1 = 19
const MIN_GRAD_YEAR = 2024

interface Grades {
  grade10: string
  grade11: string
  grade12: string
  exetat: string
}

interface Profile {
  dateOfBirth: string
  graduationYear: string
}

type Step = 'grades' | 'profile' | 'result'

interface EligibilityOutcome {
  eligible: boolean
  average: number
  ageOnSept1: number
  reasons: string[]
}

function calcAge(dob: Date, intakeYear: number): number {
  const sept1 = new Date(intakeYear, 8, 1)
  let age = sept1.getFullYear() - dob.getFullYear()
  const bday = new Date(sept1.getFullYear(), dob.getMonth(), dob.getDate())
  if (sept1 < bday) age--
  return age
}

function checkEligibility(grades: Grades, profile: Profile): EligibilityOutcome {
  const g10 = parseFloat(grades.grade10)
  const g11 = parseFloat(grades.grade11)
  const g12 = parseFloat(grades.grade12)
  const ex = parseFloat(grades.exetat)
  const avg = (g10 + g11 + g12 + ex) / 4
  const dob = new Date(profile.dateOfBirth)
  const age = calcAge(dob, INTAKE_YEAR)
  const gradYear = parseInt(profile.graduationYear)

  const reasons: string[] = []

  if (avg < MIN_GRADE) {
    reasons.push(`Moyenne générale insuffisante : ${avg.toFixed(1)}% (minimum requis : ${MIN_GRADE}%)`)
  }
  if (g10 < MIN_GRADE) reasons.push(`10e année : ${g10}% (minimum ${MIN_GRADE}%)`)
  if (g11 < MIN_GRADE) reasons.push(`11e année : ${g11}% (minimum ${MIN_GRADE}%)`)
  if (g12 < MIN_GRADE) reasons.push(`12e année : ${g12}% (minimum ${MIN_GRADE}%)`)
  if (ex < MIN_GRADE) reasons.push(`EXETAT : ${ex}% (minimum ${MIN_GRADE}%)`)
  if (age > MAX_AGE_ON_SEPT_1) {
    reasons.push(`Âge au 1er septembre ${INTAKE_YEAR} : ${age} ans (maximum autorisé : ${MAX_AGE_ON_SEPT_1} ans)`)
  }
  if (gradYear < MIN_GRAD_YEAR) {
    reasons.push(`Diplôme d'État obtenu en ${gradYear} (valide à partir de ${MIN_GRAD_YEAR})`)
  }

  return { eligible: reasons.length === 0, average: avg, ageOnSept1: age, reasons }
}

function GradeInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: boolean
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <div className="flex items-center gap-2">
        <div className={`relative flex-1 flex items-center rounded-md border-2 transition-colors ${error ? 'border-red-400' : 'border-slate-200 focus-within:border-[#4EA6F5]'}`}>
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="0"
            className="w-full h-12 px-4 bg-transparent text-slate-800 font-medium text-base outline-none rounded-md"
          />
          <span className="pr-4 text-slate-400 font-semibold select-none">%</span>
        </div>
        {value !== '' && !isNaN(parseFloat(value)) && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${parseFloat(value) >= MIN_GRADE ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {parseFloat(value) >= MIN_GRADE
              ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              : <XCircle className="w-4 h-4 text-red-500" />}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EligibilitePage() {
  const [step, setStep] = useState<Step>('grades')
  const [grades, setGrades] = useState<Grades>({ grade10: '', grade11: '', grade12: '', exetat: '' })
  const [profile, setProfile] = useState<Profile>({ dateOfBirth: '', graduationYear: '' })
  const [outcome, setOutcome] = useState<EligibilityOutcome | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const stepNumber = step === 'grades' ? 1 : step === 'profile' ? 2 : 3
  const progress = step === 'grades' ? 50 : step === 'profile' ? 100 : 100

  function validateGrades(): boolean {
    const errs: Record<string, string> = {}
    const fields: (keyof Grades)[] = ['grade10', 'grade11', 'grade12', 'exetat']
    for (const f of fields) {
      const v = parseFloat(grades[f])
      if (grades[f] === '' || isNaN(v)) errs[f] = 'Requis'
      else if (v < 0 || v > 100) errs[f] = 'Valeur entre 0 et 100'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function validateProfile(): boolean {
    const errs: Record<string, string> = {}
    if (!profile.dateOfBirth) errs.dateOfBirth = 'Requis'
    if (!profile.graduationYear) errs.graduationYear = 'Requis'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleNext() {
    if (step === 'grades') {
      if (validateGrades()) setStep('profile')
    } else if (step === 'profile') {
      if (validateProfile()) {
        const result = checkEligibility(grades, profile)
        setOutcome(result)
        setStep('result')
      }
    }
  }

  const gradeFields: { key: keyof Grades; label: string }[] = [
    { key: 'grade10', label: 'Résultat 10e année' },
    { key: 'grade11', label: 'Résultat 11e année' },
    { key: 'grade12', label: 'Résultat 12e année' },
    { key: 'exetat', label: 'Résultat EXETAT' },
  ]

  const filledGrades = gradeFields.filter(f => grades[f.key] !== '' && !isNaN(parseFloat(grades[f.key])))
  const liveAvg = filledGrades.length > 0
    ? filledGrades.reduce((s, f) => s + parseFloat(grades[f.key]), 0) / filledGrades.length
    : null

  const gradYears = [
    { value: '2026', label: '2026' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023 ou avant' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">

      {/* Nav */}
      <nav className="bg-[#021463] h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/ignito-logo-white.svg" alt="Ignito Academy" width={120} height={38} priority />
        </Link>
        <span className="ml-3 font-serif text-[13px] font-semibold tracking-widest text-white/55">ADMITTA</span>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#021463] mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Retour à l&apos;accueil
        </Link>

        {step !== 'result' && (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <span>Étape {stepNumber} sur 2</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: '#4EA6F5' }}
                />
              </div>
            </div>
          </>
        )}

        {/* ── Step 1: Grades ── */}
        {step === 'grades' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4"
                style={{ background: 'rgba(78,166,245,0.10)', color: '#4EA6F5' }}>
                <BookOpen className="w-3.5 h-3.5" />
                Résultats académiques
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#021463] leading-tight">
                Vos résultats scolaires
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Entrez vos pourcentages pour chaque niveau. Chaque note doit être ≥ 70%.
              </p>
            </div>

            <div className="space-y-4">
              {gradeFields.map(({ key, label }) => (
                <GradeInput
                  key={key}
                  label={label}
                  value={grades[key]}
                  onChange={v => {
                    setGrades(prev => ({ ...prev, [key]: v }))
                    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
                  }}
                  error={!!errors[key]}
                />
              ))}
            </div>

            {/* Live average preview */}
            {liveAvg !== null && (
              <div className={`flex items-center gap-3 p-4 rounded-lg border ${liveAvg >= MIN_GRADE ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                {liveAvg >= MIN_GRADE
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  : <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Moyenne provisoire : <strong>{liveAvg.toFixed(1)}%</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {liveAvg >= MIN_GRADE
                      ? 'Votre moyenne répond au critère minimum de 70%.'
                      : 'La moyenne doit être d\'au moins 70% pour la bourse.'}
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleNext}
              className="w-full h-12 rounded-md font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: '#021463' }}
            >
              Continuer <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Profile ── */}
        {step === 'profile' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4"
                style={{ background: 'rgba(78,166,245,0.10)', color: '#4EA6F5' }}>
                Profil personnel
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#021463] leading-tight">
                Votre profil
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Ces informations permettent de vérifier votre éligibilité par rapport à l&apos;âge et à l&apos;année d&apos;obtention.
              </p>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Date de naissance</label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={e => {
                  setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))
                  if (errors.dateOfBirth) setErrors(prev => ({ ...prev, dateOfBirth: '' }))
                }}
                max={`${INTAKE_YEAR - 14}-12-31`}
                className={`w-full h-12 px-4 rounded-md border-2 text-slate-800 font-medium text-base outline-none transition-colors bg-white ${errors.dateOfBirth ? 'border-red-400' : 'border-slate-200 focus:border-[#4EA6F5]'}`}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>
              )}
              <p className="text-xs text-slate-400">
                L&apos;âge est calculé au 1er septembre {INTAKE_YEAR} (maximum : {MAX_AGE_ON_SEPT_1} ans).
              </p>
            </div>

            {/* Graduation Year */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Année d&apos;obtention du Diplôme d&apos;État</label>
              <select
                value={profile.graduationYear}
                onChange={e => {
                  setProfile(prev => ({ ...prev, graduationYear: e.target.value }))
                  if (errors.graduationYear) setErrors(prev => ({ ...prev, graduationYear: '' }))
                }}
                className={`w-full h-12 px-4 rounded-md border-2 text-slate-800 font-medium text-base outline-none transition-colors bg-white appearance-none ${errors.graduationYear ? 'border-red-400' : 'border-slate-200 focus:border-[#4EA6F5]'}`}
              >
                <option value="">Sélectionnez une année</option>
                {gradYears.map(y => (
                  <option key={y.value} value={y.value}>{y.label}</option>
                ))}
              </select>
              {errors.graduationYear && (
                <p className="text-xs text-red-500 mt-1">{errors.graduationYear}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep('grades')}
                variant="outline"
                className="flex-1 h-12 rounded-md font-semibold border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 h-12 rounded-md font-semibold text-white"
                style={{ background: '#021463' }}
              >
                Vérifier mon éligibilité <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {step === 'result' && outcome && (
          <div className="space-y-6">
            {outcome.eligible ? (
              /* ── ELIGIBLE ── */
              <div className="bg-white rounded-xl border border-emerald-200 shadow-sm overflow-hidden">
                <div className="bg-emerald-500 px-7 py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9 text-white" />
                  </div>
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                    Vous êtes éligible !
                  </h1>
                  <p className="text-emerald-100 text-sm mt-2">
                    Bourse d&apos;Excellence — Cohorte Inaugurale
                  </p>
                </div>

                <div className="p-7 space-y-5">
                  <p className="text-slate-700 leading-relaxed">
                    Félicitations ! Votre profil académique correspond aux critères de la <strong>Bourse d&apos;Excellence</strong> d&apos;Ignito Academy. Vous avez l&apos;opportunité de rejoindre les <strong>20 boursiers de notre cohorte inaugurale</strong> et de bénéficier d&apos;une prise en charge intégrale de vos frais de scolarité et de votre forfait internet.
                  </p>

                  {/* Summary stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-100">
                      <p className="text-2xl font-bold text-emerald-700">{outcome.average.toFixed(1)}%</p>
                      <p className="text-xs text-emerald-600 font-semibold mt-0.5">Moyenne générale</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-100">
                      <p className="text-2xl font-bold text-emerald-700">{outcome.ageOnSept1} ans</p>
                      <p className="text-xs text-emerald-600 font-semibold mt-0.5">Âge au 1er sept. {INTAKE_YEAR}</p>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-lg p-4 border border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Prochaine étape</p>
                    <p className="text-sm text-slate-600">
                      Déposez votre candidature complète et soumettez votre vidéo de motivation pour la bourse. Les places sont limitées à 20 boursiers.
                    </p>
                  </div>

                  <a
                    href={`${AMS_URL}/apply?tab=dossier`}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-md font-semibold text-white text-base transition-all"
                    style={{ background: '#021463' }}
                  >
                    Postuler pour la Bourse d&apos;Excellence
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-md font-semibold text-slate-600 text-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Retour à l&apos;accueil
                  </Link>
                </div>
              </div>
            ) : (
              /* ── NOT ELIGIBLE ── */
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-7 py-8 text-center" style={{ background: '#021463' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(255,255,255,0.12)' }}>
                    <BookOpen className="w-9 h-9 text-white" />
                  </div>
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                    Pas éligible à la bourse
                  </h1>
                  <p className="text-white/60 text-sm mt-2">
                    Mais votre aventure Ignito Academy commence ici.
                  </p>
                </div>

                <div className="p-7 space-y-5">
                  <p className="text-slate-700 leading-relaxed">
                    Votre profil ne correspond pas aux critères de la Bourse d&apos;Excellence cette année. Cependant, vous pouvez toujours <strong>postuler comme candidat ordinaire</strong> et rejoindre Ignito Academy pour obtenir votre Licence Britannique en 4 ans depuis la RDC.
                  </p>

                  {/* Reasons */}
                  {outcome.reasons.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Critères non remplis
                      </p>
                      {outcome.reasons.map((reason, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <XCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600">{reason}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Encouragement block */}
                  <div className="rounded-lg p-5 border"
                    style={{ background: 'rgba(78,166,245,0.06)', borderColor: 'rgba(78,166,245,0.20)' }}>
                    <p className="text-sm font-semibold text-[#021463] mb-1">
                      Une place vous attend quand même
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Ignito Academy accepte des candidats ordinaires sans restriction de notes ou d&apos;âge. Commencez par l&apos;Année Préparatoire et obtenez votre Licence Britannique en 4 ans depuis Kinshasa — sans visa, sans voyage.
                    </p>
                  </div>

                  <a
                    href={`${AMS_URL}/apply?tab=dossier`}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-md font-semibold text-white text-base transition-all"
                    style={{ background: '#4EA6F5' }}
                  >
                    Postuler comme candidat ordinaire
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => {
                      setStep('grades')
                      setGrades({ grade10: '', grade11: '', grade12: '', exetat: '' })
                      setProfile({ dateOfBirth: '', graduationYear: '' })
                      setOutcome(null)
                      setErrors({})
                    }}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-md font-semibold text-slate-600 text-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Recommencer le test
                  </button>

                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 w-full text-sm text-slate-400 hover:text-slate-600 transition-colors pt-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info footnote */}
        {step !== 'result' && (
          <p className="text-center text-xs text-slate-400 mt-6">
            Ce test est indicatif et non contractuel. L&apos;éligibilité définitive est vérifiée lors de l&apos;instruction de votre dossier.
          </p>
        )}
      </div>
    </div>
  )
}
