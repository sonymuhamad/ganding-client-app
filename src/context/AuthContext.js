import { createContext } from "react"


export const AuthContext = createContext(

    {
        user: {
            name: null,
            division: null,
            token: null
        },
        signIn: () => { },
        signOut: () => { },
        loggedUser: null,
        setLoginUser: () => { },
        setRedirect: () => { },
    }
)

