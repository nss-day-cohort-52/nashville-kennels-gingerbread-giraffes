import React from "react"
import { Route } from "react-router-dom"

import Employee from "./employees/Employee"
<<<<<<< HEAD

=======
import {EmployeeListComponent} from "./employees/EmployeeList"
>>>>>>> main
import EmployeeForm from "./employees/EmployeeForm"
import { EmployeeList } from "./employees/EmployeeList"

export default () => {
    return (
        <>
            <Route exact path="/employees">
<<<<<<< HEAD
                <EmployeeList/>
=======
                <EmployeeListComponent />
>>>>>>> main
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
