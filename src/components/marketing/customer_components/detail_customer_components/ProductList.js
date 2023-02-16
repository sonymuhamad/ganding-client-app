import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useRequest } from '../../../../hooks'
import { BaseTable } from '../../../tables'
import { useParams } from "react-router-dom";
import { Button, Group, TextInput, Image, NumberInput, Paper, Text } from "@mantine/core";
import { IconDotsCircleHorizontal, IconBarcode, IconCodeAsterix, IconBarbell, IconList, IconSum, IconFileTypography } from "@tabler/icons";
import { openModal } from "@mantine/modals";

import { PriceTextInput, HeadSection, SearchTextInput } from "../../../custom_components";
import { useSearch } from "../../../../hooks";



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

                <PriceTextInput
                    label='Harga / unit'
                    value={price}
                    variant='filled'
                    readOnly
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

    const [productList, setProductList] = useState([])
    const { RetrieveWithoutExpiredTokenHandler } = useRequest()
    const { customerId } = useParams()
    const { lowerCaseQuery, setValueQuery, query } = useSearch()

    const filteredProduct = useMemo(() => {

        return productList.filter(product => {
            const { name, code } = product
            return name.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery)
        })

    }, [lowerCaseQuery, productList])

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
    ], [openDetailModalProduct])

    useEffect(() => {

        RetrieveWithoutExpiredTokenHandler(customerId, 'product-customer').then(data => {
            setProductList(data)
        })

    }, [])

    return (
        <>
            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />
            </HeadSection>

            <BaseTable
                noData="No data product"
                column={columnProduct}
                data={filteredProduct}
            />

        </>
    )
}

export default ProductList
