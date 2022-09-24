import React from "react";
import { Aside, MediaQuery, Group, Text, Box } from "@mantine/core";
import { asideStyle } from "../../styles/asideStyle";
import { IconListSearch } from "@tabler/icons";

export default function BaseAside({ links, activeSection }) {

    const { classes, cx } = asideStyle()

    let i = -1
    const items = links.map((item) => {
        { i = i + 1 }
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
