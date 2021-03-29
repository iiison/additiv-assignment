/* eslint-disable */
import React, { useEffect } from 'react'
import { useParams, useHistory, withRouter, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployee } from '$RMODULES/employees/employees'
import { toTitleCase } from '$UTILS'

const renderEmployeeList = (names) => {
  return (
    <ul className='grid-center padded-tb-l t-center'>
      {names.map(name => <li className='col-12 margin-bottom-m' key={name}>{name}</li>)}
    </ul>
  )
}

const EmployeeDetails = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { name : inputName } = useParams()
  const name = toTitleCase(inputName)
  const { error, employeeGraph } = useSelector(({ employees } = {}) => employees)

  useEffect(() => dispatch(fetchEmployee(name)), [])

  return (
    <div className='grid full-height'>
      <span className='col-12' onClick={() => history.push('/')}>Go Back</span>
      <Link className='col-12' to='/'>Go back</Link>
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

