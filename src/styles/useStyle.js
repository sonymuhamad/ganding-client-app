import { createStyles } from "@mantine/core";

export const useStyle = createStyles((theme, _params, getRef) => ({
    wrapper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        maxWidth: document.documentElement.clientWidth,
        width: '100%',
        height: document.documentElement.clientHeight,
        display: 'flex',

        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: theme.radius.sm,
        [`@media (max-width :${theme.breakpoints.sm}px)`]: {
            [`&.${getRef('child')}`]: {
                fontSize: theme.fontSizes.sm
            },
        },
    },

    child: {
        ref: getRef('child'),
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        boxShadow: theme.shadows.md,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },

    myCustomButton: {
        ...theme.fn.focusStyles(),
        ...theme.fn.primaryShade('dark')
    },

}))


