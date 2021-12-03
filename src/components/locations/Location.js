import React from "react"
import { Link } from "react-router-dom"
import locationImage from "./location.png"
import "./Location.css"
import { AnimalListComponent } from "../animals/AnimalList"


export default ({location}) => {
  
    return (
        <article className="card location" style={{ width: `18rem` }}>
            <section className="card-body">
                <img alt="Kennel location icon" src={locationImage} className="icon--location" />
                <h5 className="card-title">
                    {/* the link below makes the location names clickable and then routes to the individual location's page */}
                    <Link className="card-link"
                        to={{
                            pathname: `/locations/${location.id}`,
                            state: { location: location }
                        }}>
                        {location.name}
                    </Link>
                </h5>
            </section>
            <section>
                Total animals {location.animals.length}
            </section>
            <section>
                Total employees {location.employeeLocations.length}
            </section>
        </article>
    )
}
