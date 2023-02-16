import { createStyles } from "@mantine/core";



export const customStyle = createStyles((theme) => ({
    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF,sans-serif`,
        lineHeight: 1.2,
        fontWeight: 900,
        marginBottom: theme.spacing.lg,
        fontSize: 27,
    },
    titleChild: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF,sans-serif`,
        lineHeight: 1.2,
        fontWeight: 900,
        marginBottom: theme.spacing.lg,
        fontSize: 23,
    },
}))