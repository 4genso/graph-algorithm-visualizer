import { Graph } from "../../types/Graph.type";
import { NodeColor } from "./NodeColor.ts";
import { GraphNode } from "reagraph";

export default function generateNodes(
  graph: Graph,
  visitingNode?: number,
  visitiedNodes?: boolean[],
): GraphNode[] {
  return Array.from({ length: graph.totalNodes }, (_, index) => {
    const id: string = index.toString();
    let fill: string;
    let subLabel: string;
    if (visitingNode && index === visitingNode) {
      fill = NodeColor.VISITING;
      subLabel = "visiting";
    } else if (visitiedNodes && visitiedNodes[index]) {
      fill = NodeColor.VISITED;
      subLabel = "visitied";
    } else {
      fill = NodeColor.NOT_VISITED;
      subLabel = "";
    }

    return {
      id,
      label: id,
      subLabel,
      fill,
    };
  });
}
