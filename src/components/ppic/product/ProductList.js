import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import BaseTableDefaultExpanded from '../../tables/BaseTableDefaultExpanded'
import BaseTable from "../../tables/BaseTable";
import { Button, Group, Paper, TextInput, } from "@mantine/core";
import { IconDotsCircleHorizontal, IconSearch, IconPlus } from "@tabler/icons";
import { useRequest } from "../../../hooks/useRequest";


const ExpandedProduct = ({ data }) => {

    const products = useMemo(() => {
        return data.ppic_product_related.map(product => ({
            ...product, button: <Button
                leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                color='teal.8'
                variant='subtle'
                radius='md'
                component={Link}
                to={`${product.id}`}
            >
                Detail
            </Button>
        }))
    }, [data])

    const productColumn = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Product number',
            selector: row => row.code,
        },
        {
            name: 'Product type',
            selector: row => row.type.name,

        },
        {
            name: '',
            selector: row => row.button,
            style: {
                padding: 0,
            }
        }
    ], [])


    return (
        <>
            <Paper ml='lg' mb='md' >
                <BaseTable
                    column={productColumn}
                    data={products}
                    pagination={false}
                />

            </Paper>

        </>
    )
}


const ProductList = () => {

    const { Get, Loading } = useRequest()
    const [productCustomer, setProductCustomer] = useState([])
    const [searchVal, setSearchVal] = useState('')
    const filteredProductCustomer = useMemo(() => {
        const valFiltered = searchVal.toLowerCase()

        return productCustomer.reduce((prev, current) => {
            const products = current.ppic_product_related.filter(product => product.code.toLowerCase().includes(valFiltered) || product.name.toLowerCase().includes(valFiltered))

            if (valFiltered === '') {
                return [...prev, current]
            }

            if (products.length !== 0) {
                return [...prev, { ...current, ppic_product_related: products }]
            } else {
                return prev
            }

        }, [])
    }, [searchVal, productCustomer])

    const columnProductCustomer = useMemo(() => [

        {
            name: 'Customer name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Amount of product',
            selector: row => row.ppic_product_related.length,
        }

    ], [])

    useEffect(() => {
        const fetch = async () => {
            try {
                const productCustomer = await Get('product-list')
                setProductCustomer(productCustomer)

            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [])


    return (
        <>

            <Loading />
            <Group position="right" >
                <TextInput
                    icon={<IconSearch />}
                    placeholder='Search product'
                    radius='md'
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                />
                <Button
                    variant='outline'
                    style={{ float: 'right' }}
                    radius='md'
                    leftIcon={<IconPlus />}
                    component={Link}
                    to='new'
                >
                    Add product
                </Button>

            </Group>

            <BaseTableDefaultExpanded

                column={columnProductCustomer}
                data={filteredProductCustomer}
                expandComponent={ExpandedProduct}
                pagination={false}
                condition={row => row.ppic_product_related.length !== 0}
            />
        </>
    )
}

export default ProductList

