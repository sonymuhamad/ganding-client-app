import axios from "axios";
import { Url, AuthException } from "../services/External";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export const useRequest = () => {

    const location = useLocation()
    const auth = useContext(AuthContext)

    const Post = async (data, token, endpoint) => {
        const url = `${Url}/${endpoint}/`

        try {
            const res = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data

        } catch (err) {
            if (err.response.status === 401) {
                auth.resetToken(token, location.pathname)
                // expired token handle
            }
            throw new AuthException(err.response)
        }

    }

    const Put = async (id, data, token, endpoint) => {
        const url = `${Url}/${endpoint}/${id}/`

        try {
            const res = await axios.put(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data

        } catch (err) {
            if (err.response.status === 401) {
                auth.resetToken(token, location.pathname)
                // expired token handle
            }
            throw new AuthException(err.response)
        }
    }

    const Get = async (token, endpoint) => {
        const url = `${Url}/${endpoint}/`

        try {
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data

        } catch (err) {
            if (err.response.status === 401) {
                auth.resetToken(token, location.pathname)
                // expired token handle
            }
            throw new AuthException(err.response)
        }

    }

    const Delete = async (id, token, endpoint) => {
        const url = `${Url}/${endpoint}/${id}/`

        try {
            const res = await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data

        } catch (err) {
            if (err.response.status === 401) {
                auth.resetToken(token, location.pathname)
                // expired token handle
            }
            throw new AuthException(err.response)
        }
    }

    const Retrieve = async (id, token, endpoint) => {
        const url = `${Url}/${endpoint}/${id}/`

        try {
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        } catch (err) {
            if (err.response.status === 401) {
                auth.resetToken(token, location.pathname)
                // expired token handle
            }
            throw new AuthException(err.response)
        }
    }

    return {
        Post, Put, Get, Delete, Retrieve
    }

}


