import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { BaseTable } from '../../tables'
import { useRequest, useSearch } from "../../../hooks";
import { NavigationDetailButton, HeadSection, SearchTextInput, ButtonAdd } from "../../custom_components";

const ProductList = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [productList, setProductList] = useState([])
    const { lowerCaseQuery, query, setValueQuery } = useSearch()

    const filteredProductList = useMemo(() => {
        return productList.filter(product => {
            const { customer, name, code, type } = product
            return customer.name.toLowerCase().includes(lowerCaseQuery) || name.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery)
        })
    }, [lowerCaseQuery, productList])

    const productColumn = useMemo(() => [
        {
            name: 'Customer name',
            selector: row => row.customer.name
        },
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
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/ppic/product/${row.id}`}
            />,
        }
    ], [])

    useEffect(() => {
        const fetch = async () => {
            try {
                const productList = await GetAndExpiredTokenHandler('products')
                setProductList(productList)
            } catch (e) {
                console.log(e)
            }
        }
        fetch()

    }, [])


    return (
        <>

            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />
                <ButtonAdd
                    component={Link}
                    to='/home/ppic/product/new'
                >
                    Product
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={productColumn}
                data={filteredProductList}
                noData="Tidak ada data product"
            />

        </>
    )
}

export default ProductList

