import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Animal } from "./Animal"
import { AnimalDialog } from "./AnimalDialog"
import AnimalRepository from "../../repositories/AnimalRepository"
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository"
import useModal from "../../hooks/ui/useModal"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import OwnerRepository from "../../repositories/OwnerRepository"

import "./AnimalList.css"
import "./cursor.css"


export const AnimalListComponent = (props) => {
    const [animals, petAnimals] = useState([])
    const [animalOwners, setAnimalOwners] = useState([])
    const [owners, updateOwners] = useState([])
    const [currentAnimal, setCurrentAnimal] = useState({ treatments: [] })
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()
    let { toggleDialog, modalIsOpen } = useModal("#dialog--animal")

    const syncAnimals = () => {
        AnimalRepository.getAll().then(data => petAnimals(data))
    }

    useEffect(() => {
        OwnerRepository.getAllCustomers().then(updateOwners)
        AnimalOwnerRepository.getAll().then(setAnimalOwners)
        syncAnimals()
    }, [])

    const showTreatmentHistory = animal => {
        setCurrentAnimal(animal)
        toggleDialog()
    }

    useEffect(() => {
        const handler = e => {
            if (e.keyCode === 27 && modalIsOpen) {
                toggleDialog()
            }
        }

        window.addEventListener("keyup", handler)

        return () => window.removeEventListener("keyup", handler)
    }, [toggleDialog, modalIsOpen])
//this function filters the animal array and inside the filter we match the animalOwner userId to the current user which we defined and if it returns true
// it filters that animal object into filtered animals which gets returned by this function 
    const filteredAnimalOwners = () => {
        const currentUser = getCurrentUser().id
        const filteredAnimals = animals.filter(animal => {
            for (const animalOwner of animal.animalOwners) {
                 if (animalOwner.userId === currentUser){
                    return true
            }}})

            return filteredAnimals
        }


    return (

            <>
                <AnimalDialog toggleDialog={toggleDialog} animal={currentAnimal} />


                {
                    getCurrentUser().employee
                        ? ""
                        : <div className="centerChildren btn--newResource">
                            <button type="button"
                                className="btn btn-success "
                                onClick={() => { history.push("/animals/new") }}>
                                Register Animal
                            </button>
                        </div>
                }


                <ul className="animals">
                    {
                        getCurrentUser().employee
                            ?
                            animals.map(anml =>
                                <Animal key={`animal--${anml.id}`} animal={anml}
                                    animalOwners={animalOwners}
                                    owners={owners}
                                    syncAnimals={syncAnimals}
                                    setAnimalOwners={setAnimalOwners}
                                    showTreatmentHistory={showTreatmentHistory}
                                />)
                            :
                            filteredAnimalOwners().map(anml =>
                                <Animal key={`animal--${anml.id}`} animal={anml}
                                    animalOwners={animalOwners}
                                    owners={owners}
                                    syncAnimals={syncAnimals}
                                    setAnimalOwners={setAnimalOwners}
                                    showTreatmentHistory={showTreatmentHistory}
                                />)
                    }
                </ul>
            </>
        )
    }
