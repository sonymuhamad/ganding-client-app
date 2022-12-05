import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Group, TextInput, Select } from "@mantine/core";
import { IconPlus, IconSearch, IconDotsCircleHorizontal, IconUserCheck, IconCodeAsterix, IconCalendar, IconDownload } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { openModal, closeAllModals } from "@mantine/modals";
import { DatePicker } from "@mantine/dates";
import { useRequest } from "../../../hooks";
import { ExpandedPurchaseOrder } from "../../layout";
import BaseTableExpanded from "../../tables";
import { FailedNotif, SuccessNotif } from "../../notifications";




const ModalAddPurchaseOrder = () => {

    const { Get, Loading, Post } = useRequest()
    const navigate = useNavigate()
    const [supplierList, setSupplierList] = useState([])

    const form = useForm({
        initialValues: {
            code: '',
            supplier: null,
            date: null
        }
    })

    const handleSubmit = async (value) => {
        let validate_data

        if (value.date) {
            validate_data = { ...value, date: value.date.toLocaleDateString('en-CA') }
        } else {
            validate_data = value
        }

        try {
            const newPo = await Post(validate_data, 'purchase-order-management')
            SuccessNotif('Add purchase order material success')
            closeAllModals()
            navigate(`/home/purchasing/purchase-order/${newPo.id}`)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add purchase order material failed')
        }
    }

    useEffect(() => {
        Get('supplier').then(data => {
            setSupplierList(data)
        })
    }, [])


    return (
        <form onSubmit={form.onSubmit(handleSubmit)}  >

            <Loading />

            <Select
                label='Supplier'
                placeholder="Select supplier"
                radius='md'
                m='xs'
                required
                searchable
                data={supplierList.map(supplier => ({ value: supplier.id, label: supplier.name }))}
                icon={<IconUserCheck />}
                {...form.getInputProps('supplier')}
            />

            <TextInput
                label='Purchase order number'
                placeholder="Input purchase order number"
                radius='md'
                m='xs'
                required
                icon={<IconCodeAsterix />}
                {...form.getInputProps('code')}
            />

            <DatePicker
                label='Date'
                placeholder="Pick order date"
                radius='md'
                m='xs'
                icon={<IconCalendar />}
                {...form.getInputProps('date')}
            />

            <Button
                fullWidth
                radius='md'
                type='submit'
                leftIcon={<IconDownload />}
            >
                Save
            </Button>


        </form>
    )
}





const PurchaseOrderList = () => {

    const { GetAndExpiredTokenHandler, Loading } = useRequest()
    const [purchaseOrderList, setPurchaseOrderList] = useState([])
    const [query, setQuery] = useState('')

    const filteredPurchaseOrder = useMemo(() => {
        return purchaseOrderList.filter(po => po.code.toLowerCase().includes(query.toLowerCase()) || po.date.toLowerCase().includes(query.toLowerCase()))
    }, [purchaseOrderList, query])

    const columnPurchaseOrderList = useMemo(() => [
        {
            name: 'Supplier',
            selector: row => row.supplier.name,
            sortable: true
        },
        {
            name: 'Po number',
            selector: row => row.code,
            sortable: true
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Total ordered material',
            selector: row => row.materialorder_set.length
        },
        {
            name: '',
            selector: row => row.detailButton
        }
    ], [])

    const openModalAddPurchaseOrder = useCallback(() => openModal({
        title: "Add purchase order material",
        radius: 'md',
        size: 'lg',
        children: <ModalAddPurchaseOrder />
    }), [])


    useEffect(() => {

        GetAndExpiredTokenHandler('purchase-order').then(data => {

            setPurchaseOrderList(data.map(dt => ({
                ...dt, detailButton: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`/home/purchasing/purchase-order/${dt.id}`}
                >
                    Detail
                </Button>
            })))

        })


    }, [])


    return (
        <>

            <Loading />

            <Group position="right" m='xs' >
                <TextInput
                    placeholder="Search"
                    icon={<IconSearch />}
                    value={query}
                    radius='md'
                    onChange={e => setQuery(e.target.value)}
                />

                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openModalAddPurchaseOrder}
                >
                    Purchase order
                </Button>
            </Group>

            <BaseTableExpanded
                noData="This supplier doesn't have any purchase order"
                column={columnPurchaseOrderList}
                data={filteredPurchaseOrder}
                expandComponent={ExpandedPurchaseOrder}
            />


        </>
    )
}

export default PurchaseOrderList


