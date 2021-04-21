import "./App.scss";
import { useState, useEffect } from "react";
import ColorCard from "./components/ColorCard";
import timeout from "./utils/util";

function App() {
  const [isOn, setIsOn] = useState(false);
  const milliseconds = 700;

  const colorList = ["green", "red", "yellow", "blue"];

  const initPlay = {
    isDisplay: false,
    colors: [],
    score: 0,
    userPlay: false,
    userColors: [],
  };

  const [play, setPlay] = useState(initPlay);
  const [flashColor, setFlashColor] = useState("");

  function startHandle() {
    setIsOn(true);
  }

  useEffect(() => {
    if (isOn) {
      setPlay({ ...initPlay, isDisplay: true });
    } else {
      setPlay(initPlay);
    }
  }, [isOn]);

  useEffect(() => {
    if (isOn && play.isDisplay) {
      let newColor = colorList[Math.floor(Math.random() * 4)];

      const copyColors = [...play.colors];
      copyColors.push(newColor);
      setPlay({ ...play, colors: copyColors });
    }
  }, [isOn, play.isDisplay]);

  useEffect(() => {
    if (isOn && play.isDisplay && play.colors.length) {
      displayColors();
    }
  }, [isOn, play.isDisplay, play.colors.length]);

  async function displayColors() {
    await timeout(milliseconds);
    console.log('colors: ', play.colors);
    for (let i = 0; i < play.colors.length; i++) {
      setFlashColor(play.colors[i]);
      await timeout(milliseconds);
      setFlashColor("");
      await timeout(milliseconds);

      if (i === play.colors.length - 1) {
        const copyColors = [...play.colors];

        setPlay({
          ...play,
          isDisplay: false,
          userPlay: true,
          // userColors: copyColors.reverse(),
          userColors: copyColors,
        });
      }
    }
  }

  async function cardClickHandle(color) {
    if (!play.isDisplay && play.userPlay) {
      const copyUserColors = [...play.userColors];
      // const lastColor = copyUserColors.pop(); // to be used with the userColors: copyColors.reverse(), in the line 66
      const lastColor = copyUserColors.shift();
      setFlashColor(color);

      if (color === lastColor) {
        if (copyUserColors.length) {
          setPlay({ ...play, userColors: copyUserColors });
        } else { // si todavia existen colores por seleccionar
          await timeout(milliseconds);
          setPlay({
            ...play,
            isDisplay: true,
            userPlay: false,
            score: play.colors.length,
            userColors: [],
          });
        }
      } else { // si el usuario falla
        await timeout(milliseconds);
        setPlay({ ...initPlay, score: play.colors.length });
      }
      await timeout(milliseconds);
      setFlashColor("");
    }
  }

  function closeHandle() {
    setIsOn(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        {play.isDisplay && <label> machine plays </label>}
        {play.userPlay && <label> your turn </label>}
        <div className="cardWrapper">
          {colorList &&
            colorList.map((v, i) => (
              <ColorCard
                onClick={() => {
                  cardClickHandle(v);
                }}
                flash={flashColor === v}
                color={v}
              ></ColorCard>
            ))}
        </div>

        {isOn && !play.isDisplay && !play.userPlay && play.score && (
          <div className="lost">
            <div>FinalScore: {play.score}</div>
            <button onClick={closeHandle}>Close</button>
          </div>
        )}
        {!isOn && !play.score && (
          <button onClick={startHandle} className="startButton">
            Start
          </button>
        )}
        {isOn && (play.isDisplay || play.userPlay) && (
          <div className="score">{play.score}</div>
        )}
      </header>
    </div>
  );
}

export default App;
