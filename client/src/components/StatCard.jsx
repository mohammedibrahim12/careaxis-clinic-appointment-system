export default function StatCard({ label, value, accent = 'teal' }) {
  return (
    <article className={`stat-card stat-${accent}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}
