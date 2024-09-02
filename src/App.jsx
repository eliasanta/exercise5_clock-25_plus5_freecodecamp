import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5),
    [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 1500 seconds = 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isSession, setIsSession] = useState(true);

  const beepRef = useRef(null);
  const toggleTimer = () => {
    if (!isActive) {
      // Timer is starting or resuming
      setIsSession(true); // Ensure we're in the session phase if it's starting
    }
    setIsActive(!isActive);
  };

  // Reset the timer to the initial state
  const resetTimer = () => {
    // Stop and rewind the audio
    if (beepRef.current) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
    // Reset timer values
    setTimeLeft(sessionLength * 60); // Reset timeLeft to the current session length
    setBreakLength(5);
    setSessionLength(25);
    setIsActive(false); // Stop the timer
    setIsSession(true); // Reset to the session phase
  };

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  }

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };
  // Timer interval management
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            setIsActive(false);
            beepRef.current.play(); // Play sound when time is up

            // Switch between session and break
            if (isSession) {
              setTimeLeft(breakLength * 60);
              setIsSession(false);
              document.getElementById('timer-label').innerText = 'Break'; // Update label to Break
            } else {
              setTimeLeft(sessionLength * 60);
              setIsSession(true);
              document.getElementById('timer-label').innerText = 'Session'; // Update label to Session
            }
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isSession, breakLength, sessionLength]);

  return (
    <>
      <div id="break-label">Break Length</div>
      <div id="break-length" value={breakLength}>
        {breakLength}
      </div>
      <button
        className="btn-level"
        id="break-decrement"
        onClick={handleBreakDecrement}
        value="-"
      >
        <i className="fa fa-arrow-down fa-2x"></i>
      </button>
      <button
        className="btn-level"
        onClick={handleBreakIncrement}
        id="break-increment"
        value="+"
      >
        <i className="fa fa-arrow-up fa-2x"></i>
      </button>
      <div id="session-label">Session Length</div>
      <div id="session-length" value={sessionLength}>
        {sessionLength}
      </div>
      <button
        class="btn-level"
        id="session-decrement"
        onClick={handleSessionDecrement}
        value="-"
      >
        <i className="fa fa-arrow-down fa-2x"></i>
      </button>
      <button
        className="btn-level"
        onClick={handleSessionIncrement}
        id="session-increment"
        value="+"
      >
        <i className="fa fa-arrow-up fa-2x"></i>
      </button>
      <div id="time-wrapper">
        <div id="timer-label">{isSession ? 'Session' : 'Break'}</div>
        <div id="time-left" value={formatTime(timeLeft)}>
          {formatTime(timeLeft)}
        </div>
      </div>
      <button id="start_stop" onClick={toggleTimer}>
        {isActive ? (
          <i className="fa fa-pause fa-2x"></i>
        ) : (
          <i className="fa fa-play fa-2x"></i>
        )}
      </button>
      <button id="reset" onClick={resetTimer}>
        Reset
      </button>
      <audio id="beep" ref={beepRef}>
        <source src="./assets/beep.mp3" type="audio/mpeg" />
        Your browser does not support the <code>audio</code> element.
      </audio>
    </>
  );
}

export default App;
