import { Graph } from "../../types/Graph.type";
import { Algorithm } from "../../algorithms/Algorithm";
import { DFS } from "../../algorithms/DFS";
import { BFS } from "../../algorithms/BFS";
import { Dijkstra } from "../../algorithms/Dijkstra";
import { Prim } from "../../algorithms/Prim";
import { Kruskal } from "../../algorithms/Kruskal";

export function pickAlgorithm(algorithmType: string, graph: Graph): Algorithm {
  switch (algorithmType) {
    case "DFS":
      return new DFS(graph);
    case "BFS":
      return new BFS(graph);
    case "Dijkstra":
      return new Dijkstra(graph);
    case "Prim":
      return new Prim(graph);
    case "Kruskal":
      return new Kruskal(graph);
    default:
      throw new Error("Invalid Algorithm Type");
  }
}
