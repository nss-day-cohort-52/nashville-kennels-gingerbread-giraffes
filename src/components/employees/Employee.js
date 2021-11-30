import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"
import { get } from "http";


export default ({ employee }) => {
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])

    //Need to match the employee ID to the userId on each animal caretaker object and count the matches to store in a variable to be called in the JSX
    useEffect(() => {
        setCount(resource?.animals?.length)
    }, [resource])
    
    useEffect(() => {
        if (resource?.employeeLocations?.length > 0) {
            markLocation(resource.employeeLocations[0])
        }
    }, [resource])

    return (
        <article className={classes}>
            <section className="card-body">
                <img alt="Kennel employee icon" src={person} className="icon--person" />
                <h5 className="card-title">
                    {
                        employeeId
                            ? resource.name
                            : <Link className="card-link"
                                to={{
                                    pathname: `/employees/${resource.id}`,
                                    state: { employee: resource }
                                }}>
                                {resource.name}
                            </Link>

                    }
                </h5>
                {
                    employeeId
                        ? <>
                            <section>
                                Caring for {animalCount} animals
                            </section>
                            <section>
                                Working at unknown location
                            </section>
                        </>
                        : ""
                }
{/* below we have a ternary statement saying if the employee property on the current user = true then render a fire button,
when clicked, delete the employee from the database via the Id and route the user back to the employees page */}
                {
                    getCurrentUser().employee
                    ? <button className="btn--fireEmployee" 
                    onClick={() => {EmployeeRepository.delete(employeeId)}}
                    ><Link to= {`/employees`}>Fire</Link></button>
                    : ""
                }

            </section>

        </article>
    )
}


