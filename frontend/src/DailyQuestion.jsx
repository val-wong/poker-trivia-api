import { useEffect, useState } from "react";

function DailyQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const fetchQuestion = async () => {
    try {
      const res = await fetch("http://localhost:8000/trivia/random");
      const data = await res.json();
      setQuestion(data);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div>
      <h2>🃏 Poker Trivia</h2>
      <p>{question.question}</p>

      {question.options && (
        <ul>
          {question.options.map((opt, idx) => (
            <li
              key={idx}
              style={{
                cursor: "pointer",
                fontWeight: opt === selectedAnswer ? "bold" : "normal",
                color:
                  showExplanation && opt === question.correct_answer
                    ? "green"
                    : "black",
              }}
              onClick={() => handleAnswerClick(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}

      {showExplanation && (
        <>
          <p>
            ✅ Correct Answer: <strong>{question.correct_answer}</strong>
          </p>
          <p>📘 {question.explanation}</p>
        </>
      )}

      <button onClick={fetchQuestion}>🔁 Get New Question</button>
    </div>
  );
}

export default DailyQuestion;
