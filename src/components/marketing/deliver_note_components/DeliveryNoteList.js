
import React, { useState, useEffect, useMemo } from "react";
import { BaseTable } from "../../tables";
import { useRequest } from "../../../hooks";
import { IconSearch, IconDotsCircleHorizontal } from "@tabler/icons";
import { TextInput, Button, Group } from "@mantine/core";
import { Link } from "react-router-dom";

const DeliveryNoteList = () => {
    const [deliveryNotes, setDeliveryNotes] = useState([])
    const { GetAndExpiredTokenHandler, Loading } = useRequest()
    const [searchVal, setSearchVal] = useState('')

    const filteredDeliveryNotes = useMemo(() => {

        const valFiltered = searchVal.toLowerCase()
        return deliveryNotes.filter((dn) => dn.customer.name.toLowerCase().includes(valFiltered) || dn.created.includes(valFiltered) || dn.code.includes(valFiltered))

    }, [deliveryNotes, searchVal])


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
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Product dikirim',
            selector: row => `${row.productdelivercustomer_set.length} product`,
            sortable: true
        },
        {
            name: '',
            selector: row => <Button
                component={Link}
                to={`/home/marketing/delivery-note/${row.id}`}
                leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                color='teal.8'
                variant='subtle'
                radius='md'
            >
                Detail
            </Button>,
            style: {
                padding: 0,
            }
        }

    ], [])

    useEffect(() => {
        const fetch = async () => {
            try {
                const deliveryNotes = await GetAndExpiredTokenHandler('delivery-notes')
                setDeliveryNotes(deliveryNotes)

            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [])


    return (
        <>

            <Loading />

            <Group position='right' >

                <TextInput
                    icon={<IconSearch />}
                    placeholder='Search'
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    radius='md'
                />
            </Group>



            <BaseTable
                column={columnDeliveryNote}
                data={filteredDeliveryNotes}
                noData="No data delivery"
            />

        </>
    )
}

export default DeliveryNoteList