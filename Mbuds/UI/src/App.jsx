import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Eye,
  EyeOff,
  Heart,
  Leaf,
  LockKeyhole,
  Mail,
  MessageCircleHeart,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { authService } from './authService'

const emptySignup = { name: '', email: '', phonenumber: '', otpMethod: 'Email' }

function App() {
  const [mode, setMode] = useState('signup')
  const [step, setStep] = useState(1)
  const [signup, setSignup] = useState(emptySignup)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [profile, setProfile] = useState({ nickname: '', password: '', image: null })
  const [signin, setSignin] = useState({ email: '', password: '' })
  const [preview, setPreview] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState(null)
  const [resendIn, setResendIn] = useState(30)
  const otpRefs = useRef([])

  useEffect(() => {
    if (step !== 2 || resendIn <= 0) return
    const timer = setInterval(() => setResendIn((value) => value - 1), 1000)
    return () => clearInterval(timer)
  }, [step, resendIn])

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  const passwordStrength = useMemo(() => {
    const value = profile.password
    return [
      value.length >= 8,
      /[A-Z]/.test(value) && /[a-z]/.test(value),
      /\d/.test(value),
      /[^A-Za-z0-9]/.test(value),
    ].filter(Boolean).length
  }, [profile.password])

  const run = async (action, success) => {
    setLoading(true)
    setNotice(null)
    try {
      await action()
      success()
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const submitSignup = (event) => {
    event.preventDefault()
    run(() => authService.signup(signup), () => {
      setStep(2)
      setResendIn(30)
      setNotice({ type: 'success', text: `We sent a 6-digit code via ${signup.otpMethod}.` })
    })
  }

  const submitOtp = (event) => {
    event.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      setNotice({ type: 'error', text: 'Please enter the complete 6-digit code.' })
      return
    }
    run(() => authService.verifyOtp(code), () => {
      setStep(3)
      setNotice(null)
    })
  }

  const submitProfile = (event) => {
    event.preventDefault()
    run(() => authService.createProfile(profile), () => {
      setMode('signin')
      setStep(1)
      setNotice({ type: 'success', text: 'Your space is ready. Sign in to continue.' })
    })
  }

  const submitSignin = (event) => {
    event.preventDefault()
    run(() => authService.signin(signin), () => {
      setNotice({ type: 'success', text: 'Welcome back — taking you to your space…' })
    })
  }

  const changeOtp = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    setOtp((current) => current.map((item, i) => (i === index ? digit : item)))
    if (digit && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setStep(1)
    setNotice(null)
  }

  return (
    <main className="page-shell">
      <section className="story-panel">
        <div className="brand">
          <span className="brand-mark"><MessageCircleHeart size={25} strokeWidth={2.1} /></span>
          <span>MoodBuds</span>
        </div>

        <div className="story-copy">
          <span className="eyebrow"><Sparkles size={15} /> Your feelings belong here</span>
          <h1>A softer place to be <em>yourself.</em></h1>
          <p>
            Check in with your emotions, grow at your own pace, and feel a little less
            alone—one honest moment at a time.
          </p>
          <div className="quote-card">
            <div className="avatar-stack">
              <span className="mini-avatar coral">A</span>
              <span className="mini-avatar green">M</span>
              <span className="mini-avatar blue">S</span>
            </div>
            <div>
              <strong>12,000+ gentle check-ins</strong>
              <span>shared by our growing community</span>
            </div>
          </div>
        </div>

        <div className="floating-card mood-card">
          <span className="mood-icon">☀️</span>
          <div><small>Today feels</small><strong>A little lighter</strong></div>
        </div>
        <div className="floating-card safety-card">
          <ShieldCheck size={19} />
          <span>Private by design</span>
        </div>
        <span className="shape shape-one" />
        <span className="shape shape-two" />
        <span className="shape shape-three" />

        <footer>Made with <Heart size={13} fill="currentColor" /> for your peace of mind</footer>
      </section>

      <section className="auth-panel">
        <div className="mobile-brand">
          <span className="brand-mark"><MessageCircleHeart size={22} /></span>
          MoodBuds
        </div>

        <div className="auth-card">
          {mode === 'signup' && step > 1 && (
            <button className="back-button" onClick={() => { setStep((value) => value - 1); setNotice(null) }}>
              <ArrowLeft size={17} /> Back
            </button>
          )}

          {mode === 'signup' && (
            <div className="stepper" aria-label={`Step ${step} of 3`}>
              {[1, 2, 3].map((item) => (
                <span key={item} className={item <= step ? 'active' : ''}>
                  {item < step ? <Check size={13} /> : item}
                </span>
              ))}
            </div>
          )}

          {mode === 'signup' && step === 1 && (
            <form onSubmit={submitSignup}>
              <Heading title="Create your calm corner" text="A few details and your space will be ready." />
              <Field label="Your name" icon={<UserRound />} required>
                <input
                  value={signup.name}
                  onChange={(event) => setSignup({ ...signup, name: event.target.value })}
                  placeholder="What should we call you?"
                  autoComplete="name"
                  required
                />
              </Field>
              <Field label="Email address" icon={<Mail />} required>
                <input
                  type="email"
                  value={signup.email}
                  onChange={(event) => setSignup({ ...signup, email: event.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field label="Phone number" icon={<Phone />} required>
                <input
                  type="tel"
                  value={signup.phonenumber}
                  onChange={(event) => setSignup({ ...signup, phonenumber: event.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  minLength="10"
                  required
                />
              </Field>

              <div className="field-group">
                <label>Where should we send your code?</label>
                <div className="method-grid">
                  {[
                    ['Email', Mail, 'Send it to my inbox'],
                    ['SMS', Phone, 'Text my mobile'],
                  ].map(([value, Icon, caption]) => (
                    <button
                      type="button"
                      key={value}
                      className={`method-option ${signup.otpMethod === value ? 'selected' : ''}`}
                      onClick={() => setSignup({ ...signup, otpMethod: value })}
                    >
                      <span className="radio-dot" />
                      <Icon size={20} />
                      <span><strong>{value}</strong><small>{caption}</small></span>
                    </button>
                  ))}
                </div>
              </div>
              <Notice notice={notice} />
              <SubmitButton loading={loading}>Continue <ArrowRight size={18} /></SubmitButton>
              <SwitchText text="Already have a space?" action="Sign in" onClick={() => switchMode('signin')} />
            </form>
          )}

          {mode === 'signup' && step === 2 && (
            <form onSubmit={submitOtp}>
              <div className="hero-icon"><Mail /></div>
              <Heading title="Check your messages" text={`Enter the code we sent to ${signup.otpMethod === 'Email' ? maskEmail(signup.email) : `••••••${signup.phonenumber.slice(-4)}`}.`} />
              <div className="otp-row" onPaste={(event) => {
                const code = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
                if (code.length) {
                  event.preventDefault()
                  setOtp(Array.from({ length: 6 }, (_, index) => code[index] || ''))
                  otpRefs.current[Math.min(code.length, 5)]?.focus()
                }
              }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => { otpRefs.current[index] = element }}
                    value={digit}
                    onChange={(event) => changeOtp(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Backspace' && !digit && index > 0) otpRefs.current[index - 1]?.focus()
                    }}
                    inputMode="numeric"
                    aria-label={`Digit ${index + 1}`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <div className="resend">
                Didn’t get it?{' '}
                <button type="button" disabled={resendIn > 0} onClick={submitSignup}>
                  {resendIn > 0 ? `Resend in 0:${String(resendIn).padStart(2, '0')}` : 'Resend code'}
                </button>
              </div>
              <Notice notice={notice} />
              <SubmitButton loading={loading}>Verify code <ArrowRight size={18} /></SubmitButton>
            </form>
          )}

          {mode === 'signup' && step === 3 && (
            <form onSubmit={submitProfile}>
              <Heading title="Make it feel like you" text="Add the finishing touches to your profile." />
              <label className="avatar-upload">
                <input type="file" accept="image/png,image/jpeg" onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  if (preview) URL.revokeObjectURL(preview)
                  setProfile({ ...profile, image: file })
                  setPreview(URL.createObjectURL(file))
                }} />
                <span className="avatar-preview">
                  {preview ? <img src={preview} alt="Profile preview" /> : <UserRound />}
                  <i><Camera size={15} /></i>
                </span>
                <span><strong>Add a profile photo</strong><small>PNG or JPG, up to 5MB</small></span>
              </label>
              <Field label="Nickname" icon={<Sparkles />} required>
                <input
                  value={profile.nickname}
                  onChange={(event) => setProfile({ ...profile, nickname: event.target.value })}
                  placeholder="How should your buds know you?"
                  required
                />
              </Field>
              <Field label="Create a password" icon={<LockKeyhole />} required>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={profile.password}
                  onChange={(event) => setProfile({ ...profile, password: event.target.value })}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength="8"
                  required
                />
                <button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </Field>
              <div className="strength">
                <div>{[1, 2, 3, 4].map((value) => <span key={value} className={value <= passwordStrength ? `on level-${passwordStrength}` : ''} />)}</div>
                <small>{['Use a mix of letters, numbers & symbols', 'A start', 'Getting stronger', 'Strong password', 'Excellent password'][passwordStrength]}</small>
              </div>
              <Notice notice={notice} />
              <SubmitButton loading={loading}>Create my space <Leaf size={18} /></SubmitButton>
            </form>
          )}

          {mode === 'signin' && (
            <form onSubmit={submitSignin}>
              <div className="hero-icon"><Leaf /></div>
              <Heading title="Welcome back" text="Your calm corner has been waiting for you." />
              <Field label="Email address" icon={<Mail />} required>
                <input
                  type="email"
                  value={signin.email}
                  onChange={(event) => setSignin({ ...signin, email: event.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field label="Password" icon={<LockKeyhole />} required>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signin.password}
                  onChange={(event) => setSignin({ ...signin, password: event.target.value })}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                />
                <button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </Field>
              <button className="forgot-link" type="button">Forgot password?</button>
              <Notice notice={notice} />
              <SubmitButton loading={loading}>Sign in <ArrowRight size={18} /></SubmitButton>
              <SwitchText text="New to MoodBuds?" action="Create your space" onClick={() => switchMode('signup')} />
            </form>
          )}

          <div className="privacy-note"><ShieldCheck size={15} /> Your details are encrypted and always yours.</div>
        </div>
      </section>
    </main>
  )
}

function Heading({ title, text }) {
  return <header className="form-heading"><h2>{title}</h2><p>{text}</p></header>
}

function Field({ label, icon, children, required }) {
  return (
    <div className="field-group">
      <label>{label}{required && <span>*</span>}</label>
      <div className="input-wrap"><i>{icon}</i>{children}</div>
    </div>
  )
}

function SubmitButton({ loading, children }) {
  return <button className="primary-button" type="submit" disabled={loading}>{loading ? <span className="spinner" /> : children}</button>
}

function SwitchText({ text, action, onClick }) {
  return <p className="switch-text">{text} <button type="button" onClick={onClick}>{action}</button></p>
}

function Notice({ notice }) {
  if (!notice) return null
  return <div className={`notice ${notice.type}`}>{notice.type === 'success' ? <Check size={16} /> : '!'} {notice.text}</div>
}

function maskEmail(email) {
  const [name = '', domain = ''] = email.split('@')
  return `${name.slice(0, 2)}${'•'.repeat(Math.max(name.length - 2, 2))}@${domain}`
}

export default App
