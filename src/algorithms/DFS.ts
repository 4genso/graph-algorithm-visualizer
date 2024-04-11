import { Graph } from "../types/Graph.type";
import { GraphState } from "../types/GraphState.type.ts";
import { Algorithm } from "./Algorithm.ts";
import { UnweightedEdgesToAdjacencyList } from "./UnweightedEdgesToAdjacencyList.ts";

export class DFS extends Algorithm {
  protected done: boolean;
  private visited: boolean[];
  private visiting: number;
  private adjacencyList: Map<number, number[]>;
  private stack: number[];
  private neighbours: number[];

  constructor(graph: Graph) {
    super();
    this.done = false;
    this.visited = Array(graph.totalNodes).fill(false);
    this.adjacencyList = UnweightedEdgesToAdjacencyList(
      graph.edges,
      graph.totalNodes,
      graph.directed,
    );
    this.stack = [];
    this.stack.push(graph.start);
    this.visiting = graph.start;
    this.neighbours = [];
  }

  private checkNeighbourNode(): GraphState {
    let neighbour: number = this.neighbours.shift()!;
    let output: string[] = [];

    if (this.visited[neighbour]) {
      output.push("Neighbour " + neighbour + " has been visited before");
    } else {
      this.stack.push(neighbour);
      output.push(
        "Neighbour " +
          neighbour +
          " has not been visited before, adding it to the stack",
      );
    }

    return {
      visitedNodes: this.visited,
      visitingNode: this.visiting,
      visitingEdge: this.visiting + "-" + neighbour,
      output,
    };
  }

  private visitNode(): GraphState {
    let output: string[] = [];

    if (this.stack.length > 0) {
      this.visiting = this.stack.pop()!;
      output.push("Visited " + this.visiting.toString());

      this.visited[this.visiting] = true;

      if (this.adjacencyList.get(this.visiting)) {
        for (const node of this.adjacencyList.get(this.visiting)!) {
          this.neighbours.push(node);
        }
      }
    }

    while (
      this.stack.length > 0 &&
      this.visited[this.stack[this.stack.length - 1]] === true
    ) {
      this.stack.pop();
    }

    return {
      visitedNodes: this.visited,
      visitingNode: this.visiting,
      output,
    };
  }

  public nextStep(): GraphState {
    if (this.stack.length === 0 && this.neighbours.length === 0) {
      this.visiting = -1;
      this.done = true;
    }

    if (this.isFinished) {
      return {
        visitedNodes: this.visited,
        visitingNode: this.visiting,
        output: [],
      };
    } else if (this.neighbours.length > 0) {
      return this.checkNeighbourNode();
    } else {
      return this.visitNode();
    }
  }
}
