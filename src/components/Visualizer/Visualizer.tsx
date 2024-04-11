import { GraphCanvas, GraphNode, GraphEdge } from "reagraph";

type VisualizerProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
};

function Visualizer({ nodes, edges, directed }: VisualizerProps) {
  return (
    <div className="my-3 flex relative h-96 w-full mb-3 border-black border-2">
      <GraphCanvas
        edgeLabelPosition="natural"
        labelType="all"
        edgeArrowPosition={directed ? "end" : "none"}
        nodes={nodes}
        edges={edges}
      />
    </div>
  );
}

export default Visualizer;
