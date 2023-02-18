import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Group, TextInput, Select, Textarea, NumberInput, Text } from "@mantine/core";
import { IconUserCheck, IconCodeAsterix, IconCalendar, IconReceiptTax, IconDiscount2, IconClipboard } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { openModal, closeAllModals } from "@mantine/modals";
import { DatePicker } from "@mantine/dates";
import { useRequest, useSearch } from "../../../hooks";
import { ExpandedPurchaseOrder } from "../../layout";
import { BaseTableExpanded } from "../../tables";
import { FailedNotif, SuccessNotif } from "../../notifications";


import { generateDataWithDate } from "../../../services";
import { ModalForm, HeadSection, ButtonAdd, NavigationDetailButton, SearchTextInput } from "../../custom_components";


const ModalAddPurchaseOrder = () => {

    const { Get, Post } = useRequest()
    const navigate = useNavigate()
    const [supplierList, setSupplierList] = useState([])

    const form = useForm({
        initialValues: {
            code: '',
            supplier: null,
            date: null,
            description: '',
            tax: 10,
            discount: 0,
        }
    })

    const handleSubmit = async (value) => {
        const { date, ...rest } = value
        const validate_data = generateDataWithDate(date, rest)

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
        <ModalForm
            formId='formAddPurchaseOrder'
            onSubmit={form.onSubmit(handleSubmit)}  >

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

            <Group m='xs' grow >


                <DatePicker
                    label='Date'
                    placeholder="Pick order date"
                    radius='md'
                    icon={<IconCalendar />}
                    {...form.getInputProps('date')}
                />


                <NumberInput
                    label='Ppn'
                    placeholder="Input ppn dalam persen"
                    radius='md'
                    required
                    min={0}
                    hideControls
                    rightSection={<Text size='sm' color='dimmed' >
                        %
                    </Text>}
                    icon={<IconReceiptTax />}
                    {...form.getInputProps('tax')}
                />

                <NumberInput
                    label='Discount'
                    placeholder="Input discount dalam persen"
                    radius='md'
                    min={0}
                    required
                    hideControls
                    rightSection={<Text size='sm' color='dimmed' >
                        %
                    </Text>}
                    icon={<IconDiscount2 />}
                    {...form.getInputProps('discount')}
                />
            </Group>


            <Textarea
                label='Keterangan'
                placeholder="Input keterangan"
                m='xs'
                radius='md'
                icon={<IconClipboard />}
                {...form.getInputProps('description')}
            />

        </ModalForm>
    )
}





const PurchaseOrderList = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [purchaseOrderList, setPurchaseOrderList] = useState([])
    const { lowerCaseQuery, setValueQuery, query } = useSearch()

    const filteredPurchaseOrder = useMemo(() => {
        return purchaseOrderList.filter(po => {
            const { code, date, supplier } = po
            const { name } = supplier
            return name.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery) || date.toLowerCase().includes(lowerCaseQuery)
        })

    }, [purchaseOrderList, lowerCaseQuery])

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
            selector: row => <NavigationDetailButton
                url={`/home/purchasing/purchase-order/${row.id}`}
            />
        }
    ], [])

    const openModalAddPurchaseOrder = useCallback(() => openModal({
        title: "Add purchase order material",
        radius: 'md',
        size: 'xl',
        children: <ModalAddPurchaseOrder />
    }), [])


    useEffect(() => {

        GetAndExpiredTokenHandler('purchase-order').then(data => {
            setPurchaseOrderList(data)
        })

    }, [])


    return (
        <>

            <HeadSection>

                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />

                <ButtonAdd
                    onClick={openModalAddPurchaseOrder}
                >
                    Purchase order
                </ButtonAdd>

            </HeadSection>

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


