import { get } from '$UTILS/requestHandler'
import { Digraph } from '$UTILS/Digraph'

class Employee {
  constructor({ name, designation } = {}) {
    if (!name) {
      throw new Error('please provide a name')
    }

    this.name = name
    this.designation = designation
  }
}

class EmployeeGraph extends Digraph {
  findAllEmployeesFrom(employeeName) {
    const node = this.nodes[employeeName]

    if (!node) {
      return []
    }

    const result = []
    const visitedNodesMap = Object
      .keys(this.nodes)
      .reduce((prev, curr) => ({
        ...prev,
        [curr] : false
      }), {})
    let queue = [...node.nodes]

    while (queue.length > 0) {
      const currNode = this.nodes[queue.shift()]
      const { name, nodes } = currNode

      if (visitedNodesMap[name] === false) {
        result.push(name)
        queue = queue.concat(nodes)
      }

      visitedNodesMap[name] = true
    }

    return result
  }
}

export async function getEmployeesData(employeeName, { nodes }) {
  const employeeMap = {}
  const hasDataOf = Object.keys(nodes)

  async function fetchData(names) {
    const promises = []

    for (const name of names) {
      if (!hasDataOf.includes(name)) {
        promises.push(get({ path : `assignment/employees/${name}` }))
      } else {
        promises.push(null)
      }
    }

    const responses = await Promise.allSettled(promises)

    for (let i = 0; i < promises.length; i++) {
      const { value } = responses[i]

      if (value === null) {
        continue
      }

      const { response, httpStatus } = value

      if (httpStatus !== 200) {
        continue
      }

      const name = names[i]

      employeeMap[name] = response
      hasDataOf.push(name)

      const [, directSubordinates = {}] = response
      const { "direct-subordinates" : subordinates } = directSubordinates

      if (subordinates && subordinates.length) {
        await fetchData(subordinates)
      }
    }
  }

  await fetchData([employeeName])

  return employeeMap
}

export async function makeEmployeeGraph(employeeName, previousGraph) {
  const employeesGraph = previousGraph || new EmployeeGraph()
  const employeesData = await getEmployeesData(employeeName, employeesGraph)

  function addEmployeeToGraph(names, supervisor) {
    for (const name of names) {
      let employee, subordinates

      if (employeesData[name] === undefined) {
        employee = employeesGraph.nodes[name]
      } else {
        const [ designation, directSubordinates = {} ] = employeesData[name]
        const { "direct-subordinates" : empSubordinates } = directSubordinates

        subordinates = empSubordinates
        employee = new Employee({
          name,
          designation
        })

        employeesGraph.addNode(employee)
      }
      
      if (supervisor !== undefined) {
        employeesGraph.addEdge(supervisor, name)
      }

      // if (!doesNodeAlreadyExist && subordinates && subordinates.length) {
      if (subordinates && subordinates.length) {
        addEmployeeToGraph(subordinates, name)
      }
    }
  }

  if (Object.keys(employeesData).length > 0) {
    addEmployeeToGraph([employeeName])

    return employeesGraph
  }

  return {
    error : 'Employee Not Found'
  }
}

