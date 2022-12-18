import React, { useState, useEffect, useMemo } from "react";

import { useRequest } from "../../../hooks";

import { BaseTableExpanded } from "../../tables";
import { TextInput, Group, Text } from "@mantine/core";
import { IconAsset, IconPerspective, IconSortAscending } from "@tabler/icons";


const ExpandedSupplier = ({ data }) => {

    const { most_ordered_material } = data
    const [name, setName] = useState('')
    const [spec, setSpec] = useState('')
    const [totalOrder, setTotalOrder] = useState(0)
    const [unitOfMaterial, setUnitOfMaterial] = useState('')

    useEffect(() => {


        if (most_ordered_material) {
            const { name, spec, total_order, uom } = most_ordered_material

            setName(name)
            setSpec(spec)
            setTotalOrder(total_order)
            setUnitOfMaterial(uom.name)

        }

    }, [data])

    return (
        <>

            {most_ordered_material ?

                <>
                    <Text
                        size='sm'
                        my='xs'
                        align='center'
                        color='dimmed'
                    >
                        Most ordered material
                    </Text>
                    <Group
                        m='xs'
                        grow
                    >
                        <TextInput
                            label='Material'
                            icon={<IconAsset />}
                            readOnly
                            variant='filled'
                            radius='md'
                            value={name}
                        />

                        <TextInput
                            label='Specification material'
                            icon={<IconPerspective />}
                            readOnly
                            variant='filled'
                            radius='md'
                            value={spec}
                        />

                        <TextInput
                            label='Total quantity ordered'
                            readOnly
                            variant="filled"
                            radius='md'
                            icon={<IconSortAscending />}
                            value={totalOrder}
                            rightSection={<Text size='sm' color='dimmed' >
                                {unitOfMaterial}
                            </Text>}
                        />

                    </Group>
                </>

                :

                <Text
                    size='sm'
                    align="center"
                    color='dimmed'
                    my='md'
                >
                    There is no material ordered by this supplier
                </Text>}

        </>
    )
}


const SupplierList = () => {

    const { Get } = useRequest()
    const [supplierList, setSupplierList] = useState([])

    const columnSupplier = useMemo(() => [
        {
            name: 'Supplier',
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
            name: 'Total quantity of materials ordered',
            selector: row => row.supplier_total_order
        },
    ], [])

    useEffect(() => {

        Get('report-supplier-material-order').then(data => {
            setSupplierList(data)
        })

    }, [])


    return (
        <BaseTableExpanded
            column={columnSupplier}
            data={supplierList}
            expandComponent={ExpandedSupplier}
            noData='No data supplier'

        />
    )
}

export default SupplierList

