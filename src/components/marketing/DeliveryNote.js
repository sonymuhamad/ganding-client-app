import React, { useMemo, useState, useEffect } from "react";
import BaseTableExpanded from "../tables/BaseTableExpanded";
import ExpandedDn from "../layout/ExpandedDn";
import { useRequest } from "../../hooks/useRequest";
import { IconSearch, IconDotsCircleHorizontal } from "@tabler/icons";
import { TextInput, Button, Group } from "@mantine/core";
import BreadCrumb from "../BreadCrumb";
import { Link } from "react-router-dom";

export default function DeliveryNote() {

    const [deliveryNotes, setDeliveryNotes] = useState([])
    const { GetAndExpiredTokenHandler } = useRequest()
    const [searchVal, setSearchVal] = useState('')

    const filteredDeliveryNotes = useMemo(() => {

        const valFiltered = searchVal.toLowerCase()
        return deliveryNotes.filter((dn) => dn.customer.name.toLowerCase().includes(valFiltered) || dn.created.includes(valFiltered) || dn.code.includes(valFiltered))

    }, [deliveryNotes, searchVal])

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
        const fetch = async () => {
            try {
                const deliveryNotes = await GetAndExpiredTokenHandler('delivery-notes')

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

                setDeliveryNotes(dn)


            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [])



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
                    onChange={e => setSearchVal(e.target.value)}
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


