'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BookOpen,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'

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

  if (avg < MIN_GRADE)
    reasons.push(`Moyenne générale insuffisante : ${avg.toFixed(1)}% (minimum requis : ${MIN_GRADE}%)`)
  if (g10 < MIN_GRADE) reasons.push(`10e année : ${g10}% (minimum ${MIN_GRADE}%)`)
  if (g11 < MIN_GRADE) reasons.push(`11e année : ${g11}% (minimum ${MIN_GRADE}%)`)
  if (g12 < MIN_GRADE) reasons.push(`12e année : ${g12}% (minimum ${MIN_GRADE}%)`)
  if (ex < MIN_GRADE) reasons.push(`EXETAT : ${ex}% (minimum ${MIN_GRADE}%)`)
  if (age > MAX_AGE_ON_SEPT_1)
    reasons.push(
      `Âge au 1er septembre ${INTAKE_YEAR} : ${age} ans (maximum autorisé : ${MAX_AGE_ON_SEPT_1} ans)`
    )
  if (gradYear < MIN_GRAD_YEAR)
    reasons.push(`Diplôme d'État obtenu en ${gradYear} (valide à partir de ${MIN_GRAD_YEAR})`)

  return { eligible: reasons.length === 0, average: avg, ageOnSept1: age, reasons }
}

