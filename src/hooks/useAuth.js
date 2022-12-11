import { useCallback, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconHandRock, IconAccessPointOff } from "@tabler/icons";
import { AuthException, Url } from "../services";
import { useParams } from "react-router-dom";
import { closeAllModals } from "@mantine/modals"

const sign_in_url = `${Url}/plant-manager/sign-in/`
const sign_out_url = `${Url}/plant-manager/sign-out/`


export const useAuth = () => {
    // handle user login logout and authentication

    const initialCompute = useCallback(() => {
        // initial computation to get user is authenticate or null

        const auth = window.localStorage.getItem('loggedUser')
        return JSON.parse(auth)
    }, [])

    const params = useParams()
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
    }, [saveToLocalStorage])

    const signIn = useCallback(async (data) => {
        let redirect
        try {
            const response = await axios.post(sign_in_url, data)
            const data_user = {
                username: response.data.username,
                division: response.data.groups[0].name,
                token: response.data.oauth2_provider_accesstoken[0].token,
                groups: response.data.groups
            }
            setUser(data_user)
            saveToLocalStorage(data_user)

            showNotification({
                title: 'Sign In success',
                message: 'Have a great day',
                disallowClose: true,
                autoClose: 3000,
                icon: <IconCheck />
            })

            if (Object.keys(params).length !== 0) {
                // redirect for user expired token

                redirect = params["*"].split('=')[1]
            } else {
                // redirect for user first time login

                redirect = `/home/${data_user.division}`
            }

            navigate(redirect, { replace: true })
        } catch (err) {
            throw new AuthException(err.response.data.error)
        }
    }, [params, navigate, saveToLocalStorage])

    const signOut = useCallback(async (token) => {
        try {
            await axios.post(sign_out_url, { access_token: token })
            setUser(null)
            deleteFromLocalStorage()
            showNotification({
                title: 'Sign out success',
                disallowClose: true,
                autoClose: 3000,
                icon: <IconHandRock />
            })
            closeAllModals()
            navigate(`/`)
        } catch (err) {
            throw new AuthException(err.response.data.error)
        }
    }, [navigate, deleteFromLocalStorage])

    const resetToken = useCallback(async (token, redirect) => {
        try {
            await axios.post(sign_out_url, { access_token: token })
            setUser(null)
            deleteFromLocalStorage()
            showNotification({
                title: 'Token expired',
                message: 'Please login to continue',
                disallowClose: true,
                autoClose: 5000,
                color: 'red',
                icon: <IconAccessPointOff />
            })
            closeAllModals()
            navigate(`/login/next=${redirect}`)
        } catch (err) {
            throw new AuthException(err.response.data.error)
        }

    }, [navigate, deleteFromLocalStorage])

    return {
        signIn,
        signOut,
        user,
        resetToken,
        changeDivision
    }

}





