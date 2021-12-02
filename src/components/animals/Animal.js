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

    useEffect(() => {
        setAuth(getCurrentUser().employee)
        resolveResource(animal, animalId, AnimalRepository.get)
        //animalId is passed to animalRepository.get which returns animal, this is the order of operations for useResourceResolver
    }, [])

    useEffect(() => {
        if (owners) { //!if there is a parameter 
            registerOwners(owners)  //!then place the value of parameter as registeredOwners that will fill the allOwners variable
        }
    }, [owners]) //! the useEffect will update anytime owners is changed


    const getPeople = () => { //!creating a function
        return AnimalOwnerRepository  //! returning .getOwnersByAnimals method from AnimalOwnerRepository
            .getOwnersByAnimal(currentAnimal.id) //!getting user data based off id of current animal
            .then(people => setPeople(people)) //confused how this logic is being passed down...can we code this out
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
    // // going through the currentAnimal and animalCareTaker array and returning the caretaker.user.name array
    let ownerArray = currentAnimal?.animalOwners?.map(owner => owner.user.name).join(", ")

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

                            {
                                myOwners.length < 2
                                    ? <select defaultValue=""
                                        name="owner"
                                        className="form-control small"
                                        onChange={() => { }} >
                                        <option value="">
                                            Select {myOwners.length === 1 ? "another" : "an"} owner
                                        </option>
                                        {
                                            allOwners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                        }
                                    </select>
                                    : null
                            }


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

                        {
                            isEmployee
                                ? <button className="btn btn-warning mt-3 form-control small"

                                    onClick={() => {
                                        AnimalOwnerRepository.removeOwnersAndCaretakers(currentAnimal.id)
                                            .then(() => { AnimalRepository.delete(currentAnimal.id); }
                                            //do a synchronous anonomous function to get all animals reference animalList.js maybe syc animals???
                                            ); 

                                        
                                            // .then (()=>{)}

                                    }

                                        // .then(() => {}) // Remove animal from animal array
                                        //.then(animal => AnimalRepository.delete(animal))  
                                        // .then(AnimalRepository.delete(currentAnimal.id))   //!getting 404 erro    

                                        // Get all animals that are in animal array.
                                    }>Discharge</button>
                                : ""
                        }

                    </details>
                </div>
            </li>
        </>
    )
}
