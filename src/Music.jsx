import { FaBackward, FaPlay, FaForward, FaPause } from "react-icons/fa";
import { useState, useRef } from "react";

const Music = ({ data }) => {
  const [selected, setSelected] = useState(data[0]);
  const [play, setPlay] = useState(false);
  const [count, setCount] = useState(1);
  const audioRef = useRef(null);

  const playMusic = () => {
    if (!play) {
      setPlay(true);
      audioRef.current.play();
    } else {
      setPlay(false);
      audioRef.current.pause();
    }
  };

  const prevSong = () => {
    setPlay(false);
    if (count === 1) {
      setCount(3);
      setSelected(data[2]);
    } else {
      setCount(count - 1);
      setSelected(data[count - 2]);
    }
  };

  const nextSong = () => {
    setPlay(false);
    if (count === 3) {
      setCount(1);
      setSelected(data[0]);
    } else {
      setCount(count + 1);
      setSelected(data[count]);
    }
  };

  return (
    <div className="music-container">
      <div>
        <div className="music-left">
          <img
            src={selected.image}
            alt={selected.title}
            className="music-image"
          />
        </div>
        <div className="music-right">
          <h4>{selected.title}</h4>
          <p>
            <a href={selected.source} target="_blank" className="music-url">
              Source
            </a>
          </p>
          <p>Song {count} of 3</p>
        </div>
      </div>
      <div className="music-controls">
        <div className="music-control" onClick={prevSong}>
          <FaBackward />
        </div>
        <div className="music-control" onClick={playMusic}>
          {play ? <FaPause /> : <FaPlay />}
        </div>
        <div className="music-control" onClick={nextSong}>
          <FaForward />
        </div>
      </div>
      {/* actual audio element */}
      <audio src={selected.beat} loop ref={audioRef} />
    </div>
  );
};
export default Music;
