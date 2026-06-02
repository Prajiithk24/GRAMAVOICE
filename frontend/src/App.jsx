import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import AppShell from './components/AppShell';
import Login from './components/Login';
import PageRenderer from './pages/PageRenderer';
import { அனைத்து_பக்கங்கள் } from './data/pageCatalog';
import {
  அறிவிப்புகள் as நிலைஅறிவிப்புகள்,
  உள்ளூர்_குறை_உருவாக்கு,
  உள்ளூர்_நிலை_புதுப்பி,
  கட்டுரைகள்,
  கேள்விகள்,
  தொடக்கஅறிவிப்புகள்,
  தொடக்ககுறைகள்,
  தொடக்கபயனர்,
  துறைகள்,
  டாஷ்போர்டு_உருவாக்கு,
  வகைகள்,
} from './lib/mockData';
import { குறை_ஆய்வு_செய், தரவை_அனுப்பு, தரவை_பெறு, தரவை_புதுப்பி } from './lib/api';
import { உரையை_ஆய்வு_செய் } from './lib/mockData';

const அனைவருக்கும் = 'அனைவருக்கும்';
const நிர்வாகம் = 'நிர்வாகம்';

function தற்போதையபயனர்() {
  const savedUser = localStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null;
}

function பயனரிலிருந்து_சுயவிவரம்(user) {
  return {
    பெயர்: user?.fullName || user?.username || தொடக்கபயனர்.பெயர்,
    கைபேசி: user?.mobileNumber || தொடக்கபயனர்.கைபேசி,
    ஊர்: user?.village || தொடக்கபயனர்.ஊர்,
    மாவட்டம்: user?.district || தொடக்கபயனர்.மாவட்டம்,
  };
}

function பலகைகளை_உருவாக்கு(complaintList, mobileNumber) {
  return {
    home: டாஷ்போர்டு_உருவாக்கு('கிராம குரல்', 'தமிழ் குறைதீர் தளம்', complaintList),
    citizen: டாஷ்போர்டு_உருவாக்கு('குடிமக்கள் பலகை', 'என் பதிவுகள்', complaintList.filter((item) => item.mobileNumber === mobileNumber)),
    admin: டாஷ்போர்டு_உருவாக்கு('நிர்வாக முகப்பு', 'மொத்த குறைகள்', complaintList),
  };
}

