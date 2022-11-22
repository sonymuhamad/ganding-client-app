import axios from "axios";
import { Url, AuthException } from "../services/External";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { LoadingOverlay } from "@mantine/core";


export const useRequest = () => {

    const location = useLocation()
    const auth = useContext(AuthContext)
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const Post = useCallback(async (data, endpoint, content_type = 'application/json') => {
        const url = `${Url}/${auth.user.division}/${endpoint}/`
        setVisible((v) => !v)
        try {
            const res = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`,
                    'Content-Type': content_type,
                }
            })
            return res.data

        } catch (err) {
            if (err.response.status === 401) {
                auth.resetToken(auth.user.token, location.pathname)
                // expired token handle
            }
            throw new AuthException(err.response)
        } finally {
            setVisible((v) => !v)
        }

    }, [auth, location.pathname])

    const Put = useCallback(async (id, data, endpoint, content_type = 'application/json') => {
        const url = `${Url}/${auth.user.division}/${endpoint}/${id}/`
        setVisible((v) => !v)
        try {
            const res = await axios.put(url, data, {
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`,
                    'Content-Type': content_type,
                }
            })
            return res.data

        } catch (err) {
            if (err.response.status === 401) {
                auth.resetToken(auth.user.token, location.pathname)
                // expired token handle
            }
            throw new AuthException(err.response)
        } finally {
            setVisible((v) => !v)
        }
    }, [auth, location.pathname])

    const Get = useCallback(async (endpoint) => {
        const url = `${Url}/${auth.user.division}/${endpoint}/`
        setVisible(v => !v)

        try {
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                }
            })
            return res.data

        } catch (err) {
            if (err.response.status === 401) {
                auth.resetToken(auth.user.token, location.pathname)
                // expired token handle
            }
            if (err.response.status === 404) {
                navigate(-1, { replace: true })
            }
            throw new AuthException(err.response)
        } finally {
            setVisible(v => !v)
        }

    }, [auth, location.pathname, navigate])


    const Delete = useCallback(async (id, endpoint) => {
        const url = `${Url}/${auth.user.division}/${endpoint}/${id}/`
        setVisible((v) => !v)
        try {
            const res = await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                }
            })
            return res.data

        } catch (err) {
            if (err.response.status === 401) {
                auth.resetToken(auth.user.token, location.pathname)
                // expired token handle
            }
            throw new AuthException(err.response)
        } finally {
            setVisible((v) => !v)
        }
    }, [auth, location.pathname])

    const Retrieve = useCallback(async (id, endpoint) => {
        const url = `${Url}/${auth.user.division}/${endpoint}/${id}/`
        setVisible(v => !v)

        try {
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                }
            })
            return res.data
        } catch (err) {
            if (err.response.status === 401) {
                auth.resetToken(auth.user.token, location.pathname)
                // expired token handle
            }
            if (err.response.status === 404) {
                navigate(-1, { replace: true })
            }
            throw new AuthException(err.response)
        } finally {
            setVisible(v => !v)
        }
    }, [auth, location.pathname, navigate])

    const Loading = () => {
        return (
            <LoadingOverlay visible={visible} overlayBlur={2} />
        )
    }

    return {
        Post, Put, Get, Delete, Retrieve, Loading
    }

}


