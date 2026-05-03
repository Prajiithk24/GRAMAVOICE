const நிலைப்பெயர்கள் = {
  REGISTERED: 'பதிவு செய்யப்பட்டது',
  ROUTED: 'துறைக்கு அனுப்பப்பட்டது',
  IN_PROGRESS: 'செயலில் உள்ளது',
  FIELD_VISIT: 'தள ஆய்வு நடைபெறுகிறது',
  RESOLVED: 'தீர்வு வழங்கப்பட்டது',
  ESCALATED: 'மேல்நிலைக்கு உயர்த்தப்பட்டது',
  CLOSED: 'மூடப்பட்டது',
};

const முன்னுரிமைப்பெயர்கள் = {
  LOW: 'குறைந்த அவசரம்',
  MEDIUM: 'சாதாரண அவசரம்',
  HIGH: 'உயர் அவசரம்',
  CRITICAL: 'மிக உயர்ந்த அவசரம்',
};

export const வகைகள் = [
  { code: 'WATER_SHORTAGE', nameTa: 'குடிநீர் பற்றாக்குறை', departmentNameTa: 'குடிநீர் துறை', priorityCode: 'HIGH', keywordsTa: 'தண்ணீர்,குடிநீர்,குழாய்,பம்பு,தொட்டி' },
  { code: 'ELECTRICITY_OUTAGE', nameTa: 'மின்தடை மற்றும் இணைப்பு குறை', departmentNameTa: 'மின்சார துறை', priorityCode: 'CRITICAL', keywordsTa: 'மின்,மின்சாரம்,மின்தடை,கம்பம்,மின்விளக்கு' },
  { code: 'ROAD_DAMAGE', nameTa: 'சாலை சேதம்', departmentNameTa: 'சாலை மற்றும் போக்குவரத்து துறை', priorityCode: 'HIGH', keywordsTa: 'சாலை,குழி,பாதை,தார்,பேருந்து' },
  { code: 'SANITATION', nameTa: 'சுத்தம் மற்றும் கழிவுநீர்', departmentNameTa: 'ஊராட்சி மற்றும் நகராட்சி சேவை மையம்', priorityCode: 'MEDIUM', keywordsTa: 'குப்பை,கழிவுநீர்,வடிகால்,துர்நாற்றம்,சுத்தம்' },
  { code: 'STREETLIGHT', nameTa: 'தெருவிளக்கு குறை', departmentNameTa: 'ஊராட்சி மற்றும் நகராட்சி சேவை மையம்', priorityCode: 'MEDIUM', keywordsTa: 'தெருவிளக்கு,விளக்கு,இருள்' },
  { code: 'RATION_SUPPLY', nameTa: 'ரேஷன் விநியோக குறை', departmentNameTa: 'உணவுப் பொருள் வழங்கல் துறை', priorityCode: 'HIGH', keywordsTa: 'ரேஷன்,அரிசி,சர்க்கரை,விநியோகம்,அட்டை' },
];

export const துறைகள் = [
  { code: 'WATER', nameTa: 'குடிநீர் துறை', district: 'மதுரை', contactNumber: '18001231001', slaHours: 24, descriptionTa: 'குடிநீர், குழாய், பம்பு மற்றும் தொட்டி பராமரிப்பு' },
  { code: 'ELECTRICITY', nameTa: 'மின்சார துறை', district: 'மதுரை', contactNumber: '18001231002', slaHours: 12, descriptionTa: 'மின்விநியோகம், தெருவிளக்கு, பாதுகாப்பு தொடர்பான சேவை' },
  { code: 'ROADS', nameTa: 'சாலை மற்றும் போக்குவரத்து துறை', district: 'மதுரை', contactNumber: '18001231003', slaHours: 48, descriptionTa: 'சாலை சேதம், குழி, சீரமைப்பு, வழிச்சாலை குறைகள்' },
  { code: 'MUNICIPAL', nameTa: 'ஊராட்சி மற்றும் நகராட்சி சேவை மையம்', district: 'மதுரை', contactNumber: '18001231004', slaHours: 36, descriptionTa: 'சுத்தம், கழிவுநீர், தெருவிளக்கு மற்றும் பொது பராமரிப்பு' },
  { code: 'RATION', nameTa: 'உணவுப் பொருள் வழங்கல் துறை', district: 'மதுரை', contactNumber: '18001231005', slaHours: 24, descriptionTa: 'ரேஷன் பொருள், அட்டை, விநியோகம் மற்றும் கடை நிர்வாகம்' },
];

