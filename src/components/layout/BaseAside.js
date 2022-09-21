import React from "react";
import { Aside, MediaQuery, Group, Text } from "@mantine/core";



export default function BaseAside(props) {

    const items = []

    return (
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <Aside p="md" hiddenBreakpoint="sm" hidden width={{ sm: 200, lg: 300 }}>
                <div>
                    <Group mb="md">
                        <IconListSearch size={18} stroke={1.5} />
                        <Text>Table of contents</Text>
                    </Group>
                    {items}
                </div>
            </Aside>
        </MediaQuery>
    )

}
