import React, { useState } from "react";

import { Container, createStyles, Group, Stack, Card, Anchor, Text, RingProgress, ScrollArea, Button, Select, Center } from "@mantine/core";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef } from "react";

import { getYearsRange } from "@mantine/dates";

import { IconCalendarStats } from "@tabler/icons";

const cardStyle = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        marginLeft: theme.spacing.lg,
        marginRight: theme.spacing.lg
    },

    label: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
        lineHeight: 1,
    },

    lead: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 700,
        fontSize: 22,
        lineHeight: 1,
    },

    inner: {
        display: 'flex',

        [theme.fn.smallerThan(350)]: {
            flexDirection: 'column',
        },
    },

    ring: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',

        [theme.fn.smallerThan(350)]: {
            justifyContent: 'center',
            marginTop: theme.spacing.md,
        },
    },

}))


export default function MarketingDashboard() {

    const location = useLocation()
    const { classes, theme } = cardStyle()

    const viewport = useRef()

    const [selected, setSelected] = useState('2022')

    const now = new Date().getFullYear()
    let years = getYearsRange({ from: 2020, to: now + 1 })
    years = years.map((year) => (String(year)))

    const title = 'Sales order this month'
    const completed = 900
    const total = 1300
    const stats = [
        {
            label: 'Completed',
            value: 100
        },
        {
            label: 'In Progress',
            value: 200
        }
    ]




    const items = stats.map((stat) => (
        <div key={stat.label}>
            <Text className={classes.label}>{stat.value}</Text>
            <Text size="xs" color="dimmed">
                {stat.label}
            </Text>
        </div>
    ));

    const scroll = () => (
        viewport.current.scrollTo({ left: 6000, behavior: 'smooth' })
    )


    useEffect(() => {
        scroll()

    }, [])


    return (
        <>
            <Center height={50} mb='lg' >

                <Select
                    transition="pop-top-left"
                    transitionDuration={80}
                    transitionTimingFunction="ease"
                    nothingFound='Not found'
                    data={years}
                    radius='lg'
                    searchable
                    onChange={(event) => {
                        setSelected(event)
                    }}
                    defaultValue={now.toString()}
                    icon={<IconCalendarStats size={16} stroke={2} />}
                    initiallyOpened={false}
                />
            </Center>


            <ScrollArea style={{ width: 900, height: 275 }} viewportRef={viewport}  >

                <div style={{ display: 'flex', width: '100%' }} >

                    <div style={{ width: 540, display: 'inline-block' }} mt='lg' >

                        <Card withBorder p="xl" component={Link} to='/home/marketing/customers' radius="md" className={classes.card}>
                            <div className={classes.inner}>
                                <div>
                                    <Text size="xl" className={classes.label}>
                                        {title}
                                    </Text>
                                    <Group>

                                        <div>
                                            <Text className={classes.lead} mt={30}>
                                                {completed}
                                            </Text>
                                            <Text size="xs" color="dimmed">
                                                Customer
                                            </Text>
                                        </div>
                                        <div>

                                            <Text className={classes.label} mt={30}>
                                                {completed}
                                            </Text>
                                            <Text size="xs" color="dimmed">
                                                Total Sales Order
                                            </Text>
                                        </div>
                                    </Group>
                                    <Group mt="lg">{items}</Group>
                                </div>

                                <div className={classes.ring}>
                                    <RingProgress
                                        roundCaps
                                        thickness={15}
                                        size={175}
                                        sections={[{ value: (completed / total) * 100, color: theme.primaryColor }]}
                                        label={
                                            <div>
                                                <Text align="center" size="lg" className={classes.label} sx={{ fontSize: 22 }}>
                                                    {((completed / total) * 100).toFixed(0)}%
                                                </Text>
                                                <Text align="center" size="xs" color="dimmed">
                                                    Completed
                                                </Text>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>

            </ScrollArea>

        </>
    )

}


