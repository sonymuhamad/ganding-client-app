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