export const கேள்விகள் = [
  { id: 1, questionTa: 'குறை பதிவு செய்ய என்ன தகவல்கள் தேவை?', answerTa: 'பெயர், கைபேசி எண், இடம் மற்றும் குறை விவரம் போதுமானது.' },
  { id: 2, questionTa: 'தமிழில் குரல் பதிவு செய்ய முடியுமா?', answerTa: 'ஆம். குரல் பதிவு பொத்தானை அழுத்தி தெளிவாக தமிழில் பேசலாம்.' },
  { id: 3, questionTa: 'குறை எந்த துறைக்கு போகும் என்பதை நான் தேர்வு செய்ய வேண்டுமா?', answerTa: 'வேண்டாம். முறைமை தானாக வகைப்படுத்தி பொருத்தமான துறைக்கு அனுப்பும்.' },
  { id: 4, questionTa: 'குறை எண் இல்லையெனில் எப்படி கண்காணிப்பது?', answerTa: 'கைபேசி எண்ணைப் பயன்படுத்தியும் உங்கள் பதிவுகளைப் பார்க்கலாம்.' },
];

export const கட்டுரைகள் = [
  { id: 1, titleTa: 'குறை பதிவு செய்யும் சிறந்த நடைமுறை', summaryTa: 'இடம், பாதிப்பு அளவு, கால அளவு ஆகியவை தெளிவாக இருந்தால் தீர்வு வேகம் அதிகரிக்கும்.', contentTa: 'தெரு பெயர், அருகிலுள்ள அடையாளம், எத்தனை நாள் பிரச்சினை உள்ளது, யாருக்கு பாதிப்பு என்பதை சேர்த்து கூறுங்கள்.', audienceTa: 'அனைவருக்கும்' },
  { id: 2, titleTa: 'குரல் பதிவு துல்லியம் உயர்க்கும் வழி', summaryTa: 'பின்னணி சத்தம் குறைந்து, மெதுவாகவும் தெளிவாகவும் பேசினால் உரைமாற்றம் சிறப்பாக இருக்கும்.', contentTa: 'ஒரே புகாரை ஒரு பதிவில் சொல்லுங்கள். இடப்பெயர், காலம், பிரச்சினை ஆகியவற்றை பிரித்துச் சொல்லுங்கள்.', audienceTa: 'குடிமக்கள்' },
  { id: 3, titleTa: 'வகைப்பாடு மற்றும் துறை ஒதுக்கீடு', summaryTa: 'சொல் அடையாளம் மூலம் குறை தானாக வகைபடுத்தப்பட்டு துறைக்கு செல்கிறது.', contentTa: 'குடிநீர், மின்சாரம், சாலை, ரேஷன் போன்ற முக்கிய சொற்கள் அடிப்படையில் முறைமை வகையைத் தேர்வு செய்கிறது.', audienceTa: 'நிர்வாகம்' },
];

export const அறிவிப்புகள் = [
  { id: 1, titleTa: 'குடிநீர் வழங்கல் நேர மாற்றம்', contentTa: 'நாளை காலை ஆறு மணி முதல் எட்டு மணி வரை மட்டுமே குடிநீர் வழங்கப்படும்.', areaNameTa: 'சோழவந்தான்' },
  { id: 2, titleTa: 'தெருவிளக்கு பராமரிப்பு பணி', contentTa: 'பள்ளி தெருவில் இன்று இரவு ஒன்பது மணி வரை பராமரிப்பு பணி நடைபெறும்.', areaNameTa: 'அலங்காநல்லூர்' },
  { id: 3, titleTa: 'மக்கள் சந்திப்பு நாள்', contentTa: 'புதன்கிழமை தோறும் மக்கள் சந்திப்பு காலை பத்து மணி முதல் மதியம் ஒரு மணி வரை நடைபெறும்.', areaNameTa: 'மதுரை' },
];

