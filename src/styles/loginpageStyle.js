import { createStyles } from "@mantine/core";


const BREAKPOINT = '@media (max-width: 755px)'

export const loginpageStyle = createStyles((theme) => ({

    wrapper: {
        display: 'flex',
        position: 'relative',
        backgroundSize: 'cover',
        height: '100%',
        backgroundColor: theme.ligth,
        backgroundPosition: 'center',
    },
    inner: {
        position: 'relative',
        paddingTop: '7%',
        paddingBottom: '10%',
        display: 'flex',
        justifyContent: 'center',
        [BREAKPOINT]: {
            paddingBottom: '15%',
            paddingTop: '15%'
        }
    },

    contentRight: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: 900,
        width: 300,
        marginRight: 0,
        marginLeft: 0,

        [theme.fn.smallerThan('md')]: {
            display: 'none'
        },
    },
    image: {
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        paddingLeft: 0

    },
    textRight: {
        lineHeight: 1.2,
        marginTop: theme.spacing.xl,
        fontFamily: 'Noto Sans,sans-serif',
        paddingLeft: 0,
        textAlign: 'center',
    },
    title: {
        fontFamily: `Noto Sans, ${theme.fontFamily}`,
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
        fontSize: 45,
        fontWeight: 750,
        lineHeight: 1.1,
        [BREAKPOINT]: {
            fontSize: 35,
            lineHeight: 1.2,
        },
    }


}))
