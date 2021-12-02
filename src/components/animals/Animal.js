import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import OwnerRepository from "../../repositories/OwnerRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import "./AnimalCard.css"

export const Animal = ({ animal, syncAnimals,
    showTreatmentHistory, owners }) => {
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [isEmployee, setAuth] = useState(false)
    const [myOwners, setPeople] = useState([])
    const [allOwners, registerOwners] = useState([])
    const [classes, defineClasses] = useState("card animal")
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()
    const { animalId } = useParams()
    const { resolveResource, resource: currentAnimal } = useResourceResolver()
    //this is a hook, see useResourceResolver.js, that has useState and useEffect that
    //has placeholders for props being passed or params being passed. It returns resolveResource and resource
    //after being passed through useResourceResolver()
    const [description, updateDescription] = useState({
        description: ""
    }) //defined a variable and setter function for useState and set the initial description value to an empty string to be changed via user input

    useEffect(() => {
        setAuth(getCurrentUser().employee)
        resolveResource(animal, animalId, AnimalRepository.get)
        //animalId is passed to animalRepository.get which returns animal, this is the order of operations for useResourceResolver
    }, [])

    useEffect(() => {
        if (owners) {
            registerOwners(owners)
        }
    }, [owners])


    const getPeople = () => {
        return AnimalOwnerRepository
            .getOwnersByAnimal(currentAnimal.id)
            .then(people => setPeople(people))
    }


    useEffect(() => {
        getPeople()
    }, [currentAnimal])

    useEffect(() => {
        if (animalId) {
            defineClasses("card animal--single")
            setDetailsOpen(true)

            AnimalOwnerRepository.getOwnersByAnimal(animalId).then(d => setPeople(d))
                .then(() => {
                    OwnerRepository.getAllCustomers().then(registerOwners)
                })
        }
    }, [animalId])


    let newArray = currentAnimal?.animalCaretakers?.map(caretaker => caretaker.user.name).join(", ")
    // going through the currentAnimal and animalCareTaker array and returning the caretaker.user.name array
    let ownerArray = currentAnimal?.animalOwners?.map(owner => owner.user.name).join(", ")
    //created a saveTreatment function to capture the user input from the textfield and post it to our treatments array in our database 
    // it also rerenders the animals page once the function is called with history.push
    const saveTreatment = (evt) => {
        evt.preventDefault()

        const savedTreatment = {
            description: description.description,
            animalId: currentAnimal?.id,
            timestamp: new Date().getTime(),
        }

        const fetchOption = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(savedTreatment)
        }

        return fetch("http://localhost:8088/treatments", fetchOption)
            .then(() => {
                history.push("/animals")
            })
    }
    const saveOwner = (event) => {


        const savedOwner = {
            userId: parseInt(event.target.value),
            animalId: currentAnimal?.id

        }

        const fetchOption = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(savedOwner)
        }

        return fetch("http://localhost:8088/animalOwners", fetchOption)
            .then(() => {
                history.push("/animals")
            })
    }

    return (
        <>
            <li className={classes}>
                <div className="card-body">
                    <div className="animal__header">
                        <h5 className="card-title">
                            <button className="link--card btn btn-link"
                                style={{
                                    cursor: "pointer",
                                    "textDecoration": "underline",
                                    "color": "rgb(94, 78, 196)"
                                }}
                                onClick={() => {
                                    if (isEmployee) {
                                        showTreatmentHistory(currentAnimal)
                                    }
                                    else {
                                        history.push(`/animals/${currentAnimal.id}`)
                                    }
                                }}> {currentAnimal.name} </button>
                        </h5>
                        <span className="card-text small">{currentAnimal.breed}</span>
                    </div>

                    <details open={detailsOpen}>
                        <summary className="smaller">
                            <meter min="0" max="100" value={Math.random() * 100} low="25" high="75" optimum="100"></meter>
                        </summary>

                        <section>
                            <h6>Caretaker(s)</h6>
                            <span className="small">
                                {newArray}

                            </span>


                            <h6>Owners</h6>
                            <span className="small">
                                {ownerArray}
                            </span>
                            {/*                            ternary below is checking if only one owner exists and also if the logged in user is an employee
                            if those conditions are met then it will render the dropdown to select an additional owner, if those conditions are not met then it renders nothing */}
                            {
                                myOwners.length < 2 && isEmployee
                                    ? <select defaultValue=""
                                        name="owner"
                                        className="form-control small"
                                        onChange={(event) => {
                                            saveOwner(event)
                                        }} >
                                        <option value="">
                                            Select {myOwners.length === 1 ? "another" : "an"} owner
                                        </option>
                                        {
                                            allOwners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                        }
                                    </select>
                                    : null
                            }

                            {/* if detailsOpen and treatments exist on currentAnimal then display treatment history if they are not found then render nothing  */}
                            {
                                detailsOpen && "treatments" in currentAnimal
                                    ? <div className="small">
                                        <h6>Treatment History</h6>
                                        {
                                            currentAnimal.treatments.map(t => (
                                                <div key={t.id}>
                                                    <p style={{ fontWeight: "bolder", color: "grey" }}>
                                                        {new Date(t.timestamp).toLocaleString("en-US")}
                                                    </p>
                                                    <p>{t.description}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    : ""
                            }

                        </section>
                        {/* ternary below checks whether the logged in user is a customer or employee and if the user is an employee it renders a discharge button */}
                        {
                            isEmployee
                                ? <button className="btn btn-warning mt-3 form-control small" onClick={() =>
                                    AnimalOwnerRepository
                                        .removeOwnersAndCaretakers(currentAnimal.id)
                                        .then(() => { }) // Remove animal
                                        .then(() => { }) // Get all animals
                                }>Discharge</button>
                                : ""
                        }

                        {
                            isEmployee //ternary statement to check if the user is an employee, if they are then render the treatment input instructions, if not display an empty string
                                ? <label htmlFor="treatmentInstructions">Enter treatment description:</label> : ""
                        }
                        {
                            isEmployee //ternary statement to check if the user is an employee, if they are then render the text area input box
                                ?
                                <input className="textArea"
                                    onChange={
                                        (evt) => {
                                            //creates a copy of animal state
                                            const copy = { ...description }
                                            copy.description = evt.target.value
                                            updateDescription(copy)
                                        }
                                    }
                                >
                                </input>
                                : ""
                        }{isEmployee ? <button onClick={saveTreatment}>Submit Treatment</button> : ""}
                    </details>
                </div>
            </li>
        </>
    )
}