export const தொடக்கபயனர் = {
  பெயர்: 'முத்துசாமி',
  கைபேசி: '9876543210',
  ஊர்: 'சோழவந்தான்',
  மாவட்டம்: 'மதுரை',
};

function நேரம்(முன்_மணி) {
  return new Date(Date.now() - முன்_மணி * 60 * 60 * 1000).toISOString();
}

export function உரையை_ஆய்வு_செய்(உரை) {
  const உள்ளீடு = (உரை || '').trim().toLowerCase();
  const முடிவு = வகைகள்
    .map((வகை) => {
      const சொற்கள் = வகை.keywordsTa.split(',').map((சொல்) => சொல்.trim());
      const பொருந்தியவை = சொற்கள்.filter((சொல்) => உள்ளீடு.includes(சொல்));
      return { வகை, மதிப்பெண்: பொருந்தியவை.length, பொருந்தியவை };
    })
    .sort((a, b) => b.மதிப்பெண் - a.மதிப்பெண்)[0];

  if (!முடிவு || முடிவு.மதிப்பெண் === 0) {
    return {
      categoryCode: 'GENERAL',
      categoryLabelTa: 'பொது குறை',
      departmentLabelTa: 'மக்கள் சேவை மையம்',
      priority: 'MEDIUM',
      confidenceScore: 0.42,
      matchedKeywords: ['பொது'],
    };
  }

  return {
    categoryCode: முடிவு.வகை.code,
    categoryLabelTa: முடிவு.வகை.nameTa,
    departmentLabelTa: முடிவு.வகை.departmentNameTa,
    priority: முடிவு.வகை.priorityCode,
    confidenceScore: Math.min(0.97, 0.45 + முடிவு.மதிப்பெண் * 0.13),
    matchedKeywords: முடிவு.பொருந்தியவை,
  };
}

export const தொடக்ககுறைகள் = [
  {
    id: 1,
    referenceNumber: 'GV260426100',
    citizenName: 'முத்துசாமி',
    mobileNumber: '9876543210',
    subjectTa: 'குடிநீர் வரவில்லை',
    descriptionTa: 'எங்கள் தெருவில் மூன்று நாட்களாக குடிநீர் வரவில்லை. குழந்தைகள் சிரமப்படுகின்றனர்.',
    transcriptTa: 'எங்கள் தெருவில் மூன்று நாட்களாக குடிநீர் வரவில்லை',
    locationArea: 'மேற்கு தெரு',
    village: 'சோழவந்தான்',
    district: 'மதுரை',
    sourceMode: 'VOICE',
    categoryCode: 'WATER_SHORTAGE',
    categoryLabelTa: 'குடிநீர் பற்றாக்குறை',
    departmentCode: 'WATER',
    departmentLabelTa: 'குடிநீர் துறை',
    assignedOfficerTa: 'பகுதி சேவை அலுவலர்',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    confidenceScore: 0.92,
    resolutionNoteTa: '',
    evidenceUrl: '',
    createdAt: நேரம்(48),
    updatedAt: நேரம்(12),
    timeline: [
      { id: 1, titleTa: 'குறை பதிவு செய்யப்பட்டது', noteTa: 'குடிமக்கள் குரல் பதிவு மூலம் பதிவு செய்யப்பட்டது', actorNameTa: 'முறைமை', status: 'REGISTERED', createdAt: நேரம்(48) },
      { id: 2, titleTa: 'துறைக்கு அனுப்பப்பட்டது', noteTa: 'குடிநீர் துறைக்கு தானாக ஒதுக்கப்பட்டது', actorNameTa: 'முறைமை', status: 'ROUTED', createdAt: நேரம்(47) },
      { id: 3, titleTa: 'செயலில் உள்ளது', noteTa: 'பம்பு ஆய்வு பணிக்காக குழு அனுப்பப்பட்டுள்ளது', actorNameTa: 'பகுதி அலுவலர்', status: 'IN_PROGRESS', createdAt: நேரம்(12) },
    ],
  },
  {
    id: 2,
    referenceNumber: 'GV260426101',
    citizenName: 'மலர்விழி',
    mobileNumber: '9876543211',
    subjectTa: 'தெருவிளக்கு எரியவில்லை',
    descriptionTa: 'பள்ளி அருகே தெருவிளக்கு இரண்டு நாட்களாக எரியவில்லை. இரவில் பயமாக இருக்கிறது.',
    transcriptTa: 'பள்ளி அருகே தெருவிளக்கு இரண்டு நாட்களாக எரியவில்லை',
    locationArea: 'பள்ளி தெரு',
    village: 'அலங்காநல்லூர்',
    district: 'மதுரை',
    sourceMode: 'VOICE',
    categoryCode: 'STREETLIGHT',
    categoryLabelTa: 'தெருவிளக்கு குறை',
    departmentCode: 'MUNICIPAL',
    departmentLabelTa: 'ஊராட்சி மற்றும் நகராட்சி சேவை மையம்',
    assignedOfficerTa: 'உதவி நிர்வாக அலுவலர்',
    status: 'ROUTED',
    priority: 'MEDIUM',
    confidenceScore: 0.86,
    resolutionNoteTa: '',
    evidenceUrl: '',
    createdAt: நேரம்(16),
    updatedAt: நேரம்(10),
    timeline: [
      { id: 4, titleTa: 'குறை பதிவு செய்யப்பட்டது', noteTa: 'குரல் மூலம் பதிவு செய்யப்பட்டது', actorNameTa: 'முறைமை', status: 'REGISTERED', createdAt: நேரம்(16) },
      { id: 5, titleTa: 'துறைக்கு அனுப்பப்பட்டது', noteTa: 'நகராட்சி பராமரிப்பு அணிக்குச் சென்றது', actorNameTa: 'முறைமை', status: 'ROUTED', createdAt: நேரம்(10) },
    ],
  },
];

