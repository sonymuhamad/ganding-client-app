import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useRequest } from '../../../../hooks'
import { BaseTable } from '../../../tables'
import { useParams } from "react-router-dom";
import { Button, Group, TextInput, Image, NumberInput, Paper, Text } from "@mantine/core";
import { IconDotsCircleHorizontal, IconSearch, IconBarcode, IconCodeAsterix, IconReceipt2, IconBarbell, IconList, IconSum, IconFileTypography } from "@tabler/icons";
import { openModal } from "@mantine/modals";




const ModalDetailProduct = ({ data }) => {

    const { name, code, weight, image, process, type, price, total_stock } = data


    return (
        <>

            <TextInput
                variant='filled'
                m='xs'
                radius='md'
                label='Product name'
                readOnly
                icon={<IconBarcode />}
                value={name}
            />

            <TextInput
                radius='md'
                variant='filled'
                readOnly
                m='xs'
                icon={<IconCodeAsterix />}
                label='Product number'
                value={code}
            />

            <Group
                grow
                m='xs'
            >

                <TextInput
                    radius='md'
                    variant='filled'
                    readOnly
                    icon={<IconFileTypography />}
                    label='Product type'
                    value={type.name}
                />




                <NumberInput
                    label='Harga / unit'
                    placeholder="Input harga per unit"
                    value={price}
                    radius='md'
                    readOnly
                    hideControls
                    variant='filled'
                    min={0}
                    parser={(value) => value.replace(/\Rp\s?|(,*)/g, '')}
                    formatter={(value) =>
                        !Number.isNaN(parseFloat(value))
                            ? `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : 'Rp '
                    }
                    icon={<IconReceipt2 />}
                />

            </Group>

            <Group
                grow
                m='xs'
            >

                <NumberInput
                    readOnly
                    radius='md'
                    variant='filled'
                    icon={<IconBarbell />}
                    label='Weight / unit'
                    value={weight}
                    rightSection={<Text size='sm' color='dimmed'  >
                        Kg
                    </Text>}
                    decimalSeparator=','
                    precision={2}
                    step={0.5}
                />

                <TextInput
                    radius='md'
                    readOnly
                    variant='filled'
                    icon={<IconList />}
                    label='Jumlah proses'
                    value={`${process} process`}
                />

                <TextInput
                    variant='filled'
                    label='Total stock'
                    icon={<IconSum />}
                    radius='md'
                    value={total_stock}
                    readOnly
                />
            </Group>

            <Group my='lg' >
                <Paper>
                    <Image
                        radius='md'
                        src={image}
                        alt='product image'
                        withPlaceholder
                    />
                </Paper>
            </Group>



        </>
    )
}


const ProductList = () => {

    const [query, setQuery] = useState('')
    const [productList, setProductList] = useState([])
    const { RetrieveWithoutExpiredTokenHandler } = useRequest()
    const { customerId } = useParams()

    const filteredProduct = useMemo(() => {

        return productList.filter(product => product.name.toLowerCase().includes(query.toLowerCase()) || product.code.toLowerCase().includes(query.toLowerCase()))

    }, [query, productList])

    const openDetailModalProduct = useCallback((data) => openModal({
        title: 'Detail product',
        size: 'xl',
        radius: 'md',
        children: <ModalDetailProduct data={data} />
    }), [])

    const columnProduct = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.name
        },
        {
            name: 'Product number',
            selector: row => row.code
        },
        {
            name: 'Jumlah proses',
            selector: row => `${row.process} process`
        },
        {
            name: 'Harga / unit',
            selector: row => `Rp ${row.price}`
        },
        {
            name: '',
            selector: row => <Button
                onClick={() => openDetailModalProduct(row)}
                radius='md'
                leftIcon={<IconDotsCircleHorizontal
                    stroke={2} size={16} />}
                variant='subtle'
                color='teal.6'
            >
                Detail
            </Button>
        }
    ], [])

    useEffect(() => {

        RetrieveWithoutExpiredTokenHandler(customerId, 'product-customer').then(data => {
            setProductList(data)
        })

    }, [])

    return (
        <>
            <Group
                m='xs'
                position="right"
            >

                <TextInput
                    icon={<IconSearch />}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search product"
                    radius='md'
                />
            </Group>

            <BaseTable
                noData="No data product"
                column={columnProduct}
                data={filteredProduct}
            />

        </>
    )
}

export default ProductList
