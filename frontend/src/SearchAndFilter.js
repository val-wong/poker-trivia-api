import React, { useState, useEffect } from 'react';

function App() {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestion = async (type = 'daily') => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setSelected(null);

    try {
      const res = await fetch(`http://localhost:8000/trivia/${type}`);
      if (!res.ok) throw new Error('Failed to fetch trivia');
      const data = await res.json();
      setQuestion(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion(); // default to daily on first load
  }, []);

  const checkAnswer = (option) => {
    setSelected(option);
    setFeedback(option === question.correct_answer);
  };

  if (loading) return <p>Loading trivia...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!question) return <p>No trivia found.</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🃏 Poker Trivia</h1>
      <p><strong>Question:</strong> {question.question}</p>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {question.options.map((opt, idx) => (
          <li key={idx}>
            <button
              onClick={() => checkAnswer(opt)}
              disabled={selected}
              style={{
                margin: '0.5rem 0',
                padding: '0.5rem 1rem',
                backgroundColor: selected === opt
                  ? feedback
                    ? '#d4edda' // green
                    : '#f8d7da' // red
                  : '#f0f0f0',
                border: '1px solid #ccc',
                cursor: selected ? 'default' : 'pointer',
                width: '100%',
                textAlign: 'left'
              }}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ marginTop: '1rem' }}>
          {feedback ? (
            <p>✅ Correct!</p>
          ) : (
            <p>❌ Incorrect. The correct answer is: <strong>{question.correct_answer}</strong></p>
          )}
          <p><em>{question.explanation}</em></p>
        </div>
      )}

      <button
        onClick={() => fetchQuestion('random')}
        style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
      >
        🔄 New Random Question
      </button>
    </div>
  );
}

export default App;
