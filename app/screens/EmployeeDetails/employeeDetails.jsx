import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployee } from '$RMODULES/employees/employees'
import { toTitleCase } from '$UTILS'

const renderEmployeeList = (names) => {
  if (names.length === 0) {
    names[0] = 'No Subordinates'
  }

  return (
    <ul className='grid-center padded-tb-l t-center'>
      {names.map(name => <li className='col-12 margin-bottom-m' key={name}>{name}</li>)}
    </ul>
  )
}

const EmployeeDetails = () => {
  const dispatch = useDispatch()
  const { name : inputName } = useParams()
  const name = toTitleCase(inputName)
  const { error, employeeGraph } = useSelector(({ employees } = {}) => employees)

  useEffect(() => {
    if (employeeGraph === null || !employeeGraph.nodes[name]) {
      dispatch(fetchEmployee(name))
    }
  }, [])

  return (
    <div className='grid full-height'>
      <Link className='col-12 padded-l link' to='/'>&lt;&lt; Go back</Link>
      <div className='grid-center grid-middle full-height col-12'>
        <div className='col'>
          <h1 className='grid-center'>{name}</h1>
          {employeeGraph && renderEmployeeList(employeeGraph.findAllEmployeesFrom(name))}
          {error && <p className='grid-center padded-tb-l'>({error})</p>}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDetails

