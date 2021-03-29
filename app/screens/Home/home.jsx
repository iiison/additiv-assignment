import React, { useState } from 'react'
import { Input } from '$COMPONENTS'
import { useHistory, withRouter } from 'react-router-dom';

import * as styles from './styles.css'

const onButtonClick = (employeeName, history) => () => employeeName && history.push(`/employees/${employeeName}`)
const Home = () => {
  const history = useHistory()
  const [inputValue, setInputValue] = useState('')
  const inputProps = {
    value       : inputValue,
    classes     : `${styles.employeeInput}`,
    placeholder : 'Enter Employee Name',
    events      : {
      onChange : (event) => {
        event.persist()
        setInputValue(event.target.value)
      }
    }
  }

  return (
    <div className='grid-center grid-middle full-height'>
      <div className='col-6 col_md-12'>
        <h1 className='t-center secondary-color'>Employee Explorer</h1>
        <div className='padded-l'>
          <div className='grid-center-equalHeight'>
            <Input {...inputProps} />
            <button
              className={`${styles.searchButton} t-center`}
              onClick={onButtonClick(inputValue, history)}
            >Search</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

