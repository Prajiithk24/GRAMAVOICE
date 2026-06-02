import { useNavigate } from 'react-router-dom';
import { நிலைப்பெயர், முன்னுரிமைப்பெயர் } from '../lib/mockData';

function நாள்(மதிப்பு) {
  return new Intl.DateTimeFormat('ta-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(மதிப்பு));
}

export default function ComplaintTable({ complaints, onSelect }) {
  const navigate = useNavigate();

  return (
    <section className="அட்டை">
      <div className="அட்டை_மேல்">
        <h3>குறை பட்டியல்</h3>
        <p>{complaints.length} பதிவுகள்</p>
      </div>
      <div className="அட்டவணைமூடி">
        <table className="அட்டவணை">
          <thead>
            <tr>
              <th>குறை எண்</th>
              <th>தலைப்பு</th>
              <th>வகை</th>
              <th>நிலை</th>
              <th>முன்னுரிமை</th>
              <th>தேதி</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? complaints.map((complaint) => (
              <tr
                key={complaint.id}
                onClick={() => {
                  onSelect?.(complaint.id);
                  navigate('/குறை-விவரம்');
                }}
              >
                <td>{complaint.referenceNumber}</td>
                <td>{complaint.subjectTa}</td>
                <td>{complaint.categoryLabelTa}</td>
                <td>{நிலைப்பெயர்(complaint.status)}</td>
                <td>{முன்னுரிமைப்பெயர்(complaint.priority)}</td>
                <td>{நாள்(complaint.createdAt)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="அட்டவணை_காலி">
                  இன்னும் குறைகள் பதிவு செய்யப்படவில்லை. புதிய குறை பதிவு செய்ததும் இங்கு தெரியும்.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
