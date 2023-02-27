import { useCallback, useMemo, useState } from "react"

export const useSearch = () => {

    const [query, setQuery] = useState('')

    const lowerCaseQuery = useMemo(() => {
        return query.toLowerCase()
    }, [query])

    const setValueQuery = useCallback((e) => {
        setQuery(e.target.value)
    }, [])

    return {
        lowerCaseQuery,
        setValueQuery,
        query
    }

}
