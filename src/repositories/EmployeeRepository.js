import Settings from "./Settings"
import { fetchIt } from "./Fetch"

export default {
    async get(id) {     //feed this funct an id as a parameter 
        const userLocations = await fetchIt(`${Settings.remoteURL}/employeeLocations?userId=${id}&_expand=location&_expand=user`) 
        //this variable is declared and fetches a specific employee location object which matches the id fed as a parameter and expands location and user
        return await fetchIt(`${Settings.remoteURL}/animalCaretakers?userId=${id}&_expand=animal`)
            .then(data => {     //data is parameter which holds the fetched data
                const userWithRelationships = userLocations[0].user //declares var and sets equal to the fetched user
                userWithRelationships.locations = userLocations //adds a location property to the variable and sets equal to the fetched employeelocation
                userWithRelationships.animals = data //adds an animal property to var set = to the fetched data param
                return userWithRelationships //returns var w/ location and animal properties
            })
    },
    async delete(id) {
        return await fetchIt(`${Settings.remoteURL}/users/${id}`, "DELETE")
    }
    ,
    async addEmployee(employee) {
        return await fetchIt(`${Settings.remoteURL}/users`, "POST", JSON.stringify(employee))
    },
    async assignEmployee(rel) {
        return await fetchIt(`${Settings.remoteURL}/employeeLocations`, "POST", JSON.stringify(rel))
    },
    async getEmployeesByLocation (locationId) {
        const e = await fetch(`${Settings.remoteURL}/employeeLocations?locationId=${locationId}&_expand=user`)
        return await e.json()
    },
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/users?employee=true&_embed=employeeLocations`)
    }
}

//async is telling it load all these resources at the same time 
//Async functions always return a promise. If the return value 
