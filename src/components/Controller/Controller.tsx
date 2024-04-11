type ControllerProps = {
  isStarted: boolean;
  setIsStarted: (started: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isFinished: boolean;
};

function Controller({
  isStarted,
  setIsStarted,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  isFinished,
}: ControllerProps): JSX.Element {
  function handleSpeedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newSpeed = parseFloat(e.target.value);
    if (!isNaN(newSpeed) && newSpeed >= 0.25 && newSpeed <= 2) {
      setSpeed(newSpeed);
    }
  }

  function handleIsPlayingUpdate() {
    if (isStarted || !isFinished) {
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <div className="flex m-3">
      <button
        className="bg-white hover:bg-gray-200 text-black font-semibold w-20 py-1 mx-2 border border-black rounded"
        onClick={() => setIsStarted(!isStarted)}
      >
        {isStarted ? "Reset" : "Start"}
      </button>
      <button
        className="bg-white disabled:bg-gray-300 hover:bg-gray-200 text-black font-semibold w-20 py-1 mx-2 border border-black rounded disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!isStarted || isFinished}
        onClick={handleIsPlayingUpdate}
      >
        {isPlaying ? "Pause" : "Resume"}
      </button>
      <div className="flex mx-3">
        <label
          htmlFor="speed-range"
          className="text-base font-semibold text-black"
        >
          Speed
        </label>
        <input
          id="speed-range"
          type="range"
          min={0.25}
          max={2}
          step={0.25}
          value={speed}
          onChange={handleSpeedChange}
          className="py-2 h-2 m-1 bg-gray-200 appearance-none cursor-pointer rounded-lg"
        />
      </div>
    </div>
  );
}

export default Controller;
