import React, { useState, useEffect } from "react"
import Employee from "./Employee"
import EmployeeRepository from "../../repositories/EmployeeRepository"
import "./EmployeeList.css"


export const EmployeeList = () => {
    const [emps, setEmployees] = useState([])
   
 // getAll is defined in the employee repository and we are using that to get access to the employees
    //  we are then storing the fetched data in the parameter called data and using the setEmployees function to set the employees variable to the value of data 
    useEffect(
        () => {
            EmployeeRepository.getAll().then(data => setEmployees(data))
        }, [emps.length]
    )
    // using emps.length above because without .length it will infinitely loop, only triggers when the length of the array changes 
    
    return (
        <>
        <h2 className="employeesHeader">Employees</h2>
            <div className="employees">
                {
                    emps.map(a => <Employee key={a.id} employee={a} />) 
                }
            </div>
        </>
    )} 
    

