import { IconBuildingFactory2, IconChartInfographic, IconReportAnalytics, IconBuildingStore } from "@tabler/icons"

export const Url = `http://127.0.0.1:8000/api`

export function AuthException(message) {
    this.message = message
}

export const customTableStyle = {
    cells: {
        style: {
            fontWeight: 400,
            color: 'black',
            margin: 3
        }
    },
    headCells: {
        style: {
            fontWeight: 900,
            color: 'gray',
            fontSize: 15,
        }
    }
}

export const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
export const FullNameMonths = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "October", "November", "Desember"]


export const DivisionIcons = {
    1: <IconReportAnalytics />,
    2: <IconBuildingStore />,
    3: <IconBuildingFactory2 />,
    4: <IconChartInfographic />
}

export function generateDate(date) {
    // generate date before being sent to django server

    let year = date.getFullYear()
    let month = `${date.getMonth() + 1}`
    let day = `${date.getDate()}`

    if (month.length < 2) {
        month = '0' + month
    }
    if (day.length < 2) {
        day = '0' + day
    }

    return [year, month, day].join('-')  // e.g. '2022-02-19'
}

export function generateDataWithDate(date, data) {
    if (date) {
        return { ...data, date: generateDate(date) }
    }
    return data
}

function getLabelState(schedule, actualDate) {
    if (schedule) {
        const { date } = schedule
        if (actualDate > date) {
            return 'Late'
        }
        return 'On time'
    }
    return 'Unscheduled'
}

function getColorState(schedule, actualDate) {

    if (schedule) {
        const { date } = schedule
        if (actualDate > date) {
            return 'red.6'
        }
        return 'blue.6'
    }
    return 'blue.6'
}

export function getScheduleState(schedule, actualDate) {
    // return state of deliveries or receipts, is it late, on time or unscheduled
    const color = getColorState(schedule, actualDate)
    const label = getLabelState(schedule, actualDate)

    return { color, label }
}


export const generateDataWithDescription = (data) => {
    if (data.description === '') {
        const { description, ...rest } = data
        return rest
    }
    return data
}


export const generateDataWithNote = (data) => {
    if (data.note === '') {
        const { note, ...rest } = data
        return rest
    }
    return data

}

export const generateDataWithImage = (data) => {

    if (typeof data.image === "string") {
        const { image, ...restData } = data
        return restData
    }

    return data
}
