import { Graph } from "../types/Graph.type";
import { GraphState } from "../types/GraphState.type.ts";
import { Algorithm } from "./Algorithm.ts";
import { WeightedEdgesToAdjacencyList } from "./WeightedEdgesToAdjacencyList.ts";

export class Dijkstra extends Algorithm {
  protected done: boolean;
  private visitedNodes: boolean[];
  private visiting: number;
  private adjacencyList: Map<number, number[][]>;
  private costs: number[];
  private neighbours: number[][];
  private visitedEdges: boolean[][];
  private shortestPathToNode: number[];
  private startingNode: number;

  constructor(graph: Graph) {
    super();
    this.done = false;
    this.visitedNodes = Array(graph.totalNodes).fill(false);
    this.adjacencyList = WeightedEdgesToAdjacencyList(
      graph.edges,
      graph.totalNodes,
      graph.directed,
    );
    this.visiting = graph.start;
    this.startingNode = graph.start;
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

    let newCost = weight + this.costs[this.visiting];
    output.push(
      "Going to node " +
        neighbour +
        " through node " +
        this.visiting +
        " costs " +
        newCost,
    );
    if (newCost < this.costs[neighbour]) {
      this.costs[neighbour] = newCost;
      this.shortestPathToNode[neighbour] = this.visiting;
      output.push("Lower than previous cost to node " + neighbour);
      output.push("new cost updated");
    } else {
      output.push("This is not better then previous cost to node " + neighbour);
    }

    return {
      visitedNodes: this.visitedNodes,
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
      if (!this.visitedNodes[i] && this.costs[i] !== Number.POSITIVE_INFINITY) {
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
      output.push("Cost to each Node:");
      for (let i = 0; i < this.costs.length; ++i) {
        let cost: string =
          this.costs[i] !== Number.POSITIVE_INFINITY
            ? this.costs[i].toString()
            : "Infinity (Unreachable)";
        output.push(
          "Node " + this.startingNode + " to " + i + " costs " + cost,
        );
      }
      return {
        visitedNodes: this.visitedNodes,
        visitingNode: this.visiting,
        visitedEdges: this.visitedEdges,
        output,
      };
    }

    this.visiting = minNode;
    this.visitedNodes[minNode] = true;
    this.visitedEdges[this.shortestPathToNode[minNode]][minNode] = true;
    this.visitedEdges[minNode][this.shortestPathToNode[minNode]] = true;

    output.push("Visiting minimum cost node " + minNode);

    for (const node of this.adjacencyList.get(minNode)!) {
      if (!this.visitedNodes[node[0]]) {
        this.neighbours.push(node);
      }
    }

    return {
      visitedNodes: this.visitedNodes,
      visitingNode: this.visiting,
      visitedEdges: this.visitedEdges,
      output,
    };
  }

  public nextStep(): GraphState {
    if (this.isFinished) {
      return {
        visitedNodes: this.visitedNodes,
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
