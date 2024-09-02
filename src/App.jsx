import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5),
    [sessionLength, setSessionLength] = useState(25),
    [timeLeft, setTimeLeft] = useState(25 * 60),
    [isActive, setIsActive] = useState(false),
    [isSession, setIsSession] = useState(true),
    beepRef = useRef(null),
    [hasStarted, setHasStarted] = useState(false);

  const toggleTimer = () => {
    if (!isActive) {
      // Timer is starting or resuming
      if (!hasStarted) {
        setTimeLeft(sessionLength * 60); // Set to current session length only the first time
        setHasStarted(true);
      }
      setIsSession(true); // Start with session phase
      document.getElementById('timer-label').innerText = 'Session'; // Ensure label is set to Session
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
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60); // Reset to default session length
    setIsActive(false); // Stop the timer
    setIsSession(true); // Reset to session phase
    setHasStarted(false); // Reset timer start state
    document.getElementById('timer-label').innerText = 'Session'; // Ensure label is reset
  };


  const playSound = () => {
    const audio = beepRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
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
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            playSound();
            // Switch between session and break
            if (isSession) {
              // Switch to break
              setTimeLeft(breakLength * 60); // Set time to break length
              setIsSession(false); // Change phase to break
              document.getElementById('timer-label').innerText = 'Break'; // Update label
            } else {
              // Switch to session
              setTimeLeft(sessionLength * 60); // Set time to session length
              setIsSession(true); // Change phase to session
              document.getElementById('timer-label').innerText = 'Session'; // Update label
            }
            return prevTime; // Return the previous time, so it does not continue to decrement
          }
          return prevTime - 1; // Decrement time
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isSession, breakLength, sessionLength]);


  return (
    <>
      <div className="tomato-container">
        <h2>Tomato clock</h2>
        <span>
          <img src="https://img.icons8.com/?size=100&id=80746&format=png&color=000000" alt="tomato" />
        </span>
      </div>
      <div className='break-session-container'>
        <div className='breakLength'>
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
        </div>
        <div className='sessionLength'>
          <div id="session-label">Session Length</div>
          <div id="session-length" value={sessionLength}>
            {sessionLength}
          </div>
          <button
            className="btn-level"
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
          </button></div>

      </div>
      <div className="time-wrapper">
        <div id="timer-label" style={{fontSize:"30px"}}>{isSession ? 'Session' : 'Break'}</div>
        <div id="time-left" style={{fontSize:"30px"}} value={formatTime(timeLeft)}>
          {formatTime(timeLeft)}
        </div>
      </div>
      <div className='control-wrapper'>
        <button id="start_stop" onClick={toggleTimer}>
          {isActive ? (
            <i className="fa fa-pause control-play"></i>
          ) : (
            <i className="fa fa-play control-play"></i>
          )}
        </button>
        <button id="reset" className='control-reset' onClick={resetTimer}>
          Reset
        </button>
      </div>
      <audio ref={beepRef} className="beep" id="beep" src="https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg"></audio>
    </>
  );
}

export default App;
