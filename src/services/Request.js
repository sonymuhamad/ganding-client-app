import axios from "axios";
import { Url, AuthException } from "./External";


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
        throw new AuthException(err.response)
    }
}

export { Post, Put, Get, Delete, Retrieve }


