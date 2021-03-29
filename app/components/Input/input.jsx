import React from 'react'
import { PropTypes } from 'prop-types'

import styles from './styles.css'

const Input = ({
  events = {},
  value = '',
  type = 'text',
  classes = '',
  placeholder = 'Enter...'
}) => {
  return (
    <input
      {...events}
      type={type}
      value={value}
      placeholder={placeholder}
      className={`${styles.pinInput} ${classes}`}
    />
  )
}

Input.propTypes = {
  events : PropTypes.shape({
    onFocus  : PropTypes.func,
    onKeyUp  : PropTypes.func,
    onBlur   : PropTypes.func,
    onChange : PropTypes.func.isRequired
  }),
  value       : PropTypes.string,
  classes     : PropTypes.string,
  placeholder : PropTypes.string,
  type        : PropTypes.string
}

export default Input

