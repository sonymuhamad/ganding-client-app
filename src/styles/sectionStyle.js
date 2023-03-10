import { createStyles } from "@mantine/core";


export const sectionStyle = createStyles((theme) => ({
    link: {
        ...theme.fn.focusStyles(),
        display: 'block',
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        lineHeight: 1.2,
        fontSize: theme.fontSizes.sm,
        padding: theme.spacing.xs,
        borderTopRightRadius: theme.radius.sm,
        borderBottomRightRadius: theme.radius.sm,
        borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkActive: {
        fontWeight: 500,
        borderLeftColor: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 6 : 7],
        color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 2 : 7],

        '&, &:hover': {
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
                    : theme.colors[theme.primaryColor][0],
        },
    },
    buttonBlueActive: {
        backgroundColor: theme.white,
        color: theme.colors.blue[7],
        '&:hover': {
            backgroundColor: theme.white,
            color: theme.colors.blue[7]
        }
    },
    buttonOrangeActive: {
        backgroundColor: theme.white,
        color: theme.colors.orange[7],
        '&:hover': {
            backgroundColor: theme.white,
            color: theme.colors.orange[7]
        }
    },
    buttonGreenActive: {
        backgroundColor: theme.white,
        color: theme.colors.green[7],
        '&:hover': {
            backgroundColor: theme.white,
            color: theme.colors.green[7]
        }
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
    }
}));