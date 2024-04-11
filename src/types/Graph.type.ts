import { Edge } from "./Edge.type";

export type Graph = {
  totalNodes: number;
  start: number;
  edges: Edge[];
  directed: boolean;
};
