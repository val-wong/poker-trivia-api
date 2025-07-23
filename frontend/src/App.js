import React, { useEffect, useState } from 'react';

function App() {
  const [trivia, setTrivia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://poker-trivia-api.onrender.com/trivia/daily")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch trivia");
        return res.json();
      })
      .then((data) => {
        setTrivia(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trivia:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading trivia...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!trivia) return <p>No trivia found.</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🃏 Daily Poker Trivia</h1>
      <p><strong>Question:</strong> {trivia.question}</p>
      <ul>
        {trivia.options.map((opt, idx) => (
          <li key={idx}>{opt}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
