import React, { useState, useEffect, useMemo } from "react";

import { Group, Card, Text, RingProgress, Title, Button, Progress, Chip } from "@mantine/core";
import { Link } from "react-router-dom"
import { marketingDashboardStyle } from "../../styles"
import { BaseAside, ExpandedDn } from "../layout"
import BreadCrumb from "../BreadCrumb"
import { BaseTableExpanded, BaseTableDefaultExpanded } from "../tables"
import { useRequest, useSection } from "../../hooks"
import { IconDotsCircleHorizontal } from "@tabler/icons";
import FullCalendar from "@fullcalendar/react";
import listPlugin from '@fullcalendar/list'



const ExpandProgress = ({ data }) => {

    const currentProgress = useMemo(() => {
        return Math.round(((data.productdelivered / data.productordered) * 100) * 10) / 10
    }, [data])

    return (
        <>
            <Progress
                value={currentProgress}

                label={currentProgress >= 100 ? 'finished 100%' : `${currentProgress} %`}
                size="xl" radius="xl"
            />
        </>
    )
}



export default function MarketingDashboard() {

    const { classes, theme } = marketingDashboardStyle()
    const { sectionRefs, activeSection } = useSection()
    const { Get, Loading, GetAndExpiredTokenHandler } = useRequest()
    const [dataSo, setDataSo] = useState([])
    const [event, setEvent] = useState([])
    const [dataCard, setDataCard] = useState({
        customer: [],
        pending: 0,
        progress: 0,
        done: 0,
        productordered: 0,
        productdelivered: 0
    })
    const [deliveryNotes, setDeliveryNotes] = useState([])

    const breadcrumb = [
        {
            path: '/home/marketing',
            label: 'Marketing'
        }
    ]



    const links = [
        {
            "label": "Sales order of the month",
            "link": "#so-of-month",
            "order": 1
        },
        {
            "label": "Pending invoice",
            "link": "#invoice",
            "order": 1
        },
        {
            "label": "List schedule delivery",
            "link": "#calendar",
            "order": 1
        }
    ]

    const stats = useMemo(() => {
        return [
            {
                label: 'Completed',
                value: dataCard.done
            },
            {
                label: 'In progress',
                value: dataCard.progress
            },
            {
                label: 'Pending',
                value: dataCard.pending
            }
        ]
    }, [dataCard])


    useEffect(() => {
        const fetch = async () => {
            try {
                const salesOrder = await GetAndExpiredTokenHandler('sales-order-this-month')
                const deliverynotes = await Get('delivery-notes-pending')

                const event = salesOrder.reduce((prev, current) => {
                    let temp = []
                    for (const productOrder of current.productorder_set) {

                        const tes = productOrder.deliveryschedule_set.map((schedule) => {
                            return { title: `Delivery ${productOrder.product.name}  ${schedule.quantity} pcs`, date: schedule.date }
                        })
                        temp.push(tes)
                    }
                    return [...prev, ...temp]
                }, [])

                setEvent(event)

                const dn = deliverynotes.map(dn => {
                    dn['detailDeliveryNoteButton'] = <Button
                        component={Link}
                        to={`/home/marketing/delivery-note/${dn.id}`}
                        leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                        color='teal.8'
                        variant='subtle'
                        radius='md'
                    >
                        Detail
                    </Button>
                    return dn
                })

                setDeliveryNotes(dn)
                setDataSo(salesOrder)

                const dataCard = salesOrder.reduce((prev, current) => {

                    if (!prev.customer.includes(current.customer.id)) {
                        prev.customer.push(current.customer.id)
                    }

                    if (current.done) {
                        prev.done += 1
                    } else {
                        if (current.fixed) {
                            prev.progress += 1
                        } else {
                            prev.pending += 1
                        }
                    }
                    prev.productordered += current.productordered
                    prev.productdelivered += current.productdelivered

                    return prev

                }, {
                    customer: [],
                    pending: 0,
                    progress: 0,
                    done: 0,
                    productordered: 0,
                    productdelivered: 0
                })

                setDataCard(dataCard)


            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [Get])

    const columns = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.customer.name,
            sortable: true,
        },
        {
            name: 'Code',
            selector: row => row.code,
        },
        {
            name: 'Status',
            selector: row => row.done ? <Chip color='green' checked={true} >Done</Chip> : row.fixed ? <Chip checked={true} >On progress</Chip> : <Chip color='red' checked >Pending</Chip>,
        },
    ], [])

    const columnDeliveryNote = useMemo(() => [
        // columns for delivery notes
        {
            name: 'Customer',
            selector: row => row.customer.name
        },
        {
            name: 'Code',
            selector: row => row.code,
        },
        {
            name: 'Created at',
            selector: row => new Date(row.created).toLocaleString(),
            sortable: true
        },
        {
            name: '',
            selector: row => row.detailDeliveryNoteButton,
            style: {
                padding: 0,
            }
        }

    ], [])


    const items = useMemo(() => {
        return stats.map((stat) => (
            <div key={stat.label}>
                <Text className={classes.label}>{stat.value}</Text>
                <Text size="xs" color="dimmed">
                    {stat.label}
                </Text>
            </div>
        ))
    }, [classes, stats])


    return (
        <>
            <BreadCrumb links={breadcrumb} />
            <BaseAside links={links} activeSection={activeSection} />
            <Loading />

            <section id='so-of-month' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#so-of-month" className={classes.a_href} >
                        Sales order this month
                    </a>
                </Title>

                <Card withBorder p="xl" component={Link} to='/home/marketing/sales-order' radius="md" className={classes.card}>
                    <div className={classes.inner}>
                        <div>
                            <Text size="xl" className={classes.label}>
                                Current status
                            </Text>
                            <Group>

                                <div>
                                    <Text className={classes.lead} mt={30}>
                                        {dataCard.customer.length}
                                    </Text>
                                    <Text size="xs" color="dimmed">
                                        Customer
                                    </Text>
                                </div>
                                <div>

                                    <Text className={classes.lead} mt={30}>
                                        {dataCard.pending + dataCard.done + dataCard.progress}
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
                                sections={[{ value: (dataCard.productdelivered / dataCard.productordered) * 100, color: theme.primaryColor }]}
                                label={
                                    <div>
                                        <Text align="center" size="lg" className={classes.label} sx={{ fontSize: 22 }}>
                                            {((dataCard.productdelivered / dataCard.productordered) * 100).toFixed(0)}%
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

                <BaseTableExpanded
                    column={columns}
                    data={dataSo}
                    expandComponent={ExpandProgress}
                />

            </section>

            <section id='invoice' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#invoice" className={classes.a_href} >
                        Pending invoice
                    </a>
                </Title>

                <BaseTableDefaultExpanded
                    column={columnDeliveryNote}
                    data={deliveryNotes}
                    expandComponent={ExpandedDn}
                />

            </section>

            <section id='calendar' className={classes.section} ref={sectionRefs[2]} >
                <Title className={classes.title} >
                    <a href="#calendar" className={classes.a_href} >
                        List schedule delivery
                    </a>
                </Title>

                <FullCalendar
                    plugins={[listPlugin]}
                    initialView='listMonth'

                    eventSources={[
                        {
                            events: event,
                        },
                    ]}
                    views={{
                        listDay: { buttonText: 'list day' },
                        listWeek: { buttonText: 'list week' },
                        listMonth: { buttonText: 'list month' }
                    }
                    }
                    headerToolbar={{
                        left: 'title',
                        center: 'listDay,listWeek,listMonth'
                    }}


                />
            </section>
        </>
    )

}


