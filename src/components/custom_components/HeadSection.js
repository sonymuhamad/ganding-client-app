import React from "react";
import { Group } from "@mantine/core";


const HeadSection = (props) => {

    const { children } = props

    return (
        <Group
            position="right"
        >

            {children}

        </Group>
    )

}

export default HeadSection

