import React, { Suspense, lazy } from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'

const Home = lazy(() => import('$SCREENS/Home/home'))
const EmployeeDetails = lazy(() => import('$SCREENS/EmployeeDetails/employeeDetails'))

const routes = () => {
  return (
    <div className='app grid'>
      <div className='col'>
        <Suspense fallback={<div className='t-center secondary-color'>Loading...</div>}>
          <Switch>
            <Route path='/' component={Home} exact />
            <Route path='/employees/:name' component={EmployeeDetails} />
          </Switch>
        </Suspense>
      </div>
    </div>
  )
}

export default routes
//             <Route path='/employees/:name' component={EmployeeDetails} />

