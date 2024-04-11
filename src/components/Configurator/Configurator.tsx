import { useState, useRef, useEffect } from "react";
import { AlgorithmOptions } from "../../algorithms/AlgorithmOptions";
import { Graph } from "../../types/Graph.type";
import { Edge } from "../../types/Edge.type";

type ConfiguratorProps = {
  isStarted: boolean;
  graph: Graph;
  setGraph: (graph: Graph) => void;
  algorithmType: string;
  setAlgorithmType: (algorithmType: string) => void;
};

const MAX_TOTALNODE = 20;

function Configurator({
  isStarted,
  graph,
  setGraph,
  algorithmType,
  setAlgorithmType,
}: ConfiguratorProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<string>(algorithmType);
  const totalNodeRef = useRef<HTMLSelectElement>(null);
  const startNodeRef = useRef<HTMLTextAreaElement>(null);
  const edgeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isStarted) {
      setIsEditing(false);
    }
  }, [isStarted]);

  function handleEdit() {
    setErrorMessage("");

    if (checkInputIsValid()) {
      if (!isStarted) {
        let newGraph: Graph = {
          ...graph,
          edges: parseEdgeInput(edgeRef.current!.value),
          totalNodes: parseInt(totalNodeRef.current!.value),
          start: parseInt(startNodeRef.current!.value),
        };
        setAlgorithmType(selectedAlgorithm);

        // change graph to directed or undirected per algorithm requirements
        if (
          AlgorithmOptions[selectedAlgorithm as keyof typeof AlgorithmOptions]
            .undirected !==
          AlgorithmOptions[selectedAlgorithm as keyof typeof AlgorithmOptions]
            .directed
        ) {
          newGraph.directed = AlgorithmOptions[
            selectedAlgorithm as keyof typeof AlgorithmOptions
          ].directed
            ? true
            : false;
        }

        setGraph(newGraph);
      }

      setIsEditing(false);
    }
  }

  function checkInputIsValid(): boolean {
    if (selectedAlgorithm in AlgorithmOptions === false) {
      setErrorMessage("Algorithm type does not exist");
      return false;
    }

    if (
      !totalNodeRef.current!.value ||
      isNaN(Number(totalNodeRef.current!.value)) ||
      parseInt(totalNodeRef.current!.value) < 1 ||
      parseInt(totalNodeRef.current!.value) > MAX_TOTALNODE
    ) {
      setErrorMessage("Total number of nodes needs to be in the range [1,50]");
      return false;
    }

    if (
      !startNodeRef.current!.value ||
      isNaN(Number(startNodeRef.current!.value)) ||
      parseInt(startNodeRef.current!.value) < 0 ||
      parseInt(startNodeRef.current!.value) >=
        parseInt(totalNodeRef.current!.value)
    ) {
      setErrorMessage("Invalid starting node");
      return false;
    }

    if (!checkEdgeStringIsValid()) {
      setErrorMessage("Invalid edges");
      return false;
    }

    return true;
  }

  function checkEdgeStringIsValid(): boolean {
    const edgeString = edgeRef.current!.value;
    if (edgeString.length === 0) {
      return true;
    }
    const edgeRegex = /(\[\s*\d+\s*,\s*\d+(?:,\s*\d+)?\s*\])/g; // allow no edges

    const edges = edgeString.match(edgeRegex);
    if (!edges) {
      return false;
    }

    let weightedExist = false;
    let unweightedExist = false;
    for (const edge of edges) {
      const [source, target, weight] = edge
        .replace(/\[|\]/g, "")
        .split(",")
        .map((part) => parseInt(part.trim(), 10));

      // check nodes are valid
      if (
        !Number.isInteger(source) ||
        source < 0 ||
        source >= parseInt(totalNodeRef.current!.value) ||
        !Number.isInteger(target) ||
        target < 0 ||
        target >= parseInt(totalNodeRef.current!.value)
      ) {
        return false;
      }

      if (typeof weight === "number" && !isNaN(weight)) {
        weightedExist = true;
      } else {
        unweightedExist = true;
      }
    }

    // check edge type is allowed and consistent
    if (
      (weightedExist && unweightedExist) ||
      (weightedExist &&
        !AlgorithmOptions[selectedAlgorithm as keyof typeof AlgorithmOptions]
          .weighted) ||
      (unweightedExist &&
        !AlgorithmOptions[selectedAlgorithm as keyof typeof AlgorithmOptions]
          .unweighted)
    ) {
      return false;
    }

    return true;
  }

  function parseEdgeInput(edgeString: string): Edge[] {
    if (edgeString.length === 0) {
      return [];
    }
    const edgeRegex = /(\[\s*\d+\s*,\s*\d+(?:,\s*\d+)?\s*\])/g;

    const edges = edgeString.match(edgeRegex);

    let parsedEdges: Edge[] = [];
    for (const edge of edges!) {
      const [source, target, weight] = edge
        .replace(/\[|\]/g, "")
        .split(",")
        .map((part) => parseInt(part.trim(), 10));

      if (typeof weight === "number" && !isNaN(weight)) {
        parsedEdges.push({ source, target, weight });
      } else {
        parsedEdges.push({ source, target });
      }
    }

    return parsedEdges;
  }

  return (
    <div className="flex my-3 font-semibold">
      <div>
        <div>
          <div className="mb-4">
            <select
              id="algorithm"
              name="algorithm"
              defaultValue={algorithmType}
              disabled={isStarted || !isEditing}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {Object.keys(AlgorithmOptions).map((key) => (
                <option key={key} value={key}>
                  {AlgorithmOptions[key as keyof typeof AlgorithmOptions].label}
                </option>
              ))}
            </select>
          </div>
          <div className="my-4">
            <label htmlFor="total-node" className="mr-2">
              Total Nodes
            </label>
            <select
              id="total-node"
              name="total-node"
              ref={totalNodeRef}
              defaultValue={graph.totalNodes}
              disabled={isStarted || !isEditing}
              className="disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {Array.from({ length: MAX_TOTALNODE }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="my-4">
            <label htmlFor="start-node">Starting Node</label>
            <form>
              <textarea
                id="start-node"
                defaultValue={graph.start}
                ref={startNodeRef}
                disabled={isStarted || !isEditing}
                placeholder={graph.start.toString()}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </form>
          </div>
          <div className="my-4">
            <label htmlFor="edges">Edges</label>
            <form>
              <textarea
                id="edges"
                ref={edgeRef}
                disabled={isStarted || !isEditing}
                placeholder="[[0,1],[1,2],...] or [[0,1,14],[1,2,15],...]"
                className="bg-white shadow-md rounded px-8 pt-4 pb-8 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </form>
            <div className="my-1">
              {"Weighted Edges "}{" "}
              {AlgorithmOptions[
                selectedAlgorithm as keyof typeof AlgorithmOptions
              ].weighted
                ? "Accepted"
                : "Not Accepted"}
            </div>
            <div className="my-1">
              {"Unweighted Edges "}{" "}
              {AlgorithmOptions[
                selectedAlgorithm as keyof typeof AlgorithmOptions
              ].unweighted
                ? "Accepted"
                : "Not Accepted"}
            </div>
          </div>
          <div className="my-1">
            {AlgorithmOptions[
              selectedAlgorithm as keyof typeof AlgorithmOptions
            ].undirected !==
            AlgorithmOptions[selectedAlgorithm as keyof typeof AlgorithmOptions]
              .directed ? (
              <div>
                {AlgorithmOptions[
                  selectedAlgorithm as keyof typeof AlgorithmOptions
                ].label + " only accepts "}
                {AlgorithmOptions[
                  selectedAlgorithm as keyof typeof AlgorithmOptions
                ].directed
                  ? "Directed Edges"
                  : "Undirected Edges"}
              </div>
            ) : (
              <>
                <input
                  className="relative w-7 h-4 rounded-full bg-gray-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="checkbox"
                  checked={graph.directed}
                  onClick={() =>
                    setGraph({
                      ...graph,
                      directed: !graph.directed,
                    })
                  }
                  disabled={isStarted || !isEditing}
                />
                <label>Directed Graph</label>
              </>
            )}
          </div>
          <div>{errorMessage !== "" && errorMessage}</div>
        </div>
        <div className="my-2">
          {isEditing ? (
            <button
              onClick={handleEdit}
              className="bg-white hover:bg-gray-200 text-black font-semibold w-20 py-1 border border-black rounded"
            >
              Done
            </button>
          ) : (
            <button
              onClick={() => !isStarted && setIsEditing(true)}
              disabled={isStarted}
              className="bg-white disabled:bg-gray-300 hover:bg-gray-200 text-black font-semibold w-20 py-1 border border-black rounded disabled:cursor-not-allowed disabled:opacity-50"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Configurator;
