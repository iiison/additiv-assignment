import store from '$CONFIGS/store'
import {
  makeReducer,
  makeActions
} from '$RUTILS/reduxUtils'
import { makeEmployeeGraph } from './helpers'

const GET_EMPLOYEE = 'GET_EMPLOYEE'
const UPDATE_EMPLOYEES_GRAPH = 'UPDATE_EMPLOYEES_GRAPH'
const {
  defaultAction: getEmployee,
  successAction: getEmployeeSuccess,
  failureAction: getEmployeeFailure,
} = makeActions(GET_EMPLOYEE)


// Sync Action Creators
export function updateEmployeesGraph(employeeGraph) {
  return {
    type : UPDATE_EMPLOYEES_GRAPH,
    employeeGraph
  }
}
// ***********************************************

// Async Action Creators
export function fetchEmployee(name) {
  return async (dispatch) => {
    dispatch(getEmployee())

    try {
      const employeeGraph = await makeEmployeeGraph(name, store.getState().employees.employeeGraph)

      if (employeeGraph.error === undefined) {
        dispatch(getEmployeeSuccess())
        dispatch(updateEmployeesGraph(employeeGraph))
      } else {
        dispatch(getEmployeeFailure(employeeGraph.error))
      }
    } catch (error) {
      dispatch(getEmployeeFailure(error.message || error))
    }
  }
}
// ***********************************************

export const initialState = {
  employeeGraph : null
}

const employees = makeReducer({
  actionName: GET_EMPLOYEE,
  initialState,
  additionalActions(state, action) {
    return {
      UPDATE_EMPLOYEES_GRAPH : () => ({
        ...state,
        employeeGraph : action.employeeGraph
      })
    }
  }
})

export default employees
export {
  getEmployee,
  getEmployeeFailure,
  getEmployeeSuccess,
}

