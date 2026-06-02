import { CheckCircle2, Mic, MicOff, Sparkles, Wand2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { உரையை_ஆய்வு_செய் } from '../lib/mockData';

function சுருக்கு(உரை) {
  return (உரை || '')
    .replace(/\s+/g, ' ')
    .replace(/[.!,;:]+/g, ' ')
    .trim();
}

function தலைப்பு_உருவாக்கு(உரை, ஆய்வு) {
  const சொற்கள் = சுருக்கு(உரை).split(' ').filter(Boolean);
  if (சொற்கள்.length >= 3) {
    return சொற்கள்.slice(0, 7).join(' ');
  }
  return ஆய்வு.categoryLabelTa === 'பொது குறை' ? 'புதிய குறை பதிவு' : ஆய்வு.categoryLabelTa;
}

function இடம்_கண்டறி(உரை, profile) {
  const பொருத்தம் = சுருக்கு(உரை).match(/([\u0B80-\u0BFF\s]{2,24})(தெரு|பகுதி|அருகே|சாலை|ஊர்|கிராமம்)/);
  if (!பொருத்தம்) {
    return '';
  }
  return `${பொருத்தம்[1]}${பொருத்தம்[2]}`.trim() || profile.ஊர்;
}

function aiகுறை_உருவாக்கு(உரை, profile, analysis) {
  const சுத்தஉரை = சுருக்கு(உரை);
  const ஆய்வு = analysis || உரையை_ஆய்வு_செய்(சுத்தஉரை);
  const தலைப்பு = தலைப்பு_உருவாக்கு(சுத்தஉரை, ஆய்வு);
  const இடம் = இடம்_கண்டறி(சுத்தஉரை, profile);
  const விவரம் = சுத்தஉரை
    ? `${profile.ஊர்} பகுதியில் ${சுத்தஉரை}. இந்த குறையை ஆய்வு செய்து விரைவாக நடவடிக்கை எடுக்க வேண்டுகிறேன்.`
    : '';

  return {
    subject: தலைப்பு,
    description: விவரம்,
    transcript: சுத்தஉரை,
    locationArea: இடம்,
    analysis: ஆய்வு,
  };
}

export default function ComplaintComposer({
  mode,
  profile,
  draft,
  analysis,
  analysisLoading,
  onDraftChange,
  onPreview,
  onSubmit,
}) {
  const [கேட்கிறது, setகேட்கிறது] = useState(false);
  const [aiசெய்தி, setAiசெய்தி] = useState('');
  const [micError, setMicError] = useState('');
  const [ஆதரவு] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const recognitionRef = useRef(null);
  const userStoppedRef = useRef(true);
  const listeningRef = useRef(false);
  const streamRef = useRef(null);
  const restartTimerRef = useRef(null);

  const stopMicStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition || !listeningRef.current) {
      return;
    }
    try {
      recognition.start();
      setகேட்கிறது(true);
    } catch {
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
      restartTimerRef.current = setTimeout(() => {
        if (listeningRef.current) {
          startRecognition();
        }
      }, 350);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return undefined;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ta-IN';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setMicError('');
      setகேட்கிறது(true);
      setAiசெய்தி('கேட்கிறது... தமிழில் பேசுங்கள். நிறுத்தும் வரை மைக் இயங்கும்.');
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let index = 0; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
        if (index < event.results.length - 1) {
          transcript += ' ';
        }
      }
      onDraftChange({ transcript: transcript.trim(), description: transcript.trim() });
      setAiசெய்தி('குரல் பதிவு நடைபெறுகிறது');
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' && listeningRef.current && !userStoppedRef.current) {
        setAiசெய்தி('குரல் கேட்கப்படவில்லை. தொடர்ந்து பேசுங்கள்...');
        return;
      }
      const map = {
        'not-allowed': 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. Browser address bar-ல் mic அனுமதியை Allow செய்யவும்.',
        'service-not-allowed': 'குரல் சேவை அனுமதிக்கப்படவில்லை. Chrome/Edge பயன்படுத்தவும்.',
        'audio-capture': 'மைக்ரோஃபோன் கிடைக்கவில்லை.',
        aborted: 'குரல் பதிவு நிறுத்தப்பட்டது.',
      };
      if (event.error !== 'aborted' || userStoppedRef.current) {
        const message = map[event.error] || `குரல் பிழை: ${event.error}`;
        setMicError(message);
        setAiசெய்தி(message);
      }
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        listeningRef.current = false;
        userStoppedRef.current = true;
        setகேட்கிறது(false);
        stopMicStream();
      }
    };

    recognition.onend = () => {
      if (listeningRef.current && !userStoppedRef.current) {
        startRecognition();
        return;
      }
      setகேட்கிறது(false);
    };

    recognitionRef.current = recognition;
    return () => {
      userStoppedRef.current = true;
      listeningRef.current = false;
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
      recognition.stop();
      stopMicStream();
      recognitionRef.current = null;
    };
  }, [onDraftChange]);

  const toggleVoice = async () => {
    if (!recognitionRef.current) {
      return;
    }
    if (கேட்கிறது) {
      userStoppedRef.current = true;
      listeningRef.current = false;
      recognitionRef.current.stop();
      stopMicStream();
      setகேட்கிறது(false);
      setAiசெய்தி('கேட்பது நிறுத்தப்பட்டது.');
      return;
    }
    try {
      setMicError('');
      userStoppedRef.current = false;
      listeningRef.current = true;
      if (navigator?.mediaDevices?.getUserMedia) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      startRecognition();
    } catch {
      userStoppedRef.current = true;
      listeningRef.current = false;
      setMicError('மைக்ரோஃபோன் அனுமதி தரப்படவில்லை. Chrome/Edge-ல் Allow செய்யவும்.');
      setAiசெய்தி('மைக்ரோஃபோன் அனுமதி தரப்படவில்லை.');
      setகேட்கிறது(false);
    }
  };

  const உரை = draft.transcript || draft.description || '';
  const hasVoiceTranscript = Boolean((draft.transcript || '').trim());
  const shouldClassify = mode === 'voice' ? hasVoiceTranscript : Boolean(உரை.trim());
  const ஆய்வு = shouldClassify ? analysis : null;
  const நிறைவு = [
    Boolean(draft.citizenName || profile.பெயர்),
    Boolean(draft.mobileNumber || profile.கைபேசி),
    Boolean(draft.subject),
    Boolean(draft.description || draft.transcript),
    Boolean(draft.locationArea),
  ].filter(Boolean).length;

  const aiஉருவாக்கு = () => {
    if (!shouldClassify) {
      setAiசெய்தி('முதலில் தமிழில் பேசி உரை உருவாக்குங்கள்.');
      return;
    }
    const முடிவு = aiகுறை_உருவாக்கு(உரை, profile, analysis);
    onDraftChange({
      subject: draft.subject || முடிவு.subject,
      description: முடிவு.description || draft.description,
      transcript: முடிவு.transcript || draft.transcript,
      locationArea: draft.locationArea || முடிவு.locationArea,
      village: draft.village || profile.ஊர்,
      district: draft.district || profile.மாவட்டம்,
    });
    setAiசெய்தி('AI உதவி குறையை பதிவு செய்யத் தயாரான வடிவமாக மாற்றியது');
  };

  return (
    <section className="அட்டை குறைஉருவாக்கி குரல்_முதன்மை">
      <div className="அட்டை_மேல் குரல்_தலைப்பு">
        <div>
          <p className="சிறுகுறிப்பு">தமிழ் குரல் பெறுநர் + AI குறை உருவாக்கி</p>
          <h3>{mode === 'voice' ? 'குரலில் சொல்லுங்கள், குறை தானாக உருவாகும்' : 'தமிழில் குறை விவரத்தை எழுதுங்கள்'}</h3>
          <p>தமிழில் பேசும் உரையை முறைமை கேட்டு, சுருக்கி, வகைபடுத்தி, துறைக்கு அனுப்பத் தயாராக்கும்.</p>
        </div>
        <div className="ai_நிலை">
          <Sparkles size={18} />
          <span>
            {analysisLoading
              ? 'ஆய்வு நடைபெறுகிறது...'
              : ஆய்வு
                ? `${Math.round(ஆய்வு.confidenceScore * 100)}% நம்பகத்தன்மை`
                : 'குரல் உள்ளீட்டை காத்திருக்கிறது'}
          </span>
        </div>
      </div>

      {mode === 'voice' && (
        <div className="குரல்பலகை பெரிய_குரல்பலகை">
          <button type="button" className={`குரல்பொத்தான் பெரிய_குரல்பொத்தான் ${கேட்கிறது ? 'செயலில்' : ''}`} onClick={toggleVoice} disabled={!ஆதரவு}>
            {கேட்கிறது ? <MicOff size={26} /> : <Mic size={26} />}
            <span>{ஆதரவு ? (கேட்கிறது ? 'கேட்கிறது - நிறுத்து' : 'தமிழில் பேச தொடங்கு') : 'இந்த உலாவியில் குரல் வசதி இல்லை'}</span>
          </button>
          <p>பிரச்சினை, இடம், எத்தனை நாட்கள், யாருக்கு பாதிப்பு என்பதை இயல்பாக தமிழில் சொல்லுங்கள்.</p>
          {micError && <p className="mic-error">{micError}</p>}
        </div>
      )}

      <div className="ai_பலகை">
        <button type="button" className="ai_பொத்தான்" onClick={aiஉருவாக்கு} disabled={!shouldClassify}>
          <Wand2 size={18} />
          <span>AI குறை உருவாக்கு</span>
        </button>
        <div className="ai_சுருக்கம்">
          <strong>{ஆய்வு ? ஆய்வு.categoryLabelTa : 'வகைப்பாடு இன்னும் தொடங்கவில்லை'}</strong>
          <span>
            {ஆய்வு
              ? `${ஆய்வு.departmentLabelTa} · ${ஆய்வு.priority}`
              : 'குரல்/உரை உள்ளிட்ட பின் வகை மற்றும் தீவிரம் காட்டப்படும்'}
          </span>
        </div>
        {aiசெய்தி && <p>{aiசெய்தி}</p>}
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

      <div className="தயார்_பட்டி">
        {['பயனர்', 'கைபேசி', 'தலைப்பு', 'குறை உரை', 'இடம்'].map((item, index) => (
          <span key={item} className={index < நிறைவு ? 'முடிந்தது' : ''}>
            <CheckCircle2 size={15} />
            {item}
          </span>
        ))}
      </div>

      <div className="செயற்பொத்தான்கள்">
        <button type="button" className="இரண்டாம்" onClick={onPreview}>முன்னோட்டம் பார்க்க</button>
        <button type="button" className="முதல்" onClick={onSubmit}>இப்போது பதிவு செய்</button>
      </div>
    </section>
  );
}
