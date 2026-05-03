import { Link, useNavigate } from 'react-router-dom';
import ChartPanel from '../components/ChartPanel';
import ComplaintComposer from '../components/ComplaintComposer';
import ComplaintTable from '../components/ComplaintTable';
import TimelinePanel from '../components/TimelinePanel';
import { துறைகள், டாஷ்போர்டு_உருவாக்கு, நிலைப்பெயர், முன்னுரிமைப்பெயர், உரையை_ஆய்வு_செய் } from '../lib/mockData';

function அட்டைவரிசை(cards) {
  return (
    <div className="அட்டைக்கூட்டம்">
      {cards.map((card) => (
        <article key={card.titleTa} className="அட்டை எண்_அட்டை">
          <p>{card.titleTa}</p>
          <strong>{card.valueTa}</strong>
          <span>{card.noteTa}</span>
        </article>
      ))}
    </div>
  );
}

function சுருக்கஅட்டை({ title, description, links = [] }) {
  return (
    <section className="அட்டை நெடுஅட்டை">
      <div className="அட்டை_மேல்">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {links.length > 0 && (
        <div className="இணைப்பு_கட்டம்">
          {links.map((item) => (
            <Link key={item.to} className="செயல்_இணைப்பு" to={item.to}>
              <strong>{item.title}</strong>
              <span>{item.note}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function நாள்(மதிப்பு) {
  return new Intl.DateTimeFormat('ta-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(மதிப்பு));
}

export default function PageRenderer({ page, state, actions, pages }) {
  const navigate = useNavigate();
  const selectedComplaint = state.complaints.find((item) => item.id === state.selectedComplaintId) || state.complaints[0];
  const draftAnalysis = உரையை_ஆய்வு_செய்(state.draft.description || state.draft.transcript || '');
  const homeDashboard = state.homeDashboard || டாஷ்போர்டு_உருவாக்கு('முகப்பு', 'தமிழ் குறைதீர் தளம்', state.complaints);
  const citizenDashboard = state.citizenDashboard || homeDashboard;
  const adminDashboard = state.adminDashboard || homeDashboard;

  if (page.kind === 'home') {
    return (
      <>
        <section className="வீரம்">
          <div className="வீரம்_உரை">
            <p className="சிறுகுறிப்பு">குரல், தமிழ், தானியங்கி துறை ஒதுக்கீடு</p>
            <h3>எழுதத் தெரியாவிட்டாலும் பேசுங்கள். குறை பதிவு உடனே தொடங்கும்.</h3>
            <p className="வீரம்_விளக்கம்">
              கிராம மற்றும் நகர்ப்புற மக்களுக்கு எளிதில் பயன்படுத்தக்கூடிய, தமிழ் குரல் ஆதரவு கொண்ட,
              துறைவாரி குறை ஒதுக்கீடு அமைப்பு.
            </p>
            <div className="செயற்பொத்தான்கள்">
              <button type="button" className="முதல்" onClick={() => navigate('/குரல்-குறை-பதிவு')}>குரல் பதிவு தொடங்கு</button>
              <button type="button" className="இரண்டாம்" onClick={() => navigate('/நிலை-கண்காணிப்பு')}>நிலை பார்க்க</button>
            </div>
          </div>
          <div className="வீரம்_எண்கள்">
            {அட்டைவரிசை(homeDashboard.cards)}
          </div>
        </section>

        <div className="இரண்டு_நெடுவரிசை">
          <ChartPanel title="நிலை வாரியான பகிர்வு" data={homeDashboard.statusChart} />
          <ChartPanel title="வகை வாரியான பகிர்வு" data={homeDashboard.categoryChart} type="pie" />
        </div>

        <ComplaintTable complaints={homeDashboard.recentComplaints} onSelect={actions.setSelectedComplaintId} />

        <div className="மூன்று_நெடுவரிசை">
          {state.announcements.slice(0, 3).map((item) => (
            <article key={item.id} className="அட்டை">
              <div className="அட்டை_மேல்">
                <h3>{item.titleTa}</h3>
                <p>{item.areaNameTa}</p>
              </div>
              <p>{item.contentTa}</p>
            </article>
          ))}
        </div>
      </>
    );
  }

  if (page.kind === 'auth') {
    return (
      <div className="இரண்டு_நெடுவரிசை">
        <section className="அட்டை">
          <div className="அட்டை_மேல்">
            <h3>{page.title}</h3>
            <p>{page.summary}</p>
          </div>
          <div className="புலங்கள்">
            <label>
              <span>பெயர்</span>
              <input value={state.profile.பெயர்} onChange={(event) => actions.updateProfile({ பெயர்: event.target.value })} />
            </label>
            <label>
              <span>கைபேசி எண்</span>
              <input value={state.profile.கைபேசி} onChange={(event) => actions.updateProfile({ கைபேசி: event.target.value })} />
            </label>
            <label>
              <span>ஊர்</span>
              <input value={state.profile.ஊர்} onChange={(event) => actions.updateProfile({ ஊர்: event.target.value })} />
            </label>
            <label>
              <span>மாவட்டம்</span>
              <input value={state.profile.மாவட்டம்} onChange={(event) => actions.updateProfile({ மாவட்டம்: event.target.value })} />
            </label>
          </div>
          <div className="செயற்பொத்தான்கள்">
            <button type="button" className="முதல்" onClick={() => navigate(page.audience === 'நிர்வாகம்' ? '/நிர்வாக-முகப்பு' : '/குடிமக்கள்-பலகை')}>தொடர்க</button>
          </div>
        </section>
        {சுருக்கஅட்டை({
          title: 'வேகமான செயல்முறை',
          description: 'தமிழில் பேசலாம், உரையாக்கலாம், துறைக்கு தானாக ஒதுக்கலாம், பின்னர் நிலையை கண்காணிக்கலாம்.',
          links: [
            { to: '/குரல்-குறை-பதிவு', title: 'குரல் பதிவு', note: 'உடனடி குறை பதிவு' },
            { to: '/அடிக்கடி-கேள்விகள்', title: 'கேள்விகள்', note: 'பொது உதவி விளக்கம்' },
            { to: '/அறிவு-மையம்', title: 'அறிவு மையம்', note: 'சரியான பதிவு வழிகாட்டி' },
          ],
        })}
      </div>
    );
  }

  if (page.kind === 'citizenDashboard') {
    return (
      <>
        {அட்டைவரிசை(citizenDashboard.cards)}
        <div className="இரண்டு_நெடுவரிசை">
          <ChartPanel title="உங்கள் நிலை பகிர்வு" data={citizenDashboard.statusChart} />
          <ChartPanel title="உங்கள் குறை வகைகள்" data={citizenDashboard.categoryChart} type="pie" />
        </div>
        <div className="இரண்டு_நெடுவரிசை">
          {சுருக்கஅட்டை({
            title: 'விரைவு செயல்கள்',
            description: 'ஒரே தொடுதலில் பொதுவாக பயன்படும் சேவைகளைத் திறக்கலாம்.',
            links: [
              { to: '/குரல்-குறை-பதிவு', title: 'குரல் குறை பதிவு', note: 'தமிழில் பேசுங்கள்' },
              { to: '/நிலை-கண்காணிப்பு', title: 'நிலை கண்காணிப்பு', note: 'குறை முன்னேற்றம் பாருங்கள்' },
              { to: '/அறிவிப்புகள்', title: 'அறிவிப்புகள்', note: 'சமீபத்திய தகவல்கள்' },
            ],
          })}
          {சுருக்கஅட்டை({
            title: 'சேவை பிரிவுகள்',
            description: 'அதிகம் பயன்படுத்தப்படும் குறைத் தலைப்புகளுக்கு நேரடி அணுகல்.',
            links: pages
              .filter((item) => ['குடிநீர்', 'மின்சாரம்', 'சாலை'].includes(item.title))
              .map((item) => ({ to: item.path, title: item.title, note: item.summary })),
          })}
        </div>
        <ComplaintTable complaints={state.complaints.filter((item) => item.mobileNumber === state.profile.கைபேசி)} onSelect={actions.setSelectedComplaintId} />
      </>
    );
  }

  if (page.kind === 'adminDashboard') {
    return (
      <>
        {அட்டைவரிசை(adminDashboard.cards)}
        <div className="இரண்டு_நெடுவரிசை">
          <ChartPanel title="நிலை வாரியான மொத்த ஓட்டம்" data={adminDashboard.statusChart} />
          <ChartPanel title="வகை வாரியான அழுத்தம்" data={adminDashboard.categoryChart} type="pie" />
        </div>
        <ComplaintTable complaints={adminDashboard.recentComplaints} onSelect={actions.setSelectedComplaintId} />
      </>
    );
  }

  if (page.kind === 'voiceComplaint' || page.kind === 'textComplaint') {
    return (
      <div className="இரண்டு_நெடுவரிசை">
        <ComplaintComposer
          mode={page.kind === 'voiceComplaint' ? 'voice' : 'text'}
          profile={state.profile}
          draft={state.draft}
          onDraftChange={actions.updateDraft}
          onPreview={() => navigate('/குறை-ஆய்வு')}
          onSubmit={actions.submitComplaint}
        />
        <section className="அட்டை">
          <div className="அட்டை_மேல்">
            <h3>தானியங்கி ஆய்வு</h3>
            <p>உங்கள் உரையில் இருந்து முறைமை கண்டறியும் முன்னோட்டம்</p>
          </div>
          <div className="தகவல்பட்டி">
            <div><span>கண்டறியப்பட்ட வகை</span><strong>{draftAnalysis.categoryLabelTa}</strong></div>
            <div><span>ஒதுக்கப்படும் துறை</span><strong>{draftAnalysis.departmentLabelTa}</strong></div>
            <div><span>முன்னுரிமை</span><strong>{முன்னுரிமைப்பெயர்(draftAnalysis.priority)}</strong></div>
            <div><span>நம்பகத்தன்மை</span><strong>{Math.round(draftAnalysis.confidenceScore * 100)}%</strong></div>
          </div>
        </section>
      </div>
    );
  }

  if (page.kind === 'attachments') {
    return (
      <div className="attachment-grid">
        <section className="attachment-panel">
          <div className="attachment-head">
            <h3>{'ஆதார இணைப்புகள்'}</h3>
            <p>{'புகைப்படம், வீடியோ, கோப்பு அல்லது மேகஇணைப்பு இங்கு சேர்க்கலாம்.'}</p>
          </div>
          <label className="attachment-field">
            <span>{'ஆதார இணைப்பு'}</span>
            <input
              value={state.draft.evidenceUrl || ''}
              onChange={(event) => actions.updateDraft({ evidenceUrl: event.target.value })}
              placeholder={'https:// அல்லது கோப்பு இணைப்பு'}
            />
          </label>
          <article className="attachment-preview">
            <p>{state.draft.evidenceUrl || 'இப்போது வரை ஆதார இணைப்பு சேர்க்கப்படவில்லை.'}</p>
          </article>
          <div className="attachment-actions">
            <button type="button" className="attachment-button attachment-button-secondary" onClick={() => navigate('/\u0b95\u0bc1\u0bb1\u0bc8-\u0b86\u0baf\u0bcd\u0bb5\u0bc1')}>
              {'முன்னோட்டம் பார்க்க'}
            </button>
            <button type="button" className="attachment-button attachment-button-primary" onClick={actions.submitComplaint}>
              {'ஆதாரத்துடன் அனுப்பு'}
            </button>
          </div>
        </section>
        <section className="attachment-panel">
          <div className="attachment-head">
            <h3>{'உதவிக் குறிப்பு'}</h3>
            <p>{'ஆதாரம் இருந்தால் துறையின் நடவடிக்கை வேகமாகும்.'}</p>
          </div>
          <div className="attachment-tips">
            <div>{'படத்தில் இடம் தெளிவாக தெரிய வேண்டும்.'}</div>
            <div>{'பகல் நேரம் எடுத்த படம் துல்லியமாக உதவும்.'}</div>
            <div>{'ஒரு வாக்கியத்தில் பிரச்சினை என்ன என்று கூறுங்கள்.'}</div>
          </div>
        </section>
      </div>
    );
  }

  if (page.kind === 'review') {
    return (
      <div className="இரண்டு_நெடுவரிசை">
        <section className="அட்டை">
          <div className="அட்டை_மேல்">
            <h3>அனுப்பும் முன் சரிபார்க்கவும்</h3>
            <p>குறை விவரங்கள், துறை, இடம், தொடர்பு ஆகியவை சரியாக உள்ளதா பார்க்கவும்.</p>
          </div>
          <div className="தகவல்பட்டி">
            <div><span>பெயர்</span><strong>{state.draft.citizenName || state.profile.பெயர்}</strong></div>
            <div><span>கைபேசி</span><strong>{state.draft.mobileNumber || state.profile.கைபேசி}</strong></div>
            <div><span>தலைப்பு</span><strong>{state.draft.subject || 'புதிய குறை பதிவு'}</strong></div>
            <div><span>வகை</span><strong>{draftAnalysis.categoryLabelTa}</strong></div>
            <div><span>துறை</span><strong>{draftAnalysis.departmentLabelTa}</strong></div>
            <div><span>இடம்</span><strong>{state.draft.locationArea || 'குறிப்பிடப்படவில்லை'}</strong></div>
          </div>
          <article className="மென்மைஅட்டை">
            <p>{state.draft.description || state.draft.transcript || 'இன்னும் விவரம் இல்லை'}</p>
          </article>
          <div className="செயற்பொத்தான்கள்">
            <button type="button" className="இரண்டாம்" onClick={() => navigate('/குரல்-குறை-பதிவு')}>திருத்து</button>
            <button type="button" className="முதல்" onClick={actions.submitComplaint}>இப்போது அனுப்பு</button>
          </div>
        </section>
        <TimelinePanel
          timeline={[
            { id: 1, titleTa: 'குரல் அல்லது உரை பெறப்பட்டது', noteTa: 'உங்கள் உள்ளீடு பதிவு செய்யப்பட்டுள்ளது', actorNameTa: 'முறைமை', status: 'REGISTERED', createdAt: new Date().toISOString() },
            { id: 2, titleTa: 'வகை கண்டறிதல்', noteTa: `${draftAnalysis.categoryLabelTa} என முறைமை கண்டறிந்துள்ளது`, actorNameTa: 'முறைமை', status: 'ROUTED', createdAt: new Date().toISOString() },
          ]}
        />
      </div>
    );
  }

  if (page.kind === 'success') {
    return (
      <section className="அட்டை வெற்றிப்பக்கம்">
        <div className="அட்டை_மேல்">
          <h3>குறை வெற்றிகரமாக பதிவு செய்யப்பட்டது</h3>
          <p>அடுத்த நிலைகளை இந்த எண்ணை கொண்டு கண்காணிக்கலாம்.</p>
        </div>
        {state.latestComplaint ? (
          <div className="தகவல்பட்டி">
            <div><span>குறை எண்</span><strong>{state.latestComplaint.referenceNumber}</strong></div>
            <div><span>வகை</span><strong>{state.latestComplaint.categoryLabelTa}</strong></div>
            <div><span>துறை</span><strong>{state.latestComplaint.departmentLabelTa}</strong></div>
            <div><span>நிலை</span><strong>{நிலைப்பெயர்(state.latestComplaint.status)}</strong></div>
          </div>
        ) : <p>சமீபத்திய பதிவு இங்கு காட்டப்படும்.</p>}
        <div className="செயற்பொத்தான்கள்">
          <button type="button" className="முதல்" onClick={() => navigate('/நிலை-கண்காணிப்பு')}>நிலை பார்க்க</button>
          <button type="button" className="இரண்டாம்" onClick={() => navigate('/என்-குறைகள்')}>என் குறைகள்</button>
        </div>
      </section>
    );
  }

  if (page.kind === 'complaintList') {
    const personal = state.complaints.filter((item) => item.mobileNumber === state.profile.கைபேசி);
    return <ComplaintTable complaints={personal} onSelect={actions.setSelectedComplaintId} />;
  }

  if (page.kind === 'complaintDetail') {
    return selectedComplaint ? (
      <div className="இரண்டு_நெடுவரிசை">
        <section className="அட்டை">
          <div className="அட்டை_மேல்">
            <h3>{selectedComplaint.subjectTa}</h3>
            <p>{selectedComplaint.referenceNumber}</p>
          </div>
          <div className="தகவல்பட்டி">
            <div><span>வகை</span><strong>{selectedComplaint.categoryLabelTa}</strong></div>
            <div><span>துறை</span><strong>{selectedComplaint.departmentLabelTa}</strong></div>
            <div><span>நிலை</span><strong>{நிலைப்பெயர்(selectedComplaint.status)}</strong></div>
            <div><span>முன்னுரிமை</span><strong>{முன்னுரிமைப்பெயர்(selectedComplaint.priority)}</strong></div>
            <div><span>பதிவு நேரம்</span><strong>{நாள்(selectedComplaint.createdAt)}</strong></div>
            <div><span>இடம்</span><strong>{selectedComplaint.locationArea}</strong></div>
          </div>
          <article className="மென்மைஅட்டை">
            <p>{selectedComplaint.descriptionTa}</p>
          </article>
          {page.audience === 'நிர்வாகம்' && (
            <div className="செயற்பொத்தான்கள்">
              <button type="button" className="இரண்டாம்" onClick={() => actions.updateStatus(selectedComplaint.id, 'IN_PROGRESS', 'குழு பணியில் ஈடுபடுத்தப்பட்டது')}>செயலில் மாற்று</button>
              <button type="button" className="முதல்" onClick={() => actions.updateStatus(selectedComplaint.id, 'RESOLVED', 'சேவை நிறைவு செய்யப்பட்டது')}>தீர்வு பதிவு செய்</button>
            </div>
          )}
        </section>
        <TimelinePanel timeline={selectedComplaint.timeline} />
      </div>
    ) : (
      <section className="அட்டை"><p>குறை தேர்வு செய்யப்படவில்லை.</p></section>
    );
  }

  if (page.kind === 'complaintTimeline') {
    return selectedComplaint ? <TimelinePanel timeline={selectedComplaint.timeline} /> : <section className="அட்டை"><p>குறை தகவல் இல்லை.</p></section>;
  }

  if (page.kind === 'tracker') {
    return (
      <div className="இரண்டு_நெடுவரிசை">
        <section className="அட்டை">
          <div className="அட்டை_மேல்">
            <h3>குறை நிலை கண்காணிப்பு</h3>
            <p>சமீபத்திய பதிவு தானாக கீழே காட்டப்படுகிறது. வேறு பதிவை பட்டியலில் தேர்வு செய்யலாம்.</p>
          </div>
          {selectedComplaint && (
            <div className="தகவல்பட்டி">
              <div><span>குறை எண்</span><strong>{selectedComplaint.referenceNumber}</strong></div>
              <div><span>தற்போதைய நிலை</span><strong>{நிலைப்பெயர்(selectedComplaint.status)}</strong></div>
              <div><span>துறை</span><strong>{selectedComplaint.departmentLabelTa}</strong></div>
              <div><span>கடைசி புதுப்பிப்பு</span><strong>{நாள்(selectedComplaint.updatedAt)}</strong></div>
            </div>
          )}
        </section>
        <ComplaintTable complaints={state.complaints.filter((item) => item.mobileNumber === state.profile.கைபேசி)} onSelect={actions.setSelectedComplaintId} />
      </div>
    );
  }

  if (page.kind === 'notifications') {
    return (
      <div className="மூன்று_நெடுவரிசை">
        {state.notifications.map((item) => (
          <article key={item.id} className="அட்டை">
            <div className="அட்டை_மேல்">
              <h3>{item.titleTa}</h3>
              <p>{item.referenceNumber}</p>
            </div>
            <p>{item.messageTa}</p>
            <span>{நாள்(item.createdAt)}</span>
          </article>
        ))}
      </div>
    );
  }

  if (page.kind === 'profile') {
    return (
      <section className="அட்டை">
        <div className="அட்டை_மேல்">
          <h3>என் விவரங்கள்</h3>
          <p>இந்த தகவல்கள் புதிய குறை பதிவுகளில் முன்பூர்த்தி செய்யப்படும்.</p>
        </div>
        <div className="புலங்கள்">
          <label><span>பெயர்</span><input value={state.profile.பெயர்} onChange={(event) => actions.updateProfile({ பெயர்: event.target.value })} /></label>
          <label><span>கைபேசி</span><input value={state.profile.கைபேசி} onChange={(event) => actions.updateProfile({ கைபேசி: event.target.value })} /></label>
          <label><span>ஊர்</span><input value={state.profile.ஊர்} onChange={(event) => actions.updateProfile({ ஊர்: event.target.value })} /></label>
          <label><span>மாவட்டம்</span><input value={state.profile.மாவட்டம்} onChange={(event) => actions.updateProfile({ மாவட்டம்: event.target.value })} /></label>
        </div>
      </section>
    );
  }

  if (page.kind === 'faq') {
    return (
      <div className="மூன்று_நெடுவரிசை">
        {state.faqs.map((item) => (
          <article key={item.id} className="அட்டை">
            <div className="அட்டை_மேல்">
              <h3>{item.questionTa}</h3>
            </div>
            <p>{item.answerTa}</p>
          </article>
        ))}
      </div>
    );
  }

  if (page.kind === 'articles') {
    return (
      <div className="மூன்று_நெடுவரிசை">
        {state.articles.map((item) => (
          <article key={item.id} className="அட்டை">
            <div className="அட்டை_மேல்">
              <h3>{item.titleTa}</h3>
              <p>{item.audienceTa}</p>
            </div>
            <p>{item.summaryTa}</p>
            <article className="மென்மைஅட்டை">
              <p>{item.contentTa}</p>
            </article>
          </article>
        ))}
      </div>
    );
  }

  if (page.kind === 'directory') {
    return (
      <div className="மூன்று_நெடுவரிசை">
        {state.departments.map((item) => (
          <article key={item.code} className="அட்டை">
            <div className="அட்டை_மேல்">
              <h3>{item.nameTa}</h3>
              <p>{item.district}</p>
            </div>
            <p>{item.descriptionTa}</p>
            <div className="தகவல்பட்டி">
              <div><span>தொடர்பு</span><strong>{item.contactNumber}</strong></div>
              <div><span>நேர இலக்கு</span><strong>{item.slaHours} மணி</strong></div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (page.kind === 'feedback' || page.kind === 'rating') {
    return (
      <section className="அட்டை">
        <div className="அட்டை_மேல்">
          <h3>{page.title}</h3>
          <p>{page.summary}</p>
        </div>
        <label>
          <span>உங்கள் கருத்து</span>
          <textarea rows={8} value={state.feedback} onChange={(event) => actions.setFeedback(event.target.value)} placeholder="சேவை எப்படியிருந்தது, மேலும் என்ன சேர்க்க வேண்டும் என்பதை எழுதுங்கள்" />
        </label>
        <div className="செயற்பொத்தான்கள்">
          <button type="button" className="முதல்" onClick={() => actions.setFeedback('')}>பதிவு செய்யப்பட்டது</button>
        </div>
      </section>
    );
  }

  if (page.kind === 'adminSection') {
    const சம்பந்தப்பட்டகுறைகள் = state.complaints.filter((item) => {
      if (page.title === 'அவசர குறைகள்') return ['HIGH', 'CRITICAL'].includes(item.priority);
      if (page.title === 'ஒதுக்கப்படாதவை') return item.status === 'REGISTERED';
      if (page.title === 'துறை வாரி நிலை') return true;
      return true;
    });

    return (
      <>
        <div className="இரண்டு_நெடுவரிசை">
          {சுருக்கஅட்டை({
            title: page.title,
            description: page.summary,
            links: [
              { to: '/குறை-விவரம்', title: 'தேர்ந்த குறை விவரம்', note: 'குறை வாழ்க்கைச் சுழற்சி பார்க்க' },
              { to: '/குறை-காலவரிசை', title: 'காலவரிசை', note: 'நடவடிக்கை தடம் பார்க்க' },
              { to: '/நிர்வாக-முகப்பு', title: 'மொத்த பலகை', note: 'அனைத்து எண்களுக்கும் திரும்பு' },
            ],
          })}
          <ChartPanel title="தற்போதைய ஓட்டம்" data={adminDashboard.statusChart} />
        </div>
        <ComplaintTable complaints={சம்பந்தப்பட்டகுறைகள்} onSelect={actions.setSelectedComplaintId} />
      </>
    );
  }

  if (page.kind === 'content') {
    return (
      <div className="இரண்டு_நெடுவரிசை">
        {சுருக்கஅட்டை({
          title: page.title,
          description: page.summary,
          links: [
            { to: '/அடிக்கடி-கேள்விகள்', title: 'அடிக்கடி கேள்விகள்', note: 'விரைவு பதில்கள்' },
            { to: '/அறிவு-மையம்', title: 'அறிவு மையம்', note: 'வழிகாட்டி கட்டுரைகள்' },
            { to: '/அலுவலகம்-கண்டுபிடி', title: 'அலுவலகம் கண்டுபிடி', note: 'துறை தொடர்புகள்' },
          ],
        })}
        <div className="மூன்று_நெடுவரிசை ஒற்றைநெடு">
          {state.announcements.map((item) => (
            <article key={item.id} className="அட்டை">
              <div className="அட்டை_மேல்">
                <h3>{item.titleTa}</h3>
                <p>{item.areaNameTa}</p>
              </div>
              <p>{item.contentTa}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (page.kind === 'module') {
    const தொடர்புடையகுறைகள் = state.complaints.filter((item) => item.categoryLabelTa.includes(page.title) || item.departmentLabelTa.includes(page.title) || page.summary.includes(item.categoryLabelTa.split(' ')[0]));
    const தரவு = டாஷ்போர்டு_உருவாக்கு(page.title, page.summary, தொடர்புடையகுறைகள்.length ? தொடர்புடையகுறைகள் : state.complaints.slice(0, 2));

    return (
      <>
        {அட்டைவரிசை(தரவு.cards)}
        <div className="இரண்டு_நெடுவரிசை">
          {சுருக்கஅட்டை({
            title: page.title,
            description: page.summary,
            links: [
              { to: '/குரல்-குறை-பதிவு', title: 'குரல் பதிவு', note: 'இந்த பிரிவுக்கான புதிய குறை' },
              { to: '/குறை-ஆய்வு', title: 'முன்னோட்டம்', note: 'தானியங்கி வகைப்பாடு சரிபார்' },
              { to: '/நிலை-கண்காணிப்பு', title: 'நிலை கண்காணிப்பு', note: 'ஏற்கெனவே பதிவு செய்த குறைகளைப் பார்' },
            ],
          })}
          <div className="அட்டை">
            <div className="அட்டை_மேல்">
              <h3>தொடர்புடைய துறைகள்</h3>
              <p>உடனடி சேவை அணுகல்கள்</p>
            </div>
            <div className="தகவல்பட்டி">
              {துறைகள்.slice(0, 3).map((item) => (
                <div key={item.code}>
                  <span>{item.nameTa}</span>
                  <strong>{item.contactNumber}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ComplaintTable complaints={தொடர்புடையகுறைகள்.length ? தொடர்புடையகுறைகள் : state.complaints.slice(0, 3)} onSelect={actions.setSelectedComplaintId} />
      </>
    );
  }

  return (
    <section className="அட்டை">
      <div className="அட்டை_மேல்">
        <h3>{page.title}</h3>
        <p>{page.summary}</p>
      </div>
      <p>இந்த பகுதி பயன்படுத்தத் தயாராக உள்ளது.</p>
    </section>
  );
}
