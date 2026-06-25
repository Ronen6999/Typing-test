import { useState, useEffect, useRef } from 'react';
import { texts } from './texts.js';

const getGrade = (wpm, accuracy) => {
  if (accuracy < 60) return "Blindfolded Monkey";
  if (accuracy < 75) return "Keyboard Gambler";

  if (wpm < 20) return "Turtle";
  if (wpm < 50) return "NPC";
  if (wpm < 80) return "Keyboard Warrior";
  if (wpm < 120) return "Programmer";
  if (wpm < 160) return "Demon";

  return "Alien";
};
const getTitle = (wpm, accuracy) => {
  if (accuracy < 50) return "Lord of Typos";
  if (wpm < 20) return "Village Messenger";
  if (wpm < 50) return "Keyboard Peasant";
  if (wpm < 80) return "Code Apprentice";
  if (wpm < 120) return "Terminal Wizard";
  if (wpm < 160) return "Bug Slayer";
  return "Keyboard God";
};
const getRoast = (wpm, accuracy) => {

  // Accuracy disasters
  if (accuracy < 50) {
    return "You missed so many letters I'm starting to think your keyboard is missing keys.";
  }

  if (accuracy < 70 && wpm > 100) {
    return "Fast? Yes. Correct? Absolutely not.";
  }

  if (accuracy < 80) {
    return "Your fingers are speedrunning mistakes.";
  }

  // Slow typers
  if (wpm < 15) {
    return "Did you type this one character at a time using Google Maps?";
  }

  if (wpm < 30) {
    return "My grandma sends WhatsApp messages faster.";
  }

  if (wpm < 50) {
    return "Average NPC typing speed detected.";
  }

  // Medium speed
  if (wpm < 80) {
    if (accuracy > 95) {
      return "Slow but accurate. Like a sniper with arthritis.";
    }

    return "Not bad. The keyboard still has warranty left.";
  }

  // Fast
  if (wpm < 120) {
    if (accuracy > 95) {
      return "Developer detected. Probably debugging while typing.";
    }

    return "You're fast, but spellcheck is carrying the team.";
  }

  // Very fast
  if (wpm < 160) {
    if (accuracy > 98) {
      return "Your keyboard just filed a workplace injury report.";
    }

    return "Machine gun fingers activated.";
  }

  // Insane
  if (accuracy > 98) {
    return "Are you secretly an AI pretending to be human?";
  }

  return "You type faster than your brain can process reality.";
};

function App() {

  const containerRef = useRef(null);
  const [text, setText] = useState(texts[0]);
  const [input, setInput] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Focus the container to capture key events
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!started || finished) return;

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (input.length === text.length) {
      setFinished(true);
      setStarted(false);
    }
  }, [input, text]);

  const handleKeyDown = (e) => {
    if (finished) return;

    const { key } = e;
    e.preventDefault(); // Prevent default browser actions

    if (!started) {
      setStarted(true);
    }

    if (key === 'Backspace') {
      setInput((prev) => prev.slice(0, -1));
    } else if (key.length === 1) { // Handle printable characters
      setInput((prev) => prev + key);
    }
  };

  const handleRestart = () => {
    // Get a new random text, different from the current one
    let newText;
    do {
      newText = texts[Math.floor(Math.random() * texts.length)];
    } while (newText === text);

    setText(newText);
    setInput("");
    setElapsedTime(0);
    setStarted(false);
    setFinished(false);
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  // Calculate WPM
  const wordsTyped = text.length / 5; // Use full text length for final WPM
  const minutes = elapsedTime / 60;
  const wpm = finished && minutes > 0 ? Math.round(wordsTyped / minutes) : 0;

  // Calculate Accuracy
  let correct = 0;
  // Use the final input length for accuracy calculation
  const finalInput = input.slice(0, text.length);
  for (let i = 0; i < finalInput.length; i++) {
    if (input[i] === text[i]) {
      correct++;
    }
  }
  const accuracy = finalInput.length > 0 ? Math.round((correct / finalInput.length) * 100) : 100;

  return (
    <div className="container" ref={containerRef} onKeyDown={handleKeyDown} tabIndex={0}>
      <img
        src="https://res.cloudinary.com/dymxdpunk/image/upload/v1782410997/pngegg_1_sbnkc9.png"
        alt="Typing Test Logo"
        className="app-logo"
      />
      <h1>Start Typing Baka!</h1>
      <div className="stats">
        <div>Time: {elapsedTime}s</div>
        <div>WPM: {finished ? wpm : '...'}</div>
        <div>Accuracy: {accuracy}%</div>
      </div>

      <div className="text-display">
        {text.split("").map((char, index) => {
          let colorClass = "";
          if (index < input.length) {
            colorClass = input[index] === char ? "correct" : "incorrect";
          }

          // Add caret
          if (index === input.length && !finished) {
            return (
              <span key={index} className="caret">
                {char}
              </span>
            );
          }

          return (
            <span key={index} className={colorClass}>
              {char}
            </span>
          );
        })}
        {input.length === text.length && !finished && <span className="caret-end"></span>}
      </div>

      {!started && !finished && <div className="placeholder">Start typing cutie...</div>}

      <button onClick={handleRestart}>
        {finished ? "Play Again" : "Restart"}
      </button>

      {finished && (
        <div className="results">
          <h2>Results</h2>
          <p>
  Grade:
  <strong> {getGrade(wpm, accuracy)}</strong>
</p>
<p>
    Title:
    <strong> {getTitle(wpm, accuracy)}</strong>
</p>
<p>
  <em>{getRoast(wpm, accuracy)}</em>
</p>
        </div>
      )}

      {finished && (
        <footer className="app-footer">
          <span>Built with ❤️</span>
          <a href="https://github.com/ronen6999/Typing-test" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="github-icon"
            ><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </footer>
      )}
    </div>
  );
}

export default App;