export const தொடக்கஅறிவிப்புகள் = [
  { id: 1, mobileNumber: '9876543210', titleTa: 'குறை பதிவு வெற்றி', messageTa: 'GV260426100 குறை பதிவு செய்யப்பட்டது', referenceNumber: 'GV260426100', readFlag: false, createdAt: நேரம்(47) },
  { id: 2, mobileNumber: '9876543210', titleTa: 'தள ஆய்வு', messageTa: 'உங்கள் குறைக்கு தள ஆய்வு அணி அனுப்பப்பட்டுள்ளது', referenceNumber: 'GV260426100', readFlag: false, createdAt: நேரம்(12) },
  { id: 3, mobileNumber: '9876543211', titleTa: 'குறை பதிவு வெற்றி', messageTa: 'GV260426101 குறை பதிவு செய்யப்பட்டது', referenceNumber: 'GV260426101', readFlag: true, createdAt: நேரம்(15) },
];

export function டாஷ்போர்டு_உருவாக்கு(தலைப்பு, துணை, குறைகள்) {
  const நிலைவரைபடம் = Object.entries(
    குறைகள்.reduce((சேர்க்கை, குறை) => {
      const பெயர் = நிலைப்பெயர்கள்[குறை.status] || 'பதிவு';
      சேர்க்கை[பெயர்] = (சேர்க்கை[பெயர்] || 0) + 1;
      return சேர்க்கை;
    }, {}),
  ).map(([labelTa, value]) => ({ labelTa, value }));

  const வகைவரைபடம் = Object.entries(
    குறைகள்.reduce((சேர்க்கை, குறை) => {
      சேர்க்கை[குறை.categoryLabelTa] = (சேர்க்கை[குறை.categoryLabelTa] || 0) + 1;
      return சேர்க்கை;
    }, {}),
  ).map(([labelTa, value]) => ({ labelTa, value }));

  const தீர்வு = குறைகள்.filter((குறை) => குறை.status === 'RESOLVED').length;
  const செயலில் = குறைகள்.filter((குறை) => !['RESOLVED', 'CLOSED'].includes(குறை.status)).length;
  const அவசரம் = குறைகள்.filter((குறை) => ['HIGH', 'CRITICAL'].includes(குறை.priority)).length;

  return {
    titleTa: தலைப்பு,
    subtitleTa: துணை,
    cards: [
      { titleTa: 'மொத்த குறைகள்', valueTa: `${குறைகள்.length}`, noteTa: 'இதுவரை பதிவு செய்யப்பட்டவை' },
      { titleTa: 'தீர்வு பெற்றவை', valueTa: `${தீர்வு}`, noteTa: 'முடிக்கப்பட்ட பதிவுகள்' },
      { titleTa: 'செயலில் உள்ளவை', valueTa: `${செயலில்}`, noteTa: 'இன்னும் நடவடிக்கையில் உள்ளவை' },
      { titleTa: 'அவசர குறைகள்', valueTa: `${அவசரம்}`, noteTa: 'உடனடி கவனம் தேவைப்படுபவை' },
    ],
    statusChart: நிலைவரைபடம்,
    categoryChart: வகைவரைபடம்,
    recentComplaints: [...குறைகள்].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
  };
}

