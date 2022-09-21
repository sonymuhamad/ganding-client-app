import { createStyles } from "@mantine/core";



export const navbarStyle = createStyles((theme) => ({
    link: {
        '&:hover': {
            backgroundColor: theme.colors.blue[0],
            color: theme.colors.blue[9]
        }
    },
    linkActive: {
        backgroundColor: theme.colors.blue[2],
        color: theme.colors.blue[9],
        '&:hover': {
            backgroundColor: theme.colors.blue[2],
            color: theme.colors.blue[9]
        }
    },
    responsiveText: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none'
        },
    }
}))
