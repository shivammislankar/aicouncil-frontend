export default function RoleCard({ role, text }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 12,
        marginBottom: 10,
        borderRadius: 6,
      }}
    >
      <h4>{role}</h4>
      <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
    </div>
  );
}
