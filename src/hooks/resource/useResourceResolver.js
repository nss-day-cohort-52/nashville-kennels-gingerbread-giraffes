import { useEffect, useState } from "react"

const useResourceResolver = () => { // declaring a function

    const [resource, setResource] = useState({}) //useState resource is a variable
    // setResource is a fucntion that will set data into the resource variable

    useEffect(() => { //
       console.log('resolved resource', resource)
    }, [resource]) //dependency array with useEffect that will be triggered anytime resource changes

    const resolveResource = (property, param, getter) => { //all three are parameters
        //named after what they are going to represent. Expecting to pass property, param, and getter
        // Resource passed as prop
        if (property && "id" in property) { //if property exist and has id run setResource(property)
            setResource(property)
        }
        else {
            // If being rendered indepedently
            if (param) { // will look for param to see if exist and if it does will run getter function
                getter(param).then(retrievedResource => { //will set anything 
                    setResource(retrievedResource)
                })
            }
        }
    }

    //if,on line 15, the object already exist it will use the setter function to set the resource variable to the object.
    //else statement if object doesn't exist the else statement will use paramter and getter function to go find object and
    //and set it

    return { resolveResource, resource }
}

export default useResourceResolver //default is when there is only one export from entire module

//useResourceResolver is a function 