function AppLayout({ currentPage }) {
  const navigate = useNavigate();
  const user = தற்போதையபயனர்();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'OFFICER';
  const [roleView, setRoleView] = useState(() => {
    if (user) return isAdmin ? 'நிர்வாகம்' : 'குடிமக்கள்';
    return currentPage.audience === 'நிர்வாகம்' ? 'நிர்வாகம்' : 'குடிமக்கள்';
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('grama-profile');
    return saved ? JSON.parse(saved) : பயனரிலிருந்து_சுயவிவரம்(user);
  });
  const [draft, setDraft] = useState({
    citizenName: profile.பெயர்,
    mobileNumber: profile.கைபேசி,
    village: profile.ஊர்,
    district: profile.மாவட்டம்,
    description: '',
    transcript: '',
    subject: '',
    locationArea: '',
    evidenceUrl: '',
  });
  const [complaints, setComplaints] = useState(தொடக்ககுறைகள்);
  const [notifications, setNotifications] = useState(தொடக்கஅறிவிப்புகள்.filter((item) => item.mobileNumber === தொடக்கபயனர்.கைபேசி));
  const [selectedComplaintId, setSelectedComplaintId] = useState(தொடக்ககுறைகள்[0]?.id || null);
  const [latestComplaint, setLatestComplaint] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [faqs, setFaqs] = useState(கேள்விகள்);
  const [articles, setArticles] = useState(கட்டுரைகள்);
  const [announcements, setAnnouncements] = useState(நிலைஅறிவிப்புகள்);
  const [categories, setCategories] = useState(வகைகள்);
  const [departments, setDepartments] = useState(துறைகள்);
  const [draftAnalysis, setDraftAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('grama-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const text = (draft.transcript || draft.description || '').trim();
    if (text.length < 8) {
      setDraftAnalysis(null);
      return undefined;
    }

    let active = true;
    const timer = setTimeout(async () => {
      setAnalysisLoading(true);
      try {
        const result = await குறை_ஆய்வு_செய்(text);
        if (!active) return;
        setDraftAnalysis({
          categoryCode: result.categoryCode,
          categoryLabelTa: result.categoryLabelTa,
          departmentLabelTa: result.departmentLabelTa,
          priority: result.priority,
          confidenceScore: result.confidenceScore,
          matchedKeywords: result.matchedKeywords || [],
          analysisSource: result.analysisSource,
        });
      } catch {
        if (!active) return;
        setDraftAnalysis(உரையை_ஆய்வு_செய்(text));
      } finally {
        if (active) {
          setAnalysisLoading(false);
        }
      }
    }, 700);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [draft.transcript, draft.description]);

  useEffect(() => {
    setDraft((current) => ({
      ...current,
      citizenName: current.citizenName || profile.பெயர்,
      mobileNumber: current.mobileNumber || profile.கைபேசி,
      village: current.village || profile.ஊர்,
      district: current.district || profile.மாவட்டம்,
    }));
  }, [profile]);

  useEffect(() => {
    if (currentPage.audience === நிர்வாகம் && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [currentPage.audience, isAdmin, navigate]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [complaintList, faqList, articleList, announcementList, categoryList, departmentList, notificationList] = await Promise.all([
          தரவை_பெறு('/complaints'),
          தரவை_பெறு('/content/faqs'),
          தரவை_பெறு('/content/articles'),
          தரவை_பெறு('/content/announcements'),
          தரவை_பெறு('/directory/categories'),
          தரவை_பெறு('/directory/departments'),
          தரவை_பெறு(`/complaints/notifications/${profile.கைபேசி}`),
        ]);
        if (!active) return;
        setComplaints(complaintList);
        setFaqs(faqList);
        setArticles(articleList);
        setAnnouncements(announcementList);
        setCategories(categoryList);
        setDepartments(departmentList);
        setNotifications(notificationList);
        if (complaintList[0]) {
          setSelectedComplaintId(complaintList[0].id);
        }
      } catch {
        if (!active) return;
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [profile.கைபேசி]);

  const activeRoleView = currentPage.audience === அனைவருக்கும் ? roleView : currentPage.audience;
  const dashboards = useMemo(() => பலகைகளை_உருவாக்கு(complaints, profile.கைபேசி), [complaints, profile.கைபேசி]);

  const actions = useMemo(() => ({
    updateProfile: (patch) => setProfile((current) => ({ ...current, ...patch })),
    updateDraft: (patch) => setDraft((current) => ({ ...current, ...patch })),
    setSelectedComplaintId,
    setFeedback,
    updateStatus: async (id, status, note) => {
      try {
        const updated = await தரவை_புதுப்பி(`/complaints/${id}`, { status, note, actorName: 'அலுவலர்', resolutionNote: status === 'RESOLVED' ? note : '' });
        setComplaints((current) => current.map((item) => (item.id === id ? updated : item)));
        setSelectedComplaintId(id);
      } catch {
        setComplaints((current) => உள்ளூர்_நிலை_புதுப்பி(current, id, status, note));
      }
    },
    submitComplaint: async () => {
      const payload = {
        citizenName: draft.citizenName || profile.பெயர்,
        mobileNumber: draft.mobileNumber || profile.கைபேசி,
        subject: draft.subject || 'புதிய குறை பதிவு',
        description: draft.description || draft.transcript,
        transcript: draft.transcript || draft.description,
        village: draft.village || profile.ஊர்,
        district: draft.district || profile.மாவட்டம்,
        locationArea: draft.locationArea,
        evidenceUrl: draft.evidenceUrl || '',
        sourceMode: draft.transcript ? 'VOICE' : 'TEXT',
      };
      try {
        const created = await தரவை_அனுப்பு('/complaints', payload);
        setLatestComplaint(created);
        setComplaints((current) => [created, ...current]);
        setSelectedComplaintId(created.id);
        const refreshedNotifications = await தரவை_பெறு(`/complaints/notifications/${payload.mobileNumber}`);
        setNotifications(refreshedNotifications);
      } catch {
        const created = உள்ளூர்_குறை_உருவாக்கு(payload, profile);
        setLatestComplaint(created);
        setComplaints((current) => [created, ...current]);
        setSelectedComplaintId(created.id);
        setNotifications((current) => [
          {
            id: Date.now(),
            mobileNumber: payload.mobileNumber,
            titleTa: 'குறை பதிவு வெற்றி',
            messageTa: `${created.referenceNumber} என்ற எண்ணில் உங்கள் குறை பதிவு செய்யப்பட்டது`,
            referenceNumber: created.referenceNumber,
            readFlag: false,
            createdAt: new Date().toISOString(),
          },
          ...current,
        ]);
      }
      setDraft({
        citizenName: profile.பெயர்,
        mobileNumber: profile.கைபேசி,
        village: profile.ஊர்,
        district: profile.மாவட்டம்,
        description: '',
        transcript: '',
        subject: '',
        locationArea: '',
        evidenceUrl: '',
      });
      navigate('/அனுப்புதல்-வெற்றி');
    },
  }), [draft, navigate, profile]);

  const state = {
    user,
    isAdmin,
    profile,
    draft,
    complaints,
    notifications,
    selectedComplaintId,
    latestComplaint,
    feedback,
    faqs,
    articles,
    announcements,
    categories,
    departments,
    homeDashboard: dashboards.home,
    citizenDashboard: dashboards.citizen,
    adminDashboard: dashboards.admin,
    draftAnalysis,
    analysisLoading,
  };

  return (
    <AppShell
      pages={அனைத்து_பக்கங்கள்}
      currentPage={currentPage}
      roleView={activeRoleView}
      onRoleChange={setRoleView}
      profile={profile}
      isAdmin={isAdmin}
    >
      <PageRenderer page={currentPage} state={state} actions={actions} pages={அனைத்து_பக்கங்கள்} />
    </AppShell>
  );
}

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('auth-token');
  return user && token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {அனைத்து_பக்கங்கள்.map((page) => (
          <Route key={page.path || '/'} path={page.path} element={<ProtectedRoute><AppLayout currentPage={page} /></ProtectedRoute>} />
        ))}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
