import React from "react"
import { Route } from "react-router-dom"

import Employee from "./employees/Employee"
import EmployeeForm from "./employees/EmployeeForm"
import { EmployeeList } from "./employees/EmployeeList"

export default () => {
    return (
        <>
            <Route exact path="/employees">
                <EmployeeList/>
            </Route>
            <Route path="/employees/create">
                <EmployeeForm />
            </Route>
            <Route path="/employees/:employeeId(\d+)">
                <Employee />
            </Route>
        </>
    )
}
