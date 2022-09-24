import React, { useEffect, useState, useContext, useMemo } from "react";

import { SegmentedControl, Button, Collapse, Group, Text } from "@mantine/core";
import { IconDotsCircleHorizontal, IconPlus } from "@tabler/icons";

import { Link } from "react-router-dom";

import BaseTableExpanded from "../layout/BaseTableExpanded";
import BreadCrumb from "../BreadCrumb";
import { AuthContext } from "../../context/AuthContext";
import { useRequest } from "../../hooks/useRequest";
import ExpandedSo from "../layout/ExpandedSo";
import { useSection } from "../../hooks/useSection";
import BaseAside from "../layout/BaseAside";
import { salesorderStyle } from "../../styles/salesorderStyle";



export default function SalesOrder() {

    const auth = useContext(AuthContext)
    const [activeSegment, setActiveSegment] = useState('on_progress')
    const [salesOrderProgress, setSalesOrderProgress] = useState([])
    const [salesOrderPending, setSalesOrderPending] = useState([])
    const [salesOrderDone, setSalesOrderDone] = useState([])
    const { Get } = useRequest()

    const breadcrumb = [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/sales-order',
            label: 'Sales Order'
        }
    ]

    const columnSo = useMemo(() => [
        // columns for sales order tables
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
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Amount of product',
            selector: row => row.amountOfProduct,

        },
        {
            name: '',
            selector: row => row.detailSalesOrderButton,
            style: {
                padding: 0,
            }
        }

    ], [])

    useEffect(() => {
        const fetch = async (get, token) => {
            try {
                const salesorders = await get(token, 'sales-order-list')
                let on_progress = []
                let pending = []
                let done = []

                for (const so of salesorders) {
                    so['detailSalesOrderButton'] = <Button

                        leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                        color='teal.8'
                        variant='subtle'
                        radius='md'
                        component={Link}
                        to={`/home/marketing/sales-order/${so.id}`}
                    >
                        Detail
                    </Button>
                    so['amountOfProduct'] = so.productorder_set.length
                    if (so.done === true) {
                        done = [...done, so]
                    } else {
                        if (so.fixed === true) {
                            on_progress = [...on_progress, so]
                        } else {
                            pending = [...pending, so]
                        }
                    }
                }


                setSalesOrderDone(done)
                setSalesOrderPending(pending)
                setSalesOrderProgress(on_progress)
            } catch (e) {
                console.log(e)
            }
        }

        fetch(Get, auth.user.token)
    }, [])


    return (
        <>
            <BreadCrumb links={breadcrumb} />

            <Group position="apart" >

                <SegmentedControl
                    value={activeSegment}
                    onChange={setActiveSegment}
                    data={[
                        { label: 'On Progress', value: 'on_progress' },
                        { label: 'Pending', value: 'pending' },
                        { label: 'Done', value: 'done' },
                    ]}
                    size='md'
                    color='blue'
                    radius='md'

                />

                <Button
                    radius='md'
                    leftIcon={<IconPlus />}
                    component={Link}
                    variant='outline'
                    to='/home/marketing/sales-order/new'
                >
                    New Sales Order
                </Button>
            </Group>





            <Collapse
                in={activeSegment === 'on_progress'}
            >
                <BaseTableExpanded
                    column={columnSo}
                    data={salesOrderProgress}
                    expandComponent={ExpandedSo}
                />

            </Collapse>
            <Collapse
                in={activeSegment === 'pending'}
            >
                <BaseTableExpanded
                    column={columnSo}
                    data={salesOrderPending}
                    expandComponent={ExpandedSo}
                />

            </Collapse>
            <Collapse
                in={activeSegment === 'done'}
            >
                <BaseTableExpanded
                    column={columnSo}
                    data={salesOrderDone}
                    expandComponent={ExpandedSo}
                />

            </Collapse>

        </>
    )

}

