import { GraphEdge } from "reagraph";
import { Graph } from "../../types/Graph.type";

export default function parseEdges(
  graph: Graph,
  visitingEdge?: string,
  visitedEdges?: boolean[][],
): GraphEdge[] {
  return graph.edges.map((edge) => {
    const id: string = edge.source.toString() + "-" + edge.target.toString();
    const alternativeId: string =
      edge.target.toString() + "-" + edge.source.toString();

    let label: string = edge.weight === undefined ? "" : edge.weight.toString();
    if (
      visitingEdge &&
      (id === visitingEdge ||
        (!graph.directed && alternativeId == visitingEdge))
    ) {
      label = label + "(visiting)";
    } else if (visitedEdges && visitedEdges[edge.source][edge.target]) {
      label = label + "(path taken)";
    }
    return {
      source: edge.source.toString(),
      target: edge.target.toString(),
      id,
      label,
    };
  });
}
