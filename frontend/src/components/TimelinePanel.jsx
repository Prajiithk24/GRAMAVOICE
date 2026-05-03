import { நிலைப்பெயர் } from '../lib/mockData';

function நாள்(மதிப்பு) {
  return new Intl.DateTimeFormat('ta-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(மதிப்பு));
}

export default function TimelinePanel({ timeline = [] }) {
  return (
    <section className="அட்டை">
      <div className="அட்டை_மேல்">
        <h3>நடவடிக்கை காலவரிசை</h3>
        <p>பதிவு முதல் தற்போது வரை</p>
      </div>
      <div className="காலவரிசை">
        {timeline.map((item) => (
          <div key={item.id} className="காலவரிசை_உருப்படி">
            <div className="காலவரிசை_புள்ளி" />
            <div>
              <strong>{item.titleTa}</strong>
              <p>{item.noteTa}</p>
              <span>{item.actorNameTa} · {நிலைப்பெயர்(item.status)} · {நாள்(item.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
