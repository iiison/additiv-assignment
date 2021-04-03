import { get } from '$UTILS/requestHandler'

export async function getEmployees(employeeName) {
  const employeeMap = {}
  const hasDataOf = []
  let allSubordinates = []

  async function fetchData(names) {
    let promises = []

    for (const name of names) {
      if (!hasDataOf.includes(name)) {
        promises.push(get({ path : `assignment/employees/${name}` }))
      } else {
        promises.push(null)
      } }

    promises = promises.map(promise => {
      if (promise !== null) {
        return promise.catch(err => err)
      }

      return promise
    })

    const responses = await Promise.all(promises)

    for (let i = 0; i < promises.length; i++) {
      if (promises[i] === null) {
        continue
      }

      const { response, httpStatus } = responses[i]

      if (httpStatus === 404) {
        throw new Error('Employee not found')
      }

      if (httpStatus !== 200) {
        continue
      }

      const name = names[i]

      employeeMap[name] = response
      hasDataOf.push(name)

      const [, directSubordinates = {}] = response
      const { "direct-subordinates" : subordinates } = directSubordinates

      if (subordinates && subordinates.length) {
        allSubordinates = [...allSubordinates, ...subordinates]
        await fetchData(subordinates)
      }
    }
  }

  try {
    await fetchData([employeeName])
    return { employeeMap, allSubordinates }
  } catch(error) {
    return { error }
  }
}

