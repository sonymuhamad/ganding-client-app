import { useLocation } from "react-router-dom";
import React from "react";


export function usePath() {

    const path = useLocation()
    const regex = new RegExp('\/\[A-Za-z0-9_-]+', 'g')
    const getPath = () => {

        let paths = path.pathname.match(regex)

        paths = paths.reduce((prev, current) => {
            return [...prev, `${prev.slice(-1)}${current}`]
        }, [])


        return paths.slice(1)
    }

    const getCurrentPath = () => {
        const current = getPath()
        if (current.length === 1) {
            return current[0]
        } else if (current.length > 1) {
            return current[1]
        }
    }

    return { path, getPath, getCurrentPath }

}


