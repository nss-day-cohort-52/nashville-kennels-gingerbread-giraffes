import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"
import { get } from "http";
import LocationRepository from "../../repositories/LocationRepository";
import {useHistory} from "react-router"
import LocationDetail from "../locations/LocationDetail";


export default ({ employee }) => {
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({name:""})
    const [classes, defineClasses] = useState("card employee")
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver() //
    const [allLocations, saveLocations] = useState([])
    const history = useHistory()
   
    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])
    
    useEffect(() => {
        LocationRepository.getAll()
        .then(data => saveLocations(data))
    }, [])
    //Need to match the employee ID to the userId on each animal caretaker object and count the matches to store in a variable to be called in the JSX
    useEffect(() => {
        setCount(resource?.animals?.length)
    }, [resource])
    
    useEffect(() => {
        if (resource?.employeeLocations?.length > 0) {
            markLocation(resource?.employeeLocations[0])
        }
    }, [resource])
    
    const saveLocation = (event) => {
        EmployeeRepository.assignEmployee(parseInt(event.target.value), parseInt(employeeId)).then(EmployeeRepository.getAll)
    }
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
                                Working at {location?.name} location
                            </section>
                        </>
                        : ""
                }
                {
                    employeeId
                    ?
                    <select defaultValue=""
                            name="locationAssigner"
                            className="form-control small"
                            onChange={(event) => {
                                saveLocation(event)
                            }} >
                            <option value="">
                                Select {location.length === 1 ? "another" : "an"} location
                            </option>
                            {
                                allLocations.map(location => <option key={location.id} value={location.id}>{location.name}</option>)
                            }
                        </select>
                 : "" }
                {/* below we have a ternary statement saying if the employee property on the current user = true then render a fire button,
                                when clicked, delete the employee from the database via the Id and route the user back to the employees page */}
                {
                    getCurrentUser().employee && employeeId
                        ? <button className="btn--fireEmployee"
                            onClick={() => { EmployeeRepository.delete(employeeId) }}
                        ><Link to={`/employees`}>Fire</Link></button>
                        : ""
                }

            </section>

        </article>
    )
}


