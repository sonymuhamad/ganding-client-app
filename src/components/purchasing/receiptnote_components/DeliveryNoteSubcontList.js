import React, { useMemo, useEffect, useState } from "react";

import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { TextInput, Group, Button } from "@mantine/core";
import { IconDotsCircleHorizontal, IconSearch } from "@tabler/icons";
import { Link } from "react-router-dom";


const DeliveryNoteSubcontList = () => {

    const { Get } = useRequest()
    const [deliveryNoteSubcontList, setDeliveryNoteSubcontList] = useState([])
    const [query, setQuery] = useState('')
    const filteredDeliveryNoteSubcont = useMemo(() => {

        return deliveryNoteSubcontList.filter(dn => dn.code.toLowerCase().includes(query.toLocaleLowerCase()) || dn.supplier.name.toLocaleLowerCase().includes(query.toLowerCase()) || dn.date.toLocaleLowerCase().includes(query.toLowerCase()))

    }, [query, deliveryNoteSubcontList])

    const columnDeliveryNoteSubcont = useMemo(() => [
        {
            name: 'Supplier',
            selector: row => row.supplier.name,
            sortable: true
        },
        {
            name: 'Delivery number',
            selector: row => row.code
        },
        {
            name: 'Delivery date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Total product sent',
            selector: row => row.productdeliversubcont_set.length,
        },
        {
            name: '',
            selector: row => row.detailButton
        }
    ], [])

    useEffect(() => {

        Get('delivery-note-subcont').then(data => {
            setDeliveryNoteSubcontList(data.map(dt => ({
                ...dt, detailButton: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`/home/purchasing/shipments-and-receipts/shipment-subcont/${dt.id}`}
                >
                    Detail
                </Button>
            })))
        })

    }, [])

    return (
        <>

            <Group position="right" m='md' >

                <TextInput
                    placeholder="Search delivery note"
                    value={query}
                    icon={<IconSearch />}
                    radius='md'
                    onChange={e => setQuery(e.target.value)}
                />

            </Group>

            <BaseTable
                column={columnDeliveryNoteSubcont}
                data={filteredDeliveryNoteSubcont}
                noData='There is no data delivery product subconstruction'
            />

        </>
    )
}

export default DeliveryNoteSubcontList