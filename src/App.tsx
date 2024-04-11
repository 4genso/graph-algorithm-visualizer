import { useState } from "react";
import Configurator from "./components/Configurator/Configurator.tsx";
import AlgorithmRunner from "./components/AlgorithmRunner/AlgorithmRunner.tsx";
import { Edge } from "./types/Edge.type.ts";

// default input
const n = 6;
const start = 0;
const e: Edge[] = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 1, target: 2 },
  { source: 1, target: 3 },
  { source: 1, target: 4 },
  { source: 3, target: 4 },
  { source: 4, target: 5 },
];

function App(): JSX.Element {
  const [algorithmType, setAlgorithmType] = useState("DFS");
  const [graph, setGraph] = useState({
    totalNodes: n,
    start: start,
    edges: e,
    directed: false,
  });
  const [isStarted, setIsStaretd] = useState(false);

  return (
    <div className="flex gap-4 grid grid-cols-1 lg:grid-cols-4 mx-2">
      <AlgorithmRunner
        isStarted={isStarted}
        setIsStaretd={setIsStaretd}
        graph={graph}
        algorithmType={algorithmType}
      />
      <Configurator
        isStarted={isStarted}
        graph={graph}
        setGraph={setGraph}
        algorithmType={algorithmType}
        setAlgorithmType={setAlgorithmType}
      />
    </div>
  );
}

export default App;
