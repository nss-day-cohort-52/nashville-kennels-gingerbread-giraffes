import React, { useState, useContext, useEffect } from "react"
import "./AnimalForm.css"
import AnimalRepository from "../../repositories/AnimalRepository";
import LocationRepository from "../../repositories/LocationRepository";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import { useHistory } from "react-router"


export default (props) => {
    const [animalName, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [animals, setAnimals] = useState([])
    const [locations, setLocations] = useState([])
    const [employees, setEmployees] = useState([])
    const [employeeId, setEmployeeId] = useState(0)
    const [locationId, setLocationId] = useState(0)
    const [saveEnabled, setEnabled] = useState(false)
    const history = useHistory()

    useEffect(() => {
        LocationRepository.getAll().then(loc => setLocations(loc))
    }, [])

    useEffect(() => {
        EmployeeRepository.getEmployeesByLocation(locationId).then(emp => setEmployees(emp))
    }, [locationId])

    const constructNewAnimal = evt => {
        evt.preventDefault()
        const locId = parseInt(locationId)
        const eId = parseInt(employeeId)
        if (locId === 0) {
            window.alert("Please select a location")
        }
        else if (eId === 0) {
            window.alert("Please select a caretaker")
        } else {
            const emp = employees.find(e => e.id === eId)
            const animal = {
                name: animalName,
                breed: breed,
                employeeId: eId,
                locationId: locId
            }

            AnimalRepository.addAnimal(animal)
                .then(() => setEnabled(true))
                .then(() => history.push("/animals"))
        }
    }

    return (
        <form className="animalForm">
            <h2>Admit Animal to a Kennel</h2>
            <div className="form-group">
                <label htmlFor="animalName">Animal name</label>
                <input
                    type="text"
                    required
                    autoFocus
                    className="form-control"
                    onChange={e => setName(e.target.value)}
                    id="animalName"
                    placeholder="Animal name"
                />
            </div>
            <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input
                    type="text"
                    required
                    className="form-control"
                    onChange={e => setBreed(e.target.value)}
                    id="breed"
                    placeholder="Breed"
                />
            </div>
            <div className="form-group">
                <label htmlFor="location">Choose the location you would like to use</label>
                <select
                    defaultValue=""
                    name="location"
                    id="locationId"
                    className="form-control"
                    onChange={event => setLocationId(event.target.value)}
                >
                    <option value="">Select a location</option>
                    {locations.map(loc => (
                        <option key={loc.id} id={loc.id} value={loc.id}>
                            {loc.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="employee">Make an appointment with a caretaker</label>
                <select
                    defaultValue=""
                    name="employee"
                    id="employeeId"
                    className="form-control"
                    onChange={event => setEmployeeId(event.target.value)}
                >
                    <option value="">Select an employee</option>
                    {employees.map(e => (
                        <option key={e.user.id} id={e.user.id} value={e.user.id}>
                            {e.user.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit"
                onClick={constructNewAnimal}
                disabled={saveEnabled}
                className="btn btn-primary"> Submit </button>
        </form>
    )
}
