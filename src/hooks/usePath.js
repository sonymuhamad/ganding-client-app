import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

export function usePath() {

    const path = useLocation()
    const regex = useMemo(() => {
        return new RegExp('/[A-Za-z0-9_-]+', 'g')
    }, [])

    const getPath = useCallback(() => {

        let paths = path.pathname.match(regex)

        paths = paths.reduce((prev, current) => {
            return [...prev, `${prev.slice(-1)}${current}`]
        }, [])


        return paths.slice(1)
    }, [path, regex])

    const getCurrentPath = useCallback(() => {
        const current = getPath()
        if (current.length === 1) {
            return current[0]
        } else if (current.length > 1) {
            return current[1]
        }
    }, [getPath])

    return { path, getPath, getCurrentPath }

}


