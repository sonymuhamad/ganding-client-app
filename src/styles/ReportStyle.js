import { createStyles } from "@mantine/core";



export const ReportStyle = createStyles((theme) => ({

    image: {
        maxWidth: '9%',
        width: 90,
        [theme.fn.smallerThan('sm')]: {
            display: 'none'
        },
        marginTop: 20,
        marginRight: 100,
    }
}))