function GradeInput({
  label,
  value,
  onChange,
  hasError,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hasError?: boolean
}) {
  const parsed = value !== '' ? parseFloat(value) : NaN
  const isValid = !isNaN(parsed)
  const passes = isValid && parsed >= MIN_GRADE

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <div
        className={`flex items-center rounded-md border-2 transition-colors ${
          hasError
            ? 'border-red-400'
            : isValid
            ? passes
              ? 'border-emerald-400'
              : 'border-red-300'
            : 'border-slate-200 focus-within:border-[#4EA6F5]'
        }`}
      >
        <input
          type="number"
          inputMode="decimal"
          min="0"
          max="100"
          step="0.5"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Ex: 75"
          className="w-full min-h-[52px] px-4 bg-transparent text-slate-800 font-medium text-base outline-none"
        />
        <span className="pr-4 text-slate-400 font-semibold select-none text-base">%</span>
        {isValid && (
          <div
            className={`mr-3 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              passes ? 'bg-emerald-100' : 'bg-red-100'
            }`}
          >
            {passes ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {hasError && <p className="text-xs text-red-500">Veuillez entrer une valeur entre 0 et 100.</p>}
    </div>
  )
}

export default function EligibilitePage() {
  const [step, setStep] = useState<Step>('grades')
  const [grades, setGrades] = useState<Grades>({ grade10: '', grade11: '', grade12: '', exetat: '' })
  const [profile, setProfile] = useState<Profile>({ dateOfBirth: '', graduationYear: '' })
  const [outcome, setOutcome] = useState<EligibilityOutcome | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const progress = step === 'grades' ? 50 : 100
  const stepLabel = step === 'grades' ? '1 sur 2' : '2 sur 2'

  function validateGrades(): boolean {
    const errs: Record<string, string> = {}
    const fields: (keyof Grades)[] = ['grade10', 'grade11', 'grade12', 'exetat']
    for (const f of fields) {
      const v = parseFloat(grades[f])
      if (grades[f] === '' || isNaN(v) || v < 0 || v > 100) errs[f] = 'invalid'
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
        setOutcome(checkEligibility(grades, profile))
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

  const filledGrades = gradeFields.filter(
    f => grades[f.key] !== '' && !isNaN(parseFloat(grades[f.key]))
  )
  const liveAvg =
    filledGrades.length > 0
      ? filledGrades.reduce((s, f) => s + parseFloat(grades[f.key]), 0) / filledGrades.length
      : null

  const gradYears = [
    { value: '2026', label: '2026' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023 ou avant' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">

      {/* ── Nav ── */}
      <nav className="bg-[#021463] h-16 flex items-center px-4 sm:px-6 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/ignito-logo-white.svg" alt="Ignito Academy" width={110} height={36} priority />
        </Link>
        <span className="ml-2.5 font-serif text-[12px] font-semibold tracking-widest text-white/55 hidden sm:block">
          ADMITTA
        </span>
      </nav>

      {/* ── Content ── */}
      <div className="flex-1 w-full max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#021463] mb-6 sm:mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Retour à l&apos;accueil
        </Link>

        {/* Progress (steps only) */}
        {step !== 'result' && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              <span>Étape {stepLabel}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: '#4EA6F5' }}
              />
            </div>
          </div>
        )}

        {/* ══════════════ STEP 1 — Grades ══════════════ */}
        {step === 'grades' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-7 space-y-5 sm:space-y-6">

              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4"
                  style={{ background: 'rgba(78,166,245,0.10)', color: '#4EA6F5' }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Résultats académiques
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#021463] leading-tight">
                  Vos résultats scolaires
                </h1>
                <p className="text-slate-500 text-sm mt-1.5">
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
                    hasError={!!errors[key]}
                  />
                ))}
              </div>

              {/* Live average */}
              {liveAvg !== null && (
                <div
                  className={`flex items-start gap-3 p-4 rounded-lg border ${
                    liveAvg >= MIN_GRADE
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  {liveAvg >= MIN_GRADE ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Moyenne provisoire&nbsp;:{' '}
                      <strong>{liveAvg.toFixed(1)}%</strong>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {liveAvg >= MIN_GRADE
                        ? 'Votre moyenne répond au critère minimum de 70%.'
                        : "La moyenne doit être d'au moins 70% pour la bourse."}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full bg-[#021463] hover:bg-[#031a80] text-white min-h-[52px] px-6 text-base font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ STEP 2 — Profile ══════════════ */}
        {step === 'profile' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-7 space-y-5 sm:space-y-6">

              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4"
                  style={{ background: 'rgba(78,166,245,0.10)', color: '#4EA6F5' }}
                >
                  Profil personnel
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#021463] leading-tight">
                  Votre profil
                </h1>
                <p className="text-slate-500 text-sm mt-1.5">
                  Ces informations permettent de vérifier votre éligibilité par rapport à l&apos;âge et à
                  l&apos;année d&apos;obtention.
                </p>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label
                  htmlFor="dob"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Date de naissance
                </label>
                <input
                  id="dob"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={e => {
                    setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))
                    if (errors.dateOfBirth) setErrors(prev => ({ ...prev, dateOfBirth: '' }))
                  }}
                  max={`${INTAKE_YEAR - 14}-12-31`}
                  className={`w-full min-h-[52px] px-4 rounded-md border-2 text-slate-800 font-medium text-base outline-none transition-colors bg-white appearance-none ${
                    errors.dateOfBirth
                      ? 'border-red-400'
                      : 'border-slate-200 focus:border-[#4EA6F5]'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
                )}
                <p className="text-xs text-slate-400 leading-relaxed">
                  L&apos;âge est calculé au 1er septembre {INTAKE_YEAR}. Le maximum autorisé est{' '}
                  {MAX_AGE_ON_SEPT_1} ans.
                </p>
              </div>

              {/* Graduation Year */}
              <div className="space-y-2">
                <label
                  htmlFor="gradYear"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Année d&apos;obtention du Diplôme d&apos;État
                </label>
                <div className="relative">
                  <select
                    id="gradYear"
                    value={profile.graduationYear}
                    onChange={e => {
                      setProfile(prev => ({ ...prev, graduationYear: e.target.value }))
                      if (errors.graduationYear) setErrors(prev => ({ ...prev, graduationYear: '' }))
                    }}
                    className={`w-full min-h-[52px] px-4 pr-10 rounded-md border-2 text-slate-800 font-medium text-base outline-none transition-colors bg-white appearance-none ${
                      errors.graduationYear
                        ? 'border-red-400'
                        : 'border-slate-200 focus:border-[#4EA6F5]'
                    }`}
                  >
                    <option value="">Sélectionnez une année</option>
                    {gradYears.map(y => (
                      <option key={y.value} value={y.value}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
                {errors.graduationYear && (
                  <p className="text-xs text-red-500">{errors.graduationYear}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
                <button
                  onClick={() => setStep('grades')}
                  className="w-full sm:w-auto flex-1 min-h-[52px] px-6 rounded-md border-2 border-slate-200 text-slate-600 font-semibold text-base bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Précédent
                </button>
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto flex-1 min-h-[52px] px-6 rounded-md bg-[#021463] hover:bg-[#031a80] text-white font-semibold text-base transition-colors flex items-center justify-center gap-2"
                >
                  Vérifier mon éligibilité <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ RESULT ══════════════ */}
        {step === 'result' && outcome && (
          <div className="space-y-4">
            {outcome.eligible ? (

              /* ── ELIGIBLE ── */
              <div className="bg-white rounded-xl border border-emerald-200 shadow-sm overflow-hidden">
                <div className="bg-emerald-500 px-5 sm:px-7 py-7 sm:py-8 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                    Vous êtes éligible !
                  </h1>
                  <p className="text-emerald-100 text-sm mt-2">
                    Bourse d&apos;Excellence — Cohorte Inaugurale
                  </p>
                </div>

                <div className="p-5 sm:p-7 space-y-5">
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                    Félicitations ! Votre profil académique correspond aux critères de la{' '}
                    <strong>Bourse d&apos;Excellence</strong> d&apos;Ignito Academy. Vous avez l&apos;opportunité
                    de rejoindre les <strong>20 boursiers de notre cohorte inaugurale</strong> et de
                    bénéficier d&apos;une prise en charge intégrale.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-3 sm:p-4 text-center border border-emerald-100">
                      <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                        {outcome.average.toFixed(1)}%
                      </p>
                      <p className="text-xs text-emerald-600 font-semibold mt-0.5">Moyenne générale</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 sm:p-4 text-center border border-emerald-100">
                      <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                        {outcome.ageOnSept1} ans
                      </p>
                      <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                        Âge au 1er sept. {INTAKE_YEAR}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-lg p-4 border border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Prochaine étape
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Déposez votre candidature complète et soumettez votre vidéo de motivation. Les places
                      sont limitées à 20 boursiers.
                    </p>
                  </div>

                  <a
                    href={`${AMS_URL}/apply?tab=dossier`}
                    className="bg-[#4EA6F5] hover:bg-[#3a92e0] text-white w-full min-h-[52px] px-6 rounded-md font-semibold text-base shadow-lg shadow-[#4EA6F5]/30 transition-colors flex items-center justify-center gap-2"
                  >
                    Postuler pour la Bourse d&apos;Excellence
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </a>

                  <Link
                    href="/"
                    className="w-full min-h-[48px] rounded-md border border-slate-200 text-slate-500 font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    Retour à l&apos;accueil
                  </Link>
                </div>
              </div>

            ) : (

              /* ── NOT ELIGIBLE ── */
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div
                  className="px-5 sm:px-7 py-7 sm:py-8 text-center"
                  style={{ background: '#021463' }}
                >
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(255,255,255,0.12)' }}
                  >
                    <BookOpen className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                    Pas éligible à la bourse
                  </h1>
                  <p className="text-white/60 text-sm mt-2">
                    Mais votre aventure Ignito Academy commence ici.
                  </p>
                </div>

                <div className="p-5 sm:p-7 space-y-5">
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                    Votre profil ne correspond pas aux critères de la Bourse d&apos;Excellence cette année.
                    Cependant, vous pouvez toujours{' '}
                    <strong>postuler comme candidat ordinaire</strong> et rejoindre Ignito Academy pour
                    obtenir votre Licence Britannique en 4 ans depuis la RDC.
                  </p>

                  {outcome.reasons.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Critères non remplis
                      </p>
                      {outcome.reasons.map((reason, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <XCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600 leading-relaxed">{reason}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className="rounded-lg p-4 sm:p-5 border"
                    style={{
                      background: 'rgba(78,166,245,0.06)',
                      borderColor: 'rgba(78,166,245,0.20)',
                    }}
                  >
                    <p className="text-sm font-semibold text-[#021463] mb-1">
                      Une place vous attend quand même
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Ignito Academy accepte des candidats ordinaires. Commencez par l&apos;Année
                      Préparatoire et obtenez votre Licence Britannique en 4 ans depuis Kinshasa — sans
                      visa, sans voyage.
                    </p>
                  </div>

                  <a
                    href={`${AMS_URL}/apply?tab=dossier`}
                    className="bg-[#4EA6F5] hover:bg-[#3a92e0] text-white w-full min-h-[52px] px-6 rounded-md font-semibold text-base shadow-lg shadow-[#4EA6F5]/30 transition-colors flex items-center justify-center gap-2"
                  >
                    Postuler comme candidat ordinaire
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </a>

                  <button
                    onClick={() => {
                      setStep('grades')
                      setGrades({ grade10: '', grade11: '', grade12: '', exetat: '' })
                      setProfile({ dateOfBirth: '', graduationYear: '' })
                      setOutcome(null)
                      setErrors({})
                    }}
                    className="w-full min-h-[48px] rounded-md border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    Recommencer le test
                  </button>

                  <Link
                    href="/"
                    className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors pt-1 min-h-[40px]"
                  >
                    <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        {step !== 'result' && (
          <p className="text-center text-xs text-slate-400 mt-5 px-2 leading-relaxed">
            Ce test est indicatif et non contractuel. L&apos;éligibilité définitive est vérifiée lors de
            l&apos;instruction de votre dossier.
          </p>
        )}
      </div>
    </div>
  )
}
