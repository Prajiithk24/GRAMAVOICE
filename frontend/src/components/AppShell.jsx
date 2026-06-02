import { NavLink } from 'react-router-dom';
import { AlertTriangle, Bell, BookOpen, CheckCircle2, FileText, Gauge, HelpCircle, Home, IdCard, Layers3, LocateFixed, Mic, Paperclip, Settings, Shield, SquarePen, Waves } from 'lucide-react';
import { useState } from 'react';

const சின்னங்கள் = {
  முகப்பு: Home,
  குரல்: Mic,
  உரை: SquarePen,
  பலகை: Gauge,
  கிளை: Layers3,
  இடம்: LocateFixed,
  புத்தகம்: BookOpen,
  பூட்டு: Shield,
  ஒலி: Bell,
  சுழல்: Settings,
  அலை: Waves,
  எச்சரிக்கை: AlertTriangle,
  அடையாளம்: IdCard,
  வினா: HelpCircle,
  கோப்பு: Paperclip,
  ஒப்புதல்: CheckCircle2,
};

function குழுபடுத்து(பக்கங்கள்) {
  return {
    'முதன்மை': பக்கங்கள்.filter((பக்கம்) => பக்கம்.audience === 'குடிமக்கள்' && பக்கம்.முக்கியம்),
    குடிமக்கள்: பக்கங்கள்.filter((பக்கம்) => பக்கம்.audience === 'குடிமக்கள்' && !பக்கம்.முக்கியம்),
    நிர்வாகம்: பக்கங்கள்.filter((பக்கம்) => பக்கம்.audience === 'நிர்வாகம்'),
    உதவி: பக்கங்கள்.filter((பக்கம்) => பக்கம்.audience === 'அனைவருக்கும்'),
  };
}

export default function AppShell({ pages, currentPage, roleView, onRoleChange, profile, isAdmin, children }) {
  const [தேடல், setதேடல்] = useState('');
  const குழுக்கள் = குழுபடுத்து(
    pages.filter((பக்கம்) => !பக்கம்.மறை && (!தேடல் || `${பக்கம்.title} ${பக்கம்.summary}`.includes(தேடல்))),
  );

  return (
    <div className="அமைப்பு">
      <aside className="பக்கப்பட்டி">
        <div className="முத்திரை">
          <div className="முத்திரை_சின்னம்">கி</div>
          <div>
            <h1>கிராம குரல்</h1>
            <p>தமிழில் பேசும் குறைதீர் தளம்</p>
          </div>
        </div>

        <input
          className="தேடுபெட்டி"
          placeholder="பக்கம் அல்லது சேவையைத் தேடுங்கள்"
          value={தேடல்}
          onChange={(event) => setதேடல்(event.target.value)}
        />

        <div className="பாத்திரமாற்றி">
          <button type="button" className={roleView === 'குடிமக்கள்' ? 'செயலில்' : ''} onClick={() => onRoleChange('குடிமக்கள்')}>
            குடிமக்கள்
          </button>
          {isAdmin && (
            <button type="button" className={roleView === 'நிர்வாகம்' ? 'செயலில்' : ''} onClick={() => onRoleChange('நிர்வாகம்')}>
              நிர்வாகம்
            </button>
          )}
        </div>

        {Object.entries(குழுக்கள்).map(([தலைப்பு, உருப்படிகள்]) => (
          உருப்படிகள்.length > 0 && (
            <section key={தலைப்பு} className="குழு">
              <p className="குழுத்தலைப்பு">{தலைப்பு}</p>
              <div className="இணைப்புகள்">
                {உருப்படிகள்
                  .filter((பக்கம்) => பக்கம்.audience === 'அனைவருக்கும்' || பக்கம்.audience === roleView || currentPage.audience === பக்கம்.audience)
                  .map((பக்கம்) => {
                    const Icon = சின்னங்கள்[பக்கம்.icon] || FileText;
                    return (
                      <NavLink key={பக்கம்.path} to={பக்கம்.path} className={({ isActive }) => `இணைப்பு ${isActive ? 'தற்போது' : ''}`}>
                        <Icon size={18} />
                        <span>{பக்கம்.title}</span>
                      </NavLink>
                    );
                  })}
              </div>
            </section>
          )
        ))}
      </aside>

      <div className="உள்ளடக்கப்பகுதி">
        <header className="மேல்பட்டி">
          <div>
            <p className="மேல்பட்டி_மென்மை">{currentPage.audience}</p>
            <h2>{currentPage.title}</h2>
          </div>
          <div className="பயனர்_சுருக்கம்">
            <div>
              <strong>{profile.பெயர்}</strong>
              <span>{profile.ஊர்}, {profile.மாவட்டம்}</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('auth-token');
                window.location.href = '/login';
              }}
              className="வெளியேறு_பொத்தான்"
            >
              வெளியேறு
            </button>
          </div>
        </header>

        <main className="பக்கஉள்ளடைவு">{children}</main>
      </div>
    </div>
  );
}
