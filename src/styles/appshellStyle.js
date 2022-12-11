import { createStyles } from "@mantine/core";



export const appshellStyle = createStyles((theme) => ({

    responsiveText: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none'
        },
    },
    responsiveTitleMenu: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none'
        },
    },
    responsiveTime: {
        [theme.fn.smallerThan('lg')]: {
            display: 'none'
        },
    },
    headerGroup: {
        justifyContent: 'space-between',
        display: 'flex',
        paddingTop: 0,
    },
    innerHeaderRight: {
        display: 'flex',
        marginLeft: 'auto',
        marginRight: '55px',
        [theme.fn.smallerThan('md')]: {
            marginRight: '10px'
        },
    },
    innerHeaderLeft: {
        height: '100%',
        display: 'flex',
        marginRight: 'auto',
    },
    image: {
        maxWidth: '10%',
        width: 90,
        [theme.fn.smallerThan('sm')]: {
            display: 'none'
        },
    },
    header: {
        backgroundColor: theme.colors.lights,
    },
    bodyNav: {
        paddingTop: theme.spacing.xs,
        paddingBottom: theme.spacing.md,
        marginLeft: -theme.spacing.xs,
        marginRight: -theme.spacing.xs / 5,
        borderBottom: `1px solid #ced4da`,
    },
    footerNav: {
        paddingTop: theme.spacing.xs,
        paddingBottom: theme.spacing.md,
        marginLeft: -theme.spacing.xs,
        marginRight: -theme.spacing.xs / 5,
    },
    navbar: {

        paddingTop: theme.spacing.xs,
        paddingBottom: theme.spacing.sm,
        paddingLeft: theme.spacing.sm,
        margin: 'md',
        backgroundColor: theme.colors.light,

    }


}))


