import axios from "axios";
import { Url, AuthException } from "../services";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useCallback, useMemo } from "react";
import { AuthContext } from "../context";
import { LoadingOverlay } from "@mantine/core";


export const useRequest = () => {

    const location = useLocation()
    const auth = useContext(AuthContext)
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const [token, division] = useMemo(() => {
        const { user } = auth
        if (user) {
            const { token, division } = user
            return [token, division]
        }
        return [null, null]
    }, [auth])

    const RaiseError = useCallback(err => {
        throw new AuthException(err.response)
    }, [])

    const NotFoundHandler = useCallback((err) => {
        // handler for 404

        if (err.response.status === 404) {
            navigate(-1, { replace: true })
        }

    }, [navigate])

    const RestrictedAccessHandler = useCallback(err => {

        if (err.response.status === 403) {
            auth.restrictedAccessHandler(location.pathname)
        }

    }, [location.pathname, auth])

    const ExpiredHandler = useCallback((err) => {
        // handler for expired token

        if (err.response.status === 401) {
            auth.resetToken(location.pathname)
            // expired token handle
        }

    }, [location.pathname, auth])

    const ErrorHandler = useCallback((err) => {

        NotFoundHandler(err)
        ExpiredHandler(err)
        RestrictedAccessHandler(err)

    }, [NotFoundHandler, ExpiredHandler, RestrictedAccessHandler])

    const Post = useCallback(async (data, endpoint, content_type = 'application/json') => {
        const url = `${Url}/${division}/${endpoint}/`
        setVisible((v) => !v)
        try {
            const res = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': content_type,
                }
            })
            return res.data

        } catch (err) {
            ErrorHandler(err)
            RaiseError(err)
        } finally {
            setVisible((v) => !v)
        }

    }, [division, token, ErrorHandler, RaiseError])

    const Put = useCallback(async (id, data, endpoint, content_type = 'application/json') => {

        const url = `${Url}/${division}/${endpoint}/${id}/`
        setVisible((v) => !v)
        try {
            const res = await axios.put(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': content_type,
                }
            })
            return res.data

        } catch (err) {
            ErrorHandler(err)
            RaiseError(err)
        } finally {
            setVisible((v) => !v)
        }
    }, [division, token, ErrorHandler, RaiseError])

    const Patch = useCallback(async (id, data, endpoint, content_type = 'application/json') => {

        const url = `${Url}/${division}/${endpoint}/${id}/`
        setVisible((v) => !v)
        try {
            const res = await axios.patch(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': content_type,
                }
            })
            return res.data

        } catch (err) {
            ErrorHandler(err)
            RaiseError(err)
        } finally {
            setVisible((v) => !v)
        }

    }, [division, token, ErrorHandler, RaiseError])

    const Get = useCallback(async (endpoint) => {
        // this action doesn't show error expired token when it comes

        const url = `${Url}/${division}/${endpoint}/`
        setVisible(v => !v)

        try {
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data

        } catch (err) {
            NotFoundHandler(err)
            RaiseError(err)
        } finally {
            setVisible(v => !v)
        }

    }, [division, token, NotFoundHandler, RaiseError])

    const GetAndExpiredTokenHandler = useCallback(async (endpoint) => {

        const url = `${Url}/${division}/${endpoint}/`
        setVisible(v => !v)

        try {
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data

        } catch (err) {
            ErrorHandler(err)
            RaiseError(err)
        } finally {
            setVisible(v => !v)
        }

    }, [division, token, ErrorHandler, RaiseError])




    const Delete = useCallback(async (id, endpoint) => {
        // this action show error expired token

        const url = `${Url}/${division}/${endpoint}/${id}/`
        setVisible((v) => !v)
        try {
            const res = await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data

        } catch (err) {
            ErrorHandler(err)
            RaiseError(err)
        } finally {
            setVisible((v) => !v)
        }
    }, [division, token, ErrorHandler, RaiseError])

    const Retrieve = useCallback(async (id, endpoint) => {
        // this action show error expired token

        const url = `${Url}/${division}/${endpoint}/${id}/`
        setVisible(v => !v)

        try {
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        } catch (err) {
            ErrorHandler(err)
            RaiseError(err)
        } finally {
            setVisible(v => !v)
        }
    }, [division, token, ErrorHandler, RaiseError])

    const RetrieveWithoutExpiredTokenHandler = useCallback(async (id, endpoint) => {
        // This action doesn't show token expired error when it comes

        const url = `${Url}/${division}/${endpoint}/${id}/`
        setVisible(v => !v)

        try {
            const res = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        } catch (err) {
            NotFoundHandler(err)
            RaiseError(err)
        } finally {
            setVisible(v => !v)
        }
    }, [division, token, NotFoundHandler, RaiseError])

    const Loading = () => {
        return (
            <LoadingOverlay visible={visible} overlayBlur={2} />
        )
    }

    return {
        Post, Put, Get, Delete, Retrieve, Loading, GetAndExpiredTokenHandler, RetrieveWithoutExpiredTokenHandler, Patch
    }

}


