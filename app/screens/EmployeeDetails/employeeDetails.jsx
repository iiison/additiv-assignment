import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toTitleCase } from '$UTILS'

import { getEmployees } from './employeesHelpers'

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
  const [subordinates, setSubordinates] = useState(null)
  const [error, setError] = useState(null)

  const { name : inputName } = useParams()
  const name = toTitleCase(inputName)

  useEffect(async () => {
    const { allSubordinates, error } = await getEmployees(inputName)

    if (error !== undefined) {
      setError(error.message)
    } else {
      setSubordinates(allSubordinates)
    }
  }, [])

  return (
    <div className='grid full-height'>
      <Link className='col-12 padded-l link' to='/'>&lt;&lt; Go back</Link>
      <div className='grid-center grid-middle full-height col-12'>
        <div className='col'>
          <h1 className='grid-center'>{name}</h1>
          {subordinates && renderEmployeeList(subordinates)}
          {error && <p className='grid-center padded-tb-l'>({error})</p>}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDetails

