import { SuccessNotif, FailedNotif } from "../components/notifications"
import { useCallback } from "react"
export const useNotification = () => {

    const successNotif = useCallback((successMessage) => SuccessNotif(successMessage), [])

    const failedNotif = useCallback((error, defaultFailedMessage) => {
        const { message } = error
        const { data } = message
        const { non_field_errors } = data
        console.log(data)
        if (data.constructor === Array) {
            return FailedNotif(data)
        }
        if (non_field_errors) {
            return FailedNotif(non_field_errors)
        }
        return FailedNotif(defaultFailedMessage)
    }, [])

    return { successNotif, failedNotif }

}