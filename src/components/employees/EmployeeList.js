import React, { useState, useEffect } from "react"
import Employee from "./Employee"
import EmployeeRepository from "../../repositories/EmployeeRepository" //all the functions under default from EmployeeRepository will be available for use on the page
import "./EmployeeList.css"


export default () => {
    const [emps, setEmployees] = useState([])

    useEffect(
        () => {
            EmployeeRepository.getAll() //this is running the getAll() function from employeeRepository.
        }, []
    )

    return (
        <>
            <div className="employees">
                {
                    emps.map(a => <Employee key={a.id} employee={a} />)  
                }
            </div>
        </>
    )
}
