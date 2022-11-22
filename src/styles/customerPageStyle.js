import { createStyles } from "@mantine/core";


export const customerPageStyle = createStyles(() => ({

    wrapper: {
        display: 'flex',
        width: '100%',
    },
    leftDiv: {
        width: 1000,
        display: 'inline-block',
        marginRight: 50,
        paddingLeft: 0,

    },
    rightDiv: {
        width: 900,
        display: 'inline-block',
        backgroundColor: 'black',
        height: 800
    }

}))