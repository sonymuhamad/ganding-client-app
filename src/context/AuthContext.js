import { createContext } from "react"


export const AuthContext = createContext(

    {
        user: {
            name: null,
            division: null,
            token: null,
            groups: [],
        },
        signIn: () => { },
        signOut: () => { },
        loggedUser: null,
        resetToken: () => { },
        changeDivision: () => { },
        restrictedAccessHandler: () => { }
    }
)

