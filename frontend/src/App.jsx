import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import AppShell from './components/AppShell';
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
import { தரவை_அனுப்பு, தரவை_பெறு, தரவை_புதுப்பி } from './lib/api';

function AppLayout({ currentPage }) {
  const navigate = useNavigate();
  const [roleView, setRoleView] = useState(currentPage.audience === 'நிர்வாகம்' ? 'நிர்வாகம்' : 'குடிமக்கள்');
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('grama-profile');
    return saved ? JSON.parse(saved) : தொடக்கபயனர்;
  });
  const [draft, setDraft] = useState({
    citizenName: தொடக்கபயனர்.பெயர்,
    mobileNumber: தொடக்கபயனர்.கைபேசி,
    village: தொடக்கபயனர்.ஊர்,
    district: தொடக்கபயனர்.மாவட்டம்,
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
  const [homeDashboard, setHomeDashboard] = useState(() => டாஷ்போர்டு_உருவாக்கு('கிராம குரல்', 'தமிழ் குறைதீர் தளம்', தொடக்ககுறைகள்));
  const [citizenDashboard, setCitizenDashboard] = useState(() => டாஷ்போர்டு_உருவாக்கு('குடிமக்கள் பலகை', 'என் பதிவுகள்', தொடக்ககுறைகள்.filter((item) => item.mobileNumber === தொடக்கபயனர்.கைபேசி)));
  const [adminDashboard, setAdminDashboard] = useState(() => டாஷ்போர்டு_உருவாக்கு('நிர்வாக முகப்பு', 'மொத்த குறைகள்', தொடக்ககுறைகள்));

  useEffect(() => {
    localStorage.setItem('grama-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [home, citizen, admin, complaintList, faqList, articleList, announcementList, categoryList, departmentList, notificationList] = await Promise.all([
          தரவை_பெறு('/dashboard/home'),
          தரவை_பெறு(`/dashboard/citizen?mobileNumber=${profile.கைபேசி}`),
          தரவை_பெறு('/dashboard/admin'),
          தரவை_பெறு('/complaints'),
          தரவை_பெறு('/content/faqs'),
          தரவை_பெறு('/content/articles'),
          தரவை_பெறு('/content/announcements'),
          தரவை_பெறு('/directory/categories'),
          தரவை_பெறு('/directory/departments'),
          தரவை_பெறு(`/complaints/notifications/${profile.கைபேசி}`),
        ]);
        if (!active) return;
        setHomeDashboard(home);
        setCitizenDashboard(citizen);
        setAdminDashboard(admin);
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
        setHomeDashboard(டாஷ்போர்டு_உருவாக்கு('கிராம குரல்', 'தமிழ் குறைதீர் தளம்', complaints));
        setCitizenDashboard(டாஷ்போர்டு_உருவாக்கு('குடிமக்கள் பலகை', 'என் பதிவுகள்', complaints.filter((item) => item.mobileNumber === profile.கைபேசி)));
        setAdminDashboard(டாஷ்போர்டு_உருவாக்கு('நிர்வாக முகப்பு', 'மொத்த குறைகள்', complaints));
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [profile.கைபேசி]);

  useEffect(() => {
    if (currentPage.audience !== '\u0b85\u0ba9\u0bc8\u0bb5\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bc1\u0bae\u0bcd') {
      setRoleView(currentPage.audience);
    }
  }, [currentPage.audience]);

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
    homeDashboard,
    citizenDashboard,
    adminDashboard,
  };

  return (
    <AppShell
      pages={அனைத்து_பக்கங்கள்}
      currentPage={currentPage}
      roleView={roleView}
      onRoleChange={setRoleView}
      profile={profile}
    >
      <PageRenderer page={currentPage} state={state} actions={actions} pages={அனைத்து_பக்கங்கள்} />
    </AppShell>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {அனைத்து_பக்கங்கள்.map((page) => (
          <Route key={page.path || '/'} path={page.path} element={<AppLayout currentPage={page} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
