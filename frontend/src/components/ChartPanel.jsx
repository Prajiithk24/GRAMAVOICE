import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function ChartPanel({ title, data, type = 'bar' }) {
  if (!data || data.length === 0) {
    return (
      <section className="அட்டை வரைபடஅட்டை">
        <div className="அட்டை_மேல்">
          <h3>{title}</h3>
        </div>
        <div className="காலி_பலகை">
          தரவு இல்லை. குறைகள் பதிவு செய்யும் போது வரைபடம் இங்கே தோன்றும்.
        </div>
      </section>
    );
  }

  return (
    <section className="அட்டை வரைபடஅட்டை">
      <div className="அட்டை_மேல்">
        <h3>{title}</h3>
      </div>
      <div className="வரைபடஉள்ளடைவு">
        <ResponsiveContainer width="100%" height={260}>
          {type === 'pie' ? (
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="labelTa" outerRadius={90} fill="#0f766e" />
              <Tooltip formatter={(value, name) => [`${value}`, name]} />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d7ddd9" />
              <XAxis dataKey="labelTa" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`${value}`, 'எண்ணிக்கை']} />
              <Bar dataKey="value" fill="#0f766e" radius={[10, 10, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
