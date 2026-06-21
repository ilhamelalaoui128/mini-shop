import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleNextStep = (e) => {
    e.preventDefault()
    if (!fullName || !email) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      await signUp({ email, password, fullName })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="rounded-3xl border border-green-200 bg-green-50 p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800">Compte créé avec succès !</h2>
          <p className="mt-3 text-green-700">Vous allez être redirigé vers la connexion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-12">
      {/* Abstract Background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary-200/50 blur-[100px] translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-indigo-200/50 blur-[100px] -translate-x-1/3 translate-y-1/4"></div>
      </div>

      <div className="w-full max-w-md z-10 relative animate-slide-in">
        <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Créer un compte</h1>
            <p className="mt-2 text-sm text-gray-500">
              Étape {step} sur 2 • Rejoignez-nous !
            </p>
          </div>

          <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                    Nom complet
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-sm"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Adresse email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-sm"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-sm"
                    placeholder="Min. 6 caractères"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-sm transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-sm"
                    placeholder="Retaper le mot de passe"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-3">
              {step === 1 ? (
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                >
                  Suivant
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setError(''); setStep(1); }}
                    className="w-1/3 rounded-xl border border-gray-300 bg-white py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {loading ? 'Création...' : 'Créer le compte'}
                  </button>
                </div>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="font-bold text-primary-600 transition-colors hover:text-indigo-600">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
