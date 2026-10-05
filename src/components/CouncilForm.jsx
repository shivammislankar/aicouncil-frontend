import { useState } from "react";
import { askCouncil } from "../services/councilApi";

export default function CouncilForm({ token, onResult }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await askCouncil(token, question);
      onResult(data);
    } catch (err) {
      setError("Veritas request failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ask Veritas</h2>

      <textarea
        rows={4}
        placeholder="Enter your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
        style={{ width: "100%" }}
      />

      <br /><br />

      <button type="submit" disabled={loading || !token}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
