import { Graph } from "../types/Graph.type";
import { GraphState } from "../types/GraphState.type.ts";
import { Algorithm } from "./Algorithm.ts";
import { WeightedEdgesToAdjacencyList } from "./WeightedEdgesToAdjacencyList.ts";

export class Prim extends Algorithm {
  protected done: boolean;
  private visited: boolean[];
  private visiting: number;
  private adjacencyList: Map<number, number[][]>;
  private costs: number[];
  private neighbours: number[][];
  private visitedEdges: boolean[][];
  private shortestPathToNode: number[];

  constructor(graph: Graph) {
    super();
    this.done = false;
    this.visited = Array(graph.totalNodes).fill(false);
    this.adjacencyList = WeightedEdgesToAdjacencyList(
      graph.edges,
      graph.totalNodes,
      graph.directed,
    );
    this.visiting = graph.start;
    this.costs = Array(graph.totalNodes).fill(Number.POSITIVE_INFINITY);
    this.costs[graph.start] = 0;
    this.neighbours = [];
    this.visitedEdges = Array.from({ length: graph.totalNodes }, () =>
      Array(graph.totalNodes).fill(false),
    );
    this.shortestPathToNode = Array(graph.totalNodes).fill(graph.start);
  }

  private updateNeighbourCost(): GraphState {
    let [neighbour, weight] = this.neighbours.shift()!;
    let output: string[] = [];

    if (weight < this.costs[neighbour]) {
      this.costs[neighbour] = weight;
      this.shortestPathToNode[neighbour] = this.visiting;
      output.push("Lower than previous cost to node " + neighbour);
      output.push("new cost updated");
    } else {
      output.push("This is not better then previous cost to node " + neighbour);
    }

    return {
      visitedNodes: this.visited,
      visitingNode: this.visiting,
      visitedEdges: this.visitedEdges,
      visitingEdge: this.visiting + "-" + neighbour,
      output,
    };
  }

  private visitMinCostNode(): GraphState {
    let output: string[] = [];

    let minCost = Number.POSITIVE_INFINITY;
    let minNode = -1;
    output.push("List of unvisited rechable nodes:");
    for (let i = 0; i < this.costs.length; ++i) {
      if (!this.visited[i] && this.costs[i] !== Number.POSITIVE_INFINITY) {
        output.push("Reaching " + i + " costs " + this.costs[i]);
        if (this.costs[i] < minCost) {
          minCost = this.costs[i];
          minNode = i;
        }
      }
    }

    if (minNode === -1) {
      this.done = true;
      this.visiting = -1;
      output.push("No more reachable nodes");
      output.push("MST complete");
      return {
        visitedNodes: this.visited,
        visitingNode: this.visiting,
        visitedEdges: this.visitedEdges,
        output,
      };
    }

    this.visiting = minNode;
    this.visited[minNode] = true;
    this.visitedEdges[this.shortestPathToNode[minNode]][minNode] = true;
    this.visitedEdges[minNode][this.shortestPathToNode[minNode]] = true;

    output.push("Visiting minimum cost node " + minNode);

    for (const node of this.adjacencyList.get(minNode)!) {
      if (!this.visited[node[0]]) {
        this.neighbours.push(node);
      }
    }

    return {
      visitedNodes: this.visited,
      visitingNode: minNode,
      visitedEdges: this.visitedEdges,
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
    } else if (this.neighbours.length > 0) {
      return this.updateNeighbourCost();
    } else {
      return this.visitMinCostNode();
    }
  }
}
