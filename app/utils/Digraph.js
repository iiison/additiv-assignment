export class Digraph {
  constructor() {
    this.nodes = {}
  }

  addNode(node) {
    const { name } = node

    if (!name) {
      throw new Error('Pass the node name')
    }

    if (!this.nodes[name]) {
      this.nodes[name] = {
        ...node,
        nodes : []
      }
    }
  }

  addEdge(srcName, targetName) {
    const { nodes } = this

    if (!nodes[srcName] || !nodes[targetName]) {
      throw new Error('one of the nodes does not exist.')
    }

    const srcNode = nodes[srcName]

    if (!srcNode.nodes.includes(targetName)) {
      srcNode.nodes.push(targetName)
    }
  }
}
