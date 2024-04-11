import { Edge } from "../types/Edge.type";

export function UnweightedEdgesToAdjacencyList(
  edges: Edge[],
  totalNodes: number,
  directed: boolean,
): Map<number, number[]> {
  const adjacencyList: Map<number, number[]> = new Map();

  for (let i = 0; i < totalNodes; i++) {
    adjacencyList.set(i, []);
  }

  for (const edge of edges) {
    adjacencyList.get(edge.source)!.push(edge.target);
    if (!directed) {
      adjacencyList.get(edge.target)!.push(edge.source);
    }
  }

  return adjacencyList;
}
