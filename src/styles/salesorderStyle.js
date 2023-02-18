import { createStyles } from "@mantine/core";



export const salesorderStyle = createStyles((theme) => ({
    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF,sans-serif`,
        lineHeight: 1.2,
        fontWeight: 900,
        marginBottom: theme.spacing.lg,
        fontSize: 25,
        [theme.fn.smallerThan('xs')]: {
            fontSize: 28,
        },
    },
    a_href: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF,sans-serif`,
        textDecoration: 'none'
    },
    section: {
        paddingTop: 75,
        marginTop: -75,
        marginBottom: 100
    }
}))
