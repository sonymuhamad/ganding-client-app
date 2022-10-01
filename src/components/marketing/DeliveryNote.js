import React, { useMemo, useState, useEffect, useContext } from "react";
import BaseTableExpanded from "../layout/BaseTableExpanded";
import ExpandedDn from "../layout/ExpandedDn";
import { useRequest } from "../../hooks/useRequest";
import { IconSearch, IconDotsCircleHorizontal } from "@tabler/icons";
import { TextInput, Button, Group } from "@mantine/core";
import BreadCrumb from "../BreadCrumb";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function DeliveryNote() {

    const [deliveryNotes, setDeliveryNotes] = useState([])
    const [filteredDeliveryNotes, setFilteredDeliveryNotes] = useState([])
    const { Get } = useRequest()
    const [searchVal, setSearchVal] = useState('')
    const auth = useContext(AuthContext)

    const breadcrumb = [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/delivery-note',
            label: 'Delivery note'
        }
    ]

    useEffect(() => {
        const fetch = async (token, endpoint) => {
            try {
                const deliveryNotes = await Get(token, endpoint)

                const dn = deliveryNotes.map(dn => {
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

                setDeliveryNotes([...dn])
                setFilteredDeliveryNotes([...dn])

            } catch (e) {
                console.log(e)
            }
        }
        fetch(auth.user.token, 'marketing/delivery-notes')
    }, [auth.user.token])

    const handleSearch = async (event) => {
        const value = event.target.value
        setSearchVal(value)
        const valFiltered = value.toLowerCase()
        const filtered = deliveryNotes.filter((dn) => dn.customer.name.toLowerCase().includes(valFiltered) || dn.created.includes(valFiltered) || dn.code.includes(valFiltered))
        setFilteredDeliveryNotes(filtered)
    }


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



    return (
        <>

            <BreadCrumb links={breadcrumb} />
            <Group position='right' >

                <TextInput
                    icon={<IconSearch />}
                    placeholder='Search'
                    value={searchVal}
                    onChange={handleSearch}
                    radius='md'
                />
            </Group>



            <BaseTableExpanded
                column={columnDeliveryNote}
                data={filteredDeliveryNotes}
                expandComponent={ExpandedDn}
            />


        </>


    )

}


