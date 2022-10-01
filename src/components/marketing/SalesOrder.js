import React, { useEffect, useState, useContext, useMemo } from "react";

import { SegmentedControl, Button, Collapse, Group, TextInput } from "@mantine/core";
import { IconDotsCircleHorizontal, IconPlus, IconSearch } from "@tabler/icons";

import { Link } from "react-router-dom";

import BaseTableExpanded from "../layout/BaseTableExpanded";
import BreadCrumb from "../BreadCrumb";
import { AuthContext } from "../../context/AuthContext";
import { useRequest } from "../../hooks/useRequest";
import ExpandedSo from "../layout/ExpandedSo";


export default function SalesOrder() {

    const auth = useContext(AuthContext)
    const [activeSegment, setActiveSegment] = useState('on_progress')
    const [salesOrderProgress, setSalesOrderProgress] = useState([])
    const [salesOrderPending, setSalesOrderPending] = useState([])
    const [salesOrderDone, setSalesOrderDone] = useState([])
    const [searchVal, setSearchVal] = useState('')
    const [filteredSalesOrderProgress, setFilteredSalesOrderProgress] = useState([])
    const [filteredSalesOrderPending, setFilteredSalesOrderPending] = useState([])
    const [filteredSalesOrderDone, setFilteredSalesOrderDone] = useState([])

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
                const salesorders = await get(token, 'marketing/sales-order-list')
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
                setFilteredSalesOrderDone(done)
                setFilteredSalesOrderPending(pending)
                setFilteredSalesOrderProgress(on_progress)
            } catch (e) {
                console.log(e)
            }
        }

        fetch(Get, auth.user.token)
    }, [auth.user.token])

    const handleSearch = (e) => {
        const value = e.target.value
        setSearchVal(value)
        const valFiltered = value.toLowerCase()

        const filteredDone = salesOrderDone.filter((so) => so.customer.name.toLowerCase().includes(valFiltered) || so.date.includes(valFiltered) || so.code.includes(valFiltered))

        const filteredOnProgress = salesOrderProgress.filter((so) => so.customer.name.toLowerCase().includes(valFiltered) || so.date.includes(valFiltered) || so.code.includes(valFiltered))

        const filteredPending = salesOrderPending.filter((so) => so.customer.name.toLowerCase().includes(valFiltered) || so.date.includes(valFiltered) || so.code.includes(valFiltered))

        setFilteredSalesOrderDone(filteredDone)
        setFilteredSalesOrderPending(filteredPending)
        setFilteredSalesOrderProgress(filteredOnProgress)
    }


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
                <Group>

                    <TextInput
                        icon={<IconSearch />}
                        placeholder='Search'
                        value={searchVal}
                        onChange={handleSearch}
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
            </Group>





            <Collapse
                in={activeSegment === 'on_progress'}
            >
                <BaseTableExpanded
                    column={columnSo}
                    data={filteredSalesOrderProgress}
                    expandComponent={ExpandedSo}
                />

            </Collapse>
            <Collapse
                in={activeSegment === 'pending'}
            >
                <BaseTableExpanded
                    column={columnSo}
                    data={filteredSalesOrderPending}
                    expandComponent={ExpandedSo}
                />

            </Collapse>
            <Collapse
                in={activeSegment === 'done'}
            >
                <BaseTableExpanded
                    column={columnSo}
                    data={filteredSalesOrderDone}
                    expandComponent={ExpandedSo}
                />

            </Collapse>

        </>
    )

}

