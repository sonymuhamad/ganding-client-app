import { createContext } from "react"


export const AuthContext = createContext(

    {
        user: {
            name: null,
            group: null,
            token: null
        },
        signIn: () => { },
        signOut: () => { },
        loggedUser: null,
        setLoginUser: () => { },
        setRedirect: () => { },
    }
)

