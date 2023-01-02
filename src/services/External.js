import { IconBuildingFactory2, IconChartInfographic, IconReportAnalytics, IconBuildingStore } from "@tabler/icons"

export const Url = `http://127.0.0.1:8000`

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



