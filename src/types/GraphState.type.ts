export type GraphState = {
  visitedNodes: boolean[];
  visitingNode: number;
  visitedEdges?: boolean[][];
  visitingEdge?: string;
  output: string[];
};
