import axios from "axios";
import { Url, AuthException } from "../services";
import { useNavigate } from "react-router-dom";
import { useContext, useCallback, useMemo } from "react";
import { AuthContext, LoaderContext } from "../context";


export const useRequest = () => {

    const auth = useContext(AuthContext)
    const navigate = useNavigate()
    const { changeVisibility } = useContext(LoaderContext)

    const token = useMemo(() => {
        const { user } = auth
        if (user) {
            const { token } = user
            return token
        }
        return null
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
            auth.restrictedAccessHandler()
        }

    }, [auth])

    const ExpiredHandler = useCallback((err) => {
        // handler for expired token

        if (err.response.status === 401) {
            auth.resetToken()
            // expired token handle
        }

    }, [auth])

    const ErrorHandler = useCallback((err) => {

        NotFoundHandler(err)
        ExpiredHandler(err)
        RestrictedAccessHandler(err)

    }, [NotFoundHandler, ExpiredHandler, RestrictedAccessHandler])

    const Post = useCallback(async (data, endpoint, content_type = 'application/json') => {
        const url = `${Url}/${endpoint}/`
        changeVisibility()
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
            changeVisibility()
        }

    }, [token, ErrorHandler, RaiseError, changeVisibility])

    const Put = useCallback(async (id, data, endpoint, content_type = 'application/json') => {

        const url = `${Url}/${endpoint}/${id}/`
        changeVisibility()
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
            changeVisibility()
        }
    }, [changeVisibility, token, ErrorHandler, RaiseError])

    const Patch = useCallback(async (id, data, endpoint, content_type = 'application/json') => {

        const url = `${Url}/${endpoint}/${id}/`
        changeVisibility()
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
            changeVisibility()
        }

    }, [changeVisibility, token, ErrorHandler, RaiseError])

    const Get = useCallback(async (endpoint) => {
        // this action doesn't show error expired token when it comes

        const url = `${Url}/${endpoint}/`
        changeVisibility()

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
            changeVisibility()
        }

    }, [changeVisibility, token, NotFoundHandler, RaiseError])

    const GetAndExpiredTokenHandler = useCallback(async (endpoint) => {

        const url = `${Url}/${endpoint}/`
        changeVisibility()

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
            changeVisibility()
        }

    }, [token, ErrorHandler, RaiseError, changeVisibility])

    const Delete = useCallback(async (id, endpoint) => {
        // this action show error expired token

        const url = `${Url}/${endpoint}/${id}/`
        changeVisibility()
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
            changeVisibility()
        }
    }, [changeVisibility, token, ErrorHandler, RaiseError])

    const Retrieve = useCallback(async (id, endpoint) => {
        // this action show error expired token

        const url = `${Url}/${endpoint}/${id}/`
        changeVisibility()

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
            changeVisibility()
        }
    }, [token, ErrorHandler, RaiseError, changeVisibility])

    const RetrieveWithoutExpiredTokenHandler = useCallback(async (id, endpoint) => {
        // This action doesn't show token expired error when it comes

        const url = `${Url}/${endpoint}/${id}/`
        changeVisibility()

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
            changeVisibility()
        }
    }, [token, NotFoundHandler, RaiseError, changeVisibility])


    return {
        Post,
        Put,
        Get,
        Delete,
        Retrieve,
        GetAndExpiredTokenHandler,
        RetrieveWithoutExpiredTokenHandler,
        Patch
    }

}


