import React, { useMemo } from "react";
import { Aside, MediaQuery, Group, Text, Box, ScrollArea } from "@mantine/core";
import { asideStyle } from "../../styles/asideStyle";
import { IconListSearch } from "@tabler/icons";

export default function BaseAside({ links, activeSection }) {

    const { classes, cx } = asideStyle()

    const items = useMemo(() => {
        let i = -1
        return links.map((item) => {
            i = i + 1
            return (
                <Box
                    component={'a'}
                    href={item.link}

                    key={item.label}
                    className={cx(classes.link, { [classes.linkActive]: activeSection === i })}
                    sx={(theme) => ({ paddingLeft: item.order * theme.spacing.md })}
                >
                    {item.label}
                </Box>
            )
        }
        );
    }, [links, classes, cx, activeSection])

    return (
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <Aside p="md" hiddenBreakpoint="sm" hidden width={{ sm: 200, lg: 300 }}>
                <ScrollArea.Autosize maxHeight={500} >
                    <Group mb="md">
                        <IconListSearch size={18} stroke={1.5} />
                        <Text>Table of contents</Text>
                    </Group>
                    {items}
                </ScrollArea.Autosize>
            </Aside>
        </MediaQuery>
    )

}