export function உள்ளூர்_குறை_உருவாக்கு(தரவு, profile) {
  const analysis = உரையை_ஆய்வு_செய்(தரவு.transcript || தரவு.description || '');
  const id = Date.now();
  return {
    id,
    referenceNumber: `GV${String(id).slice(-9)}`,
    citizenName: தரவு.citizenName || profile.பெயர்,
    mobileNumber: தரவு.mobileNumber || profile.கைபேசி,
    subjectTa: தரவு.subject || 'புதிய குறை பதிவு',
    descriptionTa: தரவு.description,
    transcriptTa: தரவு.transcript || தரவு.description,
    locationArea: தரவு.locationArea || 'இடம் குறிப்பிடப்படவில்லை',
    village: தரவு.village || profile.ஊர்,
    district: தரவு.district || profile.மாவட்டம்,
    sourceMode: தரவு.sourceMode || 'VOICE',
    categoryCode: analysis.categoryCode,
    categoryLabelTa: analysis.categoryLabelTa,
    departmentCode: analysis.categoryCode,
    departmentLabelTa: analysis.departmentLabelTa,
    assignedOfficerTa: 'பகுதி சேவை அலுவலர்',
    status: 'ROUTED',
    priority: analysis.priority,
    confidenceScore: analysis.confidenceScore,
    resolutionNoteTa: '',
    evidenceUrl: தரவு.evidenceUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      { id: id + 1, titleTa: 'குறை பதிவு செய்யப்பட்டது', noteTa: 'உங்கள் பதிவு பெறப்பட்டது', actorNameTa: 'முறைமை', status: 'REGISTERED', createdAt: new Date().toISOString() },
      { id: id + 2, titleTa: 'துறைக்கு அனுப்பப்பட்டது', noteTa: `${analysis.departmentLabelTa} துறைக்கு அனுப்பப்பட்டது`, actorNameTa: 'முறைமை', status: 'ROUTED', createdAt: new Date().toISOString() },
    ],
  };
}

export function உள்ளூர்_நிலை_புதுப்பி(குறைகள், குறைஅடையாளம், நிலை, குறிப்பு) {
  return குறைகள்.map((குறை) => {
    if (குறை.id !== குறைஅடையாளம்) {
      return குறை;
    }
    const காலவரிசை = [
      ...குறை.timeline,
      {
        id: Date.now(),
        titleTa: நிலைப்பெயர்கள்[நிலை] || 'நிலை மாற்றம்',
        noteTa: குறிப்பு || 'நிலை புதுப்பிக்கப்பட்டது',
        actorNameTa: 'அலுவலர்',
        status: நிலை,
        createdAt: new Date().toISOString(),
      },
    ];
    return {
      ...குறை,
      status: நிலை,
      updatedAt: new Date().toISOString(),
      timeline: காலவரிசை,
      resolutionNoteTa: நிலை === 'RESOLVED' ? குறிப்பு : குறை.resolutionNoteTa,
    };
  });
}

export function நிலைப்பெயர்(code) {
  return நிலைப்பெயர்கள்[code] || code;
}

export function முன்னுரிமைப்பெயர்(code) {
  return முன்னுரிமைப்பெயர்கள்[code] || code;
}
