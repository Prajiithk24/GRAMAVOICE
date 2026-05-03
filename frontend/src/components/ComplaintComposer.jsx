import { Mic, MicOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ComplaintComposer({
  mode,
  profile,
  draft,
  onDraftChange,
  onPreview,
  onSubmit,
}) {
  const [கேட்கிறது, setகேட்கிறது] = useState(false);
  const [ஆதரவு, setஆதரவு] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setஆதரவு(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ta-IN';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ');
      onDraftChange({ transcript, description: transcript });
    };
    recognition.onend = () => setகேட்கிறது(false);
    recognitionRef.current = recognition;
  }, [onDraftChange]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      return;
    }
    if (கேட்கிறது) {
      recognitionRef.current.stop();
      setகேட்கிறது(false);
      return;
    }
    recognitionRef.current.start();
    setகேட்கிறது(true);
  };

  return (
    <section className="அட்டை குறைஉருவாக்கி">
      <div className="அட்டை_மேல்">
        <h3>{mode === 'voice' ? 'குரல் வழி குறை பதிவு' : 'உரை வழி குறை பதிவு'}</h3>
        <p>தமிழில் தெளிவாக சொல்லுங்கள். முறைமை தானாக வகைபடுத்தும்.</p>
      </div>

      <div className="புலங்கள்">
        <label>
          <span>பெயர்</span>
          <input value={draft.citizenName || profile.பெயர்} onChange={(event) => onDraftChange({ citizenName: event.target.value })} />
        </label>
        <label>
          <span>கைபேசி எண்</span>
          <input value={draft.mobileNumber || profile.கைபேசி} onChange={(event) => onDraftChange({ mobileNumber: event.target.value })} />
        </label>
        <label>
          <span>குறை தலைப்பு</span>
          <input value={draft.subject || ''} onChange={(event) => onDraftChange({ subject: event.target.value })} placeholder="உதாரணம்: குடிநீர் வரவில்லை" />
        </label>
        <label>
          <span>ஊர்</span>
          <input value={draft.village || profile.ஊர்} onChange={(event) => onDraftChange({ village: event.target.value })} />
        </label>
        <label>
          <span>மாவட்டம்</span>
          <input value={draft.district || profile.மாவட்டம்} onChange={(event) => onDraftChange({ district: event.target.value })} />
        </label>
        <label>
          <span>இடம்</span>
          <input value={draft.locationArea || ''} onChange={(event) => onDraftChange({ locationArea: event.target.value })} placeholder="தெரு பெயர் அல்லது அருகிலுள்ள அடையாளம்" />
        </label>
      </div>

      {mode === 'voice' && (
        <div className="குரல்பலகை">
          <button type="button" className={`குரல்பொத்தான் ${கேட்கிறது ? 'செயலில்' : ''}`} onClick={toggleVoice} disabled={!ஆதரவு}>
            {கேட்கிறது ? <MicOff size={20} /> : <Mic size={20} />}
            <span>{ஆதரவு ? (கேட்கிறது ? 'பதிவை நிறுத்து' : 'பதிவை தொடங்கு') : 'இந்த உலாவியில் குரல் வசதி இல்லை'}</span>
          </button>
          <p>பின்னணி சத்தம் இல்லாமல் மெதுவாக பேசினால் துல்லியம் அதிகரிக்கும்.</p>
        </div>
      )}

      <label>
        <span>{mode === 'voice' ? 'மாற்றிய தமிழ் உரை' : 'குறை விவரம்'}</span>
        <textarea
          rows={7}
          value={mode === 'voice' ? draft.transcript || draft.description || '' : draft.description || ''}
          onChange={(event) => onDraftChange(mode === 'voice'
            ? { transcript: event.target.value, description: event.target.value }
            : { description: event.target.value })}
          placeholder="என்ன பிரச்சினை, எத்தனை நாட்களாக, யாருக்கு பாதிப்பு என்று தெளிவாக எழுதுங்கள்"
        />
      </label>

      <div className="செயற்பொத்தான்கள்">
        <button type="button" className="இரண்டாம்" onClick={onPreview}>முன்னோட்டம் பார்க்க</button>
        <button type="button" className="முதல்" onClick={onSubmit}>இப்போது பதிவு செய்</button>
      </div>
    </section>
  );
}
