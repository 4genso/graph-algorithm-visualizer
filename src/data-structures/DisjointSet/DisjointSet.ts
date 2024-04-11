export class DisjointSet {
  private parent: number[];
  private rank: number[];

  constructor(totalNodes: number) {
    this.parent = Array.from({ length: totalNodes }, (_, index) => {
      return index;
    });
    this.rank = Array(totalNodes).fill(0);
  }

  public find(root: number): number {
    if (this.parent[root] === root) {
      return root;
    }

    this.parent[root] = this.find(this.parent[root]);
    return this.parent[root];
  }

  public union(node1: number, node2: number): void {
    const node1Parent = this.find(node1);
    const node2Parent = this.find(node2);
    if (node1Parent === node2Parent) {
      return;
    }

    const node1Rank = this.rank[node1];
    const node2Rank = this.rank[node2];

    if (node1Rank < node2Rank) {
      this.parent[node1] = node2;
    } else if (node1Rank > node2Rank) {
      this.parent[node2] = node1;
    } else {
      this.parent[node2] = node1;
      this.rank[node1]++;
    }
  }
}
