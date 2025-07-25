// frontend/src/App.js
import React from "react";
import DailyTrivia from "./DailyTrivia";
import SearchAndFilter from "./SearchAndFilter";

const App = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>🃏 Poker Trivia</h1>
      <DailyTrivia />
      <hr />
      <SearchAndFilter />
    </div>
  );
};

export default App;


// frontend/src/DailyTrivia.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const DailyTrivia = () => {
  const [question, setQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchQuestion = async () => {
    const res = await axios.get("http://localhost:8000/trivia/daily");
    setQuestion(res.data);
    setShowAnswer(false);
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  if (!question) return <p>Loading question...</p>;

  return (
    <div>
      <h2>🌊 Daily Question</h2>
      <p><strong>{question.question}</strong></p>
      <ul>
        {question.options.map((opt, idx) => (
          <li key={idx}>{opt}</li>
        ))}
      </ul>
      {showAnswer && <p><em>Answer:</em> {question.correct_answer}</p>}
      <button onClick={() => setShowAnswer(true)}>Show Answer</button>
      <button onClick={fetchQuestion}>New Question</button>
    </div>
  );
};

export default DailyTrivia;


// frontend/src/SearchAndFilter.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const SearchAndFilter = () => {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [results, setResults] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      const res = await axios.get("http://localhost:8000/trivia/tags");
      setTags(res.data.tags);
    };
    fetchTags();
  }, []);

  const handleSearch = async () => {
    const res = await axios.get("http://localhost:8000/trivia/search", {
      params: { q: query, tag }
    });
    setResults(res.data.results);
  };

  return (
    <div>
      <h2>🔍 Search & Filter</h2>
      <input
        type="text"
        placeholder="Search for keywords..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="">All Tags</option>
        {tags.map((t, i) => (
          <option key={i} value={t}>{t}</option>
        ))}
      </select>
      <button onClick={handleSearch}>Search</button>

      {results.length === 0 ? (
        <p>No results yet. Try searching!</p>
      ) : (
        <div>
          {results.map((q, i) => (
            <div key={i}>
              <p><strong>{q.question}</strong></p>
              <ul>
                {q.options.map((opt, j) => (
                  <li key={j}>{opt}</li>
                ))}
              </ul>
              <p><em>Answer:</em> {q.correct_answer}</p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;


// frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);


// frontend/public/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Poker Trivia</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
