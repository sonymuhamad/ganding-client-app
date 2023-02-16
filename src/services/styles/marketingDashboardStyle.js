import { createStyles } from "@mantine/core";



export const marketingDashboardStyle = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        marginLeft: theme.spacing.lg,
        marginRight: theme.spacing.lg
    },

    label: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
        lineHeight: 1,
    },

    lead: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
        fontSize: 22,
        lineHeight: 1,
    },

    inner: {
        display: 'flex',

        [theme.fn.smallerThan(350)]: {
            flexDirection: 'column',
        },
    },

    ring: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',

        [theme.fn.smallerThan(350)]: {
            justifyContent: 'center',
            marginTop: theme.spacing.md,
        },
    },
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
    },

}))