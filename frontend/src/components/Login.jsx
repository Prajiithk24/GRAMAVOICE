import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { தரவை_அனுப்பு } from '../lib/api';

const ADMIN_DEPARTMENTS = [
  { code: 'ADMIN', username: 'admin', password: 'admin123', label: 'மாவட்ட நிர்வாகம் (மொத்த)' },
  { code: 'WATER', username: 'water', password: 'water123', label: 'குடிநீர் துறை' },
  { code: 'ELECTRICITY', username: 'electricity', password: 'electricity123', label: 'மின்சார துறை' },
  { code: 'ROADS', username: 'roads', password: 'roads123', label: 'சாலை மற்றும் போக்குவரத்து' },
  { code: 'MUNICIPAL', username: 'municipal', password: 'municipal123', label: 'ஊராட்சி / நகராட்சி' },
  { code: 'RATION', username: 'ration', password: 'ration123', label: 'ரேஷன் / உணவுப் பொருள்' },
  { code: 'GENERAL', username: 'general', password: 'general123', label: 'பொது சேவை மையம்' },
];

function profileFromUser(user) {
  return {
    பெயர்: user.fullName || user.username,
    கைபேசி: user.mobileNumber || '',
    ஊர்: user.village || '',
    மாவட்டம்: user.district || '',
  };
}

function saveSession(payload) {
  localStorage.setItem('auth-token', payload.token);
  localStorage.setItem('user', JSON.stringify(payload.user));
  localStorage.setItem('grama-profile', JSON.stringify(profileFromUser(payload.user)));
}

function isAdminRole(role) {
  return role === 'ADMIN' || role === 'OFFICER';
}

function Login() {
  const navigate = useNavigate();
  const [audience, setAudience] = useState(null);
  const [adminDept, setAdminDept] = useState(null);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    mobileNumber: '',
    village: '',
    district: '',
  });
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (patch) => setForm((current) => ({ ...current, ...patch }));

  const resetForm = () => {
    setForm({
      username: '',
      password: '',
      fullName: '',
      mobileNumber: '',
      village: '',
      district: '',
    });
    setStatus('');
  };

  const selectDepartment = (dept) => {
    setAdminDept(dept);
    setForm((current) => ({
      ...current,
      username: dept.username,
      password: '',
    }));
    setStatus('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus('');
    try {
      const payload = mode === 'login'
        ? { username: form.username, password: form.password }
        : form;
      const response = await தரவை_அனுப்பு(`/auth/${mode === 'login' ? 'login' : 'register'}`, payload);
      saveSession(response);
      navigate(isAdminRole(response.user.role) ? '/நிர்வாக-முகப்பு' : '/');
    } catch (error) {
      setStatus(error.response?.data?.message || 'உள்நுழைவு விவரங்களை சரிபார்க்கவும்.');
    } finally {
      setBusy(false);
    }
  };

  if (!audience) {
    return (
      <div className="login-page">
        <section className="login-panel" aria-label="Choose audience">
          <div className="login-brand">
            <div className="login-emblem">கு</div>
            <div>
              <p>தமிழ் குறைதீர் தளம்</p>
              <h2>கிராம குரல்</h2>
            </div>
          </div>
          <p className="login-intro-text">நீங்கள் யார் என்பதைத் தேர்வு செய்யுங்கள்</p>
          <div className="login-audience-grid">
            <button
              type="button"
              className="login-audience-card login-audience-citizen"
              onClick={() => {
                setAudience('citizen');
                resetForm();
              }}
            >
              <strong>குடிமக்கள்</strong>
              <span>குறை பதிவு, நிலை கண்காணிப்பு</span>
            </button>
            <button
              type="button"
              className="login-audience-card login-audience-admin"
              onClick={() => {
                setAudience('admin');
                resetForm();
              }}
            >
              <strong>நிர்வாகம் / துறை</strong>
              <span>துறை வாரியான உள்நுழைவு</span>
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (audience === 'admin' && !adminDept) {
    return (
      <div className="login-page">
        <section className="login-panel" aria-label="Choose department">
          <div className="login-brand">
            <div className="login-emblem">அ</div>
            <div>
              <p>நிர்வாக உள்நுழைவு</p>
              <h2>துறையைத் தேர்வு செய்யுங்கள்</h2>
            </div>
          </div>
          <div className="login-dept-grid">
            {ADMIN_DEPARTMENTS.map((dept) => (
              <button key={dept.code} type="button" className="login-dept-card" onClick={() => selectDepartment(dept)}>
                <strong>{dept.label}</strong>
                <span>பயனர்: {dept.username}</span>
              </button>
            ))}
          </div>
          <button type="button" className="login-back" onClick={() => setAudience(null)}>← பின்செல்</button>
        </section>
      </div>
    );
  }

  return (
    <div className="login-page">
      <section className="login-panel" aria-label="Login">
        <div className="login-brand">
          <div className="login-emblem">{audience === 'admin' ? 'அ' : 'கு'}</div>
          <div>
            <p>{audience === 'admin' ? adminDept?.label : 'குடிமக்கள் உள்நுழைவு'}</p>
            <h2>கிராம குரல் - பாதுகாப்பான உள்நுழைவு</h2>
          </div>
        </div>

        {audience === 'citizen' && (
          <div className="login-tabs" role="tablist" aria-label="Account mode">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>உள்நுழைவு</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>புதிய பயனர்</button>
          </div>
        )}

        {audience === 'admin' && adminDept && (
          <p className="login-hint">துறை கணக்கு: <strong>{adminDept.username}</strong> · கடவுச்சொல் உங்கள் துறை கடவுச்சொல்</p>
        )}

        <form className="login-form" onSubmit={submit}>
          <label>
            <span>பயனர் பெயர்</span>
            <input
              value={form.username}
              onChange={(event) => update({ username: event.target.value })}
              readOnly={audience === 'admin'}
              required
            />
          </label>
          <label>
            <span>கடவுச்சொல்</span>
            <input type="password" value={form.password} onChange={(event) => update({ password: event.target.value })} required />
          </label>

          {audience === 'citizen' && mode === 'register' && (
            <>
              <label>
                <span>முழு பெயர்</span>
                <input value={form.fullName} onChange={(event) => update({ fullName: event.target.value })} required />
              </label>
              <label>
                <span>கைபேசி எண்</span>
                <input value={form.mobileNumber} onChange={(event) => update({ mobileNumber: event.target.value })} pattern="\d{10}" required />
              </label>
              <label>
                <span>ஊர்</span>
                <input value={form.village} onChange={(event) => update({ village: event.target.value })} />
              </label>
              <label>
                <span>மாவட்டம்</span>
                <input value={form.district} onChange={(event) => update({ district: event.target.value })} />
              </label>
            </>
          )}

          {status && <p className="login-error">{status}</p>}

          <button type="submit" className="login-submit" disabled={busy}>
            {busy ? 'சரிபார்க்கிறது...' : 'உள்நுழை'}
          </button>
        </form>

        <button
          type="button"
          className="login-back"
          onClick={() => {
            if (audience === 'admin' && adminDept) {
              setAdminDept(null);
              resetForm();
            } else {
              setAudience(null);
              setAdminDept(null);
              resetForm();
            }
          }}
        >
          ← பின்செல்
        </button>
      </section>
    </div>
  );
}

export default Login;
