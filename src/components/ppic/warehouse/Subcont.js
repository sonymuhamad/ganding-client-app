import React, { useState, useEffect, useContext, useMemo } from "react";
import { useRequest } from "../../../hooks/useRequest";
import { AuthContext } from "../../../context/AuthContext";
import ExpandedWarehouseFg from "../../layout/ExpandedWarehouseFg";
import BaseTableExpanded from "../../tables/BaseTableExpanded";
import ModalEditStockProduct from "../../layout/ModalEditStockProduct";
import { openModal } from "@mantine/modals";

import { Group, TextInput, Button } from "@mantine/core";
import { IconEdit } from "@tabler/icons";


const Subcont = () => {

    const auth = useContext(AuthContext)
    const { Get } = useRequest()
    const [searchProductSubcont, setSearchProductSubcont] = useState('')
    const [actionSubcont, setActionSubcont] = useState(0)
    const [productSubcont, setProductSubcont] = useState([])

    const filteredProductSubcont = useMemo(() => {

        // for handling search product

        const valFiltered = searchProductSubcont.toLowerCase()

        return productSubcont.filter(wh => wh.product.name.toLowerCase().includes(valFiltered) || wh.product.code.toLowerCase().includes(valFiltered) || wh.product.customer.name.toLowerCase().includes(valFiltered))

    }, [searchProductSubcont, productSubcont])

    const columnWhFinishedGoods = useMemo(() => [
        {
            name: 'Customer',
            selector: row => row.product.customer.name,
            sortable: true,

        },
        {
            name: 'Product',
            selector: row => row.product.name,
            sortable: true,

        },
        {
            name: 'Quantity',
            selector: row => row.quantity,

        },
        {
            name: '',
            selector: row => row.buttonEdit,
            style: {
                padding: 0,
                margin: 0
            }
        }
    ], [])


    const openEditSubcont = (productSubcont) => openModal({
        title: `Edit quantity subcont ${productSubcont.product.name}`,
        radius: 'md',
        children: <ModalEditStockProduct whProduct={productSubcont} setaction={setActionSubcont} />
    })


    useEffect(() => {
        // effect for product subcont

        const fetchProductSubcont = async () => {
            try {
                const whTypeSubcont = await Get(auth.user.token, 'warehouse-subcont')

                const productSubcont = whTypeSubcont.find(whType => whType.id === 2).warehouseproduct_set.map(wh => ({
                    ...wh, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='blue.6'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditSubcont(wh)}
                        >
                            Edit
                        </Button>
                }))

                setProductSubcont(productSubcont)

            } catch (e) {
                console.log(e)
            }



        }

        fetchProductSubcont()

    }, [auth.user.token, actionSubcont])


    return (
        <>

            <Group position="right" >
                <TextInput
                    placeholder="Search product"
                    value={searchProductSubcont}
                    radius='md'
                    onChange={e => setSearchProductSubcont(e.target.value)}
                />
            </Group>

            <BaseTableExpanded

                column={columnWhFinishedGoods}
                data={filteredProductSubcont}
                dense={true}
                expandComponent={ExpandedWarehouseFg}
            />
        </>
    )
}

export default Subcont