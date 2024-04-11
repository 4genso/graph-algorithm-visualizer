import { Edge } from "../types/Edge.type";

export function WeightedEdgesToAdjacencyList(
  edges: Edge[],
  totalNodes: number,
  directed: boolean,
): Map<number, number[][]> {
  const adjacencyList: Map<number, number[][]> = new Map();

  for (let i = 0; i < totalNodes; i++) {
    adjacencyList.set(i, []);
  }

  for (const edge of edges) {
    adjacencyList.get(edge.source)!.push([edge.target, edge.weight!]);
    if (!directed) {
      adjacencyList.get(edge.target)!.push([edge.source, edge.weight!]);
    }
  }

  return adjacencyList;
}
