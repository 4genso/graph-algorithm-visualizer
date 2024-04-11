import { useState, useMemo, useEffect } from "react";
import Controller from "../Controller/Controller";
import Visualizer from "../Visualizer/Visualizer";
import OutputTracer from "../OutputTracer/OutputTracer";
import { Graph } from "../../types/Graph.type";
import { Algorithm } from "../../algorithms/Algorithm.ts";
import { GraphEdge, GraphNode } from "reagraph";
import { GraphState } from "../../types/GraphState.type.ts";
import { pickAlgorithm } from "./PickAlgorithm.ts";
import parseEdges from "./parseEdges.ts";
import generateNodes from "./generateNodes.ts";

type AlgorithmRunnerProps = {
  isStarted: boolean;
  setIsStaretd: (started: boolean) => void;
  graph: Graph;
  algorithmType: string;
};

const outputGap = "---------";

function AlgorithmRunner({
  isStarted,
  setIsStaretd,
  graph,
  algorithmType,
}: AlgorithmRunnerProps): JSX.Element {
  const [outputs, setOutput] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [edges, setEdges] = useState<GraphEdge[]>(parseEdges(graph));
  const [nodes, setNodes] = useState<GraphNode[]>(
    generateNodes(graph, graph.start),
  );
  const algorithm: Algorithm = useMemo(() => {
    return pickAlgorithm(algorithmType, graph);
  }, [algorithmType, graph, isStarted]);

  useEffect(() => {
    setEdges(parseEdges(graph));
    setNodes(generateNodes(graph, graph.start));
  }, [graph]);

  useEffect(() => {
    if (isStarted) {
      setIsPlaying(true);
    } else {
      // reset
      setEdges(parseEdges(graph));
      setNodes(generateNodes(graph, graph.start));
      setOutput([]);
      setIsFinished(false);
      setIsPlaying(false);
    }
  }, [isStarted]);

  useEffect(() => {
    function runAlgorithm() {
      const result: GraphState = algorithm.nextStep();

      const newNodes: GraphNode[] = generateNodes(
        graph,
        result.visitingNode,
        result.visitedNodes,
      );
      setNodes(newNodes);

      const newEdges: GraphEdge[] = parseEdges(
        graph,
        result.visitingEdge,
        result.visitedEdges,
      );
      setEdges(newEdges);

      setOutput((prev) => [...prev, outputGap, ...result.output]);

      if (algorithm.isFinished) {
        setIsFinished(true);
      }
    }

    if (isPlaying && !isFinished) {
      const intervalID = setInterval(runAlgorithm, 1500 / speed);
      return () => clearInterval(intervalID);
    }
  }, [isPlaying, isFinished, speed]);

  return (
    <div className="lg:col-span-3">
      <Visualizer nodes={nodes} edges={edges} directed={graph.directed} />
      <Controller
        isStarted={isStarted}
        setIsStarted={setIsStaretd}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        speed={speed}
        setSpeed={setSpeed}
        isFinished={isFinished}
      />
      <OutputTracer outputs={outputs} />
    </div>
  );
}

export default AlgorithmRunner;
