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
    let queue = node.nodes


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

export async function getEmployeesData(employeeName) {
  const employeeMap = {}

  async function fetchData(names) {
    const promises = []

    for (const name of names) {
      promises.push(get({ path : `assignment/employees/${name}` }))
    }

    const responses = await Promise.allSettled(promises)

    for (let i = 0; i < promises.length; i++) {
      const { value : { response, httpStatus } } = responses[i]

      if (httpStatus !== 200) {
        continue
      }

      const name = names[i]

      employeeMap[name] = response

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
  const employeesData = await getEmployeesData(employeeName)
  const employeesGraph = previousGraph || new EmployeeGraph()

  function addEmployeeToGraph(names, supervisor) {
    for (const name of names) {
      const [ designation, directSubordinates = {} ] = employeesData[name]
      const { "direct-subordinates" : subordinates } = directSubordinates
      const { nodes } = employeesGraph
      const allEmployeesNames = Object.keys(nodes)
      const doesNodeAlreadyExist = allEmployeesNames.includes(name)
      let employee

      if (!doesNodeAlreadyExist) {
        employee = new Employee({
          name,
          designation
        })

        employeesGraph.addNode(employee)
      }

      
      if (supervisor !== undefined) {
        employeesGraph.addEdge(supervisor, name)
      }

      if (!doesNodeAlreadyExist && subordinates && subordinates.length) {
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
