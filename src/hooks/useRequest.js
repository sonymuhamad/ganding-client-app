import axios from "axios";
import { Url, AuthException } from "../services/External";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { LoadingOverlay } from "@mantine/core";

export const useRequest = () => {

    const location = useLocation()
    const auth = useContext(AuthContext)
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const Post = async (data, token, endpoint) => {
        const url = `${Url}/${endpoint}/`
        setVisible((v) => !v)
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
        } finally {
            setVisible((v) => !v)
        }

    }

    const Put = async (id, data, token, endpoint) => {
        const url = `${Url}/${endpoint}/${id}/`
        setVisible((v) => !v)
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
        } finally {
            setVisible((v) => !v)
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
            if (err.response.status === 404) {
                navigate(-1, { replace: true })
            }
            throw new AuthException(err.response)
        } finally {

        }

    }

    const Delete = async (id, token, endpoint) => {
        const url = `${Url}/${endpoint}/${id}/`
        setVisible((v) => !v)
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
        } finally {
            setVisible((v) => !v)
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
            if (err.response.status === 404) {
                navigate(-1, { replace: true })
            }
            throw new AuthException(err.response)
        } finally {

        }
    }

    const Loading = () => {
        return (
            <LoadingOverlay visible={visible} overlayBlur={2} />
        )
    }

    return {
        Post, Put, Get, Delete, Retrieve, Loading
    }

}


