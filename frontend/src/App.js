import React, { useEffect, useState } from "react";

function App() {
  const [trivia, setTrivia] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const API_BASE = "https://poker-trivia-api.onrender.com";

  useEffect(() => {
    fetch(`${API_BASE}/trivia/daily`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch daily trivia");
        return res.json();
      })
      .then((data) => {
        setTrivia(data);
        setLoading(false);
        setShowAnswer(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleRandom = () => {
    setLoading(true);
    fetch(`${API_BASE}/trivia/random`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch random trivia");
        return res.json();
      })
      .then((data) => {
        setTrivia(data);
        setSearchResults([]);
        setShowAnswer(false);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    fetch(`${API_BASE}/trivia/search?q=${encodeURIComponent(searchQuery)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Search failed");
        return res.json();
      })
      .then((data) => {
        setSearchResults(data.results);
        setLoading(false);
        setShowAnswer(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const renderTriviaCard = (item, label = null) => (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 20 }}>
      {label && <p style={{ color: "gray", fontStyle: "italic" }}>{label}</p>}
      <p><strong>Question:</strong> {item.question}</p>
      <ul>
        {item.options.map((opt, idx) => (
          <li key={idx}>{opt}</li>
        ))}
      </ul>
      {showAnswer && (
        <div style={{ marginTop: 10 }}>
          <p><strong>Answer:</strong> {item.correct_answer}</p>
          <p><em>{item.explanation}</em></p>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🃏 Poker Trivia</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search trivia..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: 8, width: "70%", marginRight: 10 }}
        />
        <button type="submit">Search</button>
      </form>

      <button onClick={handleRandom} style={{ marginRight: 10 }}>🎲 Random</button>
      <button onClick={() => setShowAnswer(!showAnswer)}>
        {showAnswer ? "🙈 Hide Answer" : "👀 Reveal Answer"}
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {searchResults.length > 0 ? (
        <>
          <h3>🔍 Search Results</h3>
          {searchResults.map((item, idx) => renderTriviaCard(item))}
        </>
      ) : (
        trivia && renderTriviaCard(trivia, "🌞 Daily Trivia")
      )}
    </div>
  );
}

export default App;
