import { Graph } from "../types/Graph.type";
import { GraphState } from "../types/GraphState.type.ts";
import { Algorithm } from "./Algorithm.ts";
import { DisjointSet } from "../data-structures/DisjointSet/DisjointSet.ts";
import { Edge } from "../types/Edge.type.ts";

export class Kruskal extends Algorithm {
  protected done: boolean;
  private visited: boolean[];
  private visiting: number;
  private visitedEdges: boolean[][];
  private edgeSets: DisjointSet;
  private edges: Edge[];

  constructor(graph: Graph) {
    super();
    this.done = false;
    this.visited = Array(graph.totalNodes).fill(false);
    this.visiting = -1;
    this.visitedEdges = Array.from({ length: graph.totalNodes }, () =>
      Array(graph.totalNodes).fill(false),
    );
    this.edgeSets = new DisjointSet(graph.totalNodes);
    this.edges = [...graph.edges].sort((a, b) => a.weight! - b.weight!);
  }

  private unionEdge(): GraphState {
    const output: string[] = [];

    if (this.edges.length === 0) {
      this.done = true;
      output.push("MST complete");
      return {
        visitedNodes: this.visited,
        visitingNode: this.visiting,
        visitedEdges: this.visitedEdges,
        output,
      };
    }

    const edge: Edge = this.edges.shift()!;
    const edgeID: string = edge.source + "-" + edge.target;

    if (this.edgeSets.find(edge.source) !== this.edgeSets.find(edge.target)) {
      this.edgeSets.union(edge.source, edge.target);
      output.push("Edge " + edgeID + " is part of the MST");

      this.visitedEdges[edge.source][edge.target] = true;
      this.visited[edge.source] = true;
      this.visited[edge.target] = true;
    } else {
      output.push("Edge " + edgeID + " do not belong in the MST");
    }

    return {
      visitedNodes: this.visited,
      visitingNode: this.visiting,
      visitedEdges: this.visitedEdges,
      visitingEdge: edgeID,
      output,
    };
  }

  public nextStep(): GraphState {
    if (this.isFinished) {
      return {
        visitedNodes: this.visited,
        visitingNode: this.visiting,
        visitedEdges: this.visitedEdges,
        output: [],
      };
    }
    return this.unionEdge();
  }
}
