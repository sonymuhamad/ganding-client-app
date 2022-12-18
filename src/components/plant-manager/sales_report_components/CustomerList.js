import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";

import { BaseTableExpanded } from "../../tables";
import { TextInput, Group, Text } from "@mantine/core";
import { IconBarcode, IconCodeAsterix, IconSortAscending } from "@tabler/icons";



const ExpandedCustomerList = ({ data }) => {
    const { most_ordered_product } = data
    return (
        <>
            {most_ordered_product ?
                <>

                    <Text
                        align="center"
                        color='dimmed'
                        size='sm'
                        my='xs'
                    >
                        Most ordered product
                    </Text>

                    <Group m='xs' p='xs' grow >

                        <TextInput
                            label='Product name'
                            readOnly
                            radius='md'
                            icon={<IconBarcode />}
                            variant='filled'
                            value={most_ordered_product.name}
                        />

                        <TextInput
                            label='Product number'
                            readOnly
                            radius='md'
                            variant='filled'
                            value={most_ordered_product.code}
                            icon={<IconCodeAsterix />}
                        />

                        <TextInput
                            label="Total ordered"
                            readOnly
                            radius='md'
                            variant='filled'
                            value={most_ordered_product.total_order}
                            icon={<IconSortAscending />}
                            rightSection={<Text color='dimmed' size='xs' >
                                Unit
                            </Text>}
                        />

                    </Group>
                </>

                :

                <Text
                    align="center"
                    m='md'
                    size='sm'
                    color='dimmed'
                >
                    There are no products ordered by this customer yet
                </Text>
            }

        </>
    )
}


const CustomerList = () => {

    const { Get } = useRequest()
    const [customerList, setCustomerList] = useState([])

    const columnCustomer = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.name
        },
        {
            name: 'Contact',
            selector: row => row.phone
        },
        {
            name: 'Email',
            selector: row => row.email
        },
        {
            name: 'Total product ordered',
            selector: row => `${row.customer_total_order} Unit`
        }
    ], [])

    useEffect(() => {

        Get('report-customer-product-order').then(data => {
            setCustomerList(data)
        })

    }, [])

    return (
        <>

            <BaseTableExpanded
                column={columnCustomer}
                data={customerList}
                expandComponent={ExpandedCustomerList}
                noData='No data customer'
            />

        </>
    )
}


export default CustomerList