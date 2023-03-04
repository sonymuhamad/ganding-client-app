import { useCallback, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconAccessPointOff, IconChecks } from "@tabler/icons";
import { AuthException, Url } from "../services"
import { closeAllModals } from "@mantine/modals"

const sign_in_url = `${Url}/sign-in/`
const sign_out_url = `${Url}/sign-out/`


export const useAuth = () => {
    // handle user login logout and authentication

    const initialCompute = useCallback(() => {
        // initial computation to get user is authenticate or null

        const auth = window.localStorage.getItem('loggedUser')
        return JSON.parse(auth)
    }, [])

    const params = useParams()
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const [user, setUser] = useState(() => {
        const initialState = initialCompute()
        return initialState
    })


    const saveToLocalStorage = useCallback((data_user) => {
        const json_data_user = JSON.stringify(data_user)
        window.localStorage.setItem('loggedUser', json_data_user)
    }, [])

    const deleteFromLocalStorage = useCallback(() => {
        window.localStorage.removeItem('loggedUser')
    }, [])

    const changeDivision = useCallback((name) => {
        setUser(prev => {
            const updatedUser = { ...prev, division: name }
            saveToLocalStorage(updatedUser)
            return updatedUser
        })

        showNotification({
            title: 'Change division success',
            message: `Currently used division is changed to ${name.toUpperCase()}`,
            disallowClose: true,
            radius: 'md',
            autoClose: 3000,
            icon: <IconChecks />
        })

    }, [saveToLocalStorage])

    const setDataUser = useCallback((data_user) => {
        setUser(data_user)
        saveToLocalStorage(data_user)
    }, [saveToLocalStorage])

    const checkPreviousDivision = useCallback((groups, name_prev_group) => {
        return groups.some(group => group.name === name_prev_group)
    }, [])

    const performSaveAndRedirectAfterSignIn = useCallback((data_user) => {
        let redirect

        // redirect for user first time login
        redirect = `/home/${data_user.division}`

        if (Object.keys(params).length !== 0) {

            // redirect from expired token or restricted access
            const previousPath = params["*"].split('=')[1]
            const name_prev_division = previousPath.split('/')[2]

            if (checkPreviousDivision(data_user.groups, name_prev_division)) {
                data_user.division = name_prev_division
                redirect = previousPath
            }
        }

        setDataUser(data_user)
        navigate(redirect, { replace: true })

    }, [params, checkPreviousDivision, setDataUser, navigate])

    const signIn = useCallback(async (data) => {
        try {
            const response = await axios.post(sign_in_url, data)
            const data_user = {
                username: response.data.username,
                division: response.data.groups[0].name,
                token: response.data.oauth2_provider_accesstoken[0].token,
                groups: response.data.groups
            }

            showNotification({
                title: 'Sign In success',
                message: 'Have a great day',
                disallowClose: true,
                autoClose: 3000,
                icon: <IconChecks />
            })

            performSaveAndRedirectAfterSignIn(data_user)

        } catch (err) {
            throw new AuthException(err.response.data.error)
        }
    }, [performSaveAndRedirectAfterSignIn])

    const performSignOut = useCallback(async () => {
        try {
            await axios.post(sign_out_url, { access_token: user.token })
            setUser(null)
            deleteFromLocalStorage()
            closeAllModals()
        } catch (err) {
            throw new AuthException(err.response.data.error)
        }
    }, [deleteFromLocalStorage, user])

    const signOut = useCallback(async () => {
        try {
            await performSignOut()
            showNotification({
                title: 'Sign out success',
                disallowClose: true,
                autoClose: 3000,
                icon: <IconCheck />
            })
            navigate(`/`)
        } catch (err) {
            throw new AuthException(err.response.data.error)
        }
    }, [navigate, performSignOut])

    const resetToken = useCallback(async () => {
        try {
            await performSignOut()
            showNotification({
                title: 'Token expired',
                message: 'Please login to continue',
                disallowClose: true,
                autoClose: 5000,
                color: 'red',
                icon: <IconAccessPointOff />
            })
            navigate(`/login/next=${pathname}`)
        } catch (err) {
            throw new AuthException(err.response.data.error)
        }

    }, [navigate, performSignOut, pathname])

    const restrictedAccessHandler = useCallback(async () => {
        try {
            await performSignOut()
            showNotification({
                title: 'Restricted access',
                message: 'Please login to continue',
                disallowClose: true,
                autoClose: 5000,
                color: 'red',
                icon: <IconAccessPointOff />
            })
            navigate(`/login/next=${pathname}`)
        } catch (err) {
            throw new AuthException(err.response.data.error)
        }
    }, [navigate, performSignOut, pathname])

    return {
        signIn,
        signOut,
        user,
        resetToken,
        changeDivision,
        restrictedAccessHandler
    }

}





