import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { openModal, closeAllModals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { TextInput, Text, Textarea, Group, Button, Select, FileButton } from "@mantine/core";
import { IconUserCheck, IconCodeAsterix, IconCalendarEvent, IconUpload, IconTrash } from "@tabler/icons";

import { useRequest, useSearch } from "../../../hooks";
import { BaseTable } from "../../tables";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { generateDataWithDate } from "../../../services";
import { ModalForm, NavigationDetailButton, SearchTextInput, HeadSection, ButtonAdd } from "../../custom_components";


const ModalAddReceiptNoteSubcont = () => {

    const { Get, Post } = useRequest()
    const navigate = useNavigate()

    const [supplierList, setSupplierList] = useState([])
    const form = useForm({
        initialValues: {
            code: '',
            date: null,
            note: '',
            image: null,
            supplier: null
        }
    })

    const fetch = useCallback(async () => {
        try {
            const supplier = await Get('supplier-list')
            setSupplierList(supplier)
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetch()
    }, [fetch])


    const handleSubmit = useCallback(async (value) => {

        const { date, ...rest } = value
        const validate_data = generateDataWithDate(date, rest)
        try {
            const newReceiptNote = await Post(validate_data, 'receipt-note-subcont-management', 'multipart/form-data')
            SuccessNotif('Add receipt note product subconstruction success')
            navigate(`/home/ppic/warehouse/subcont-receipt/${newReceiptNote.id}`)
            closeAllModals()
        } catch (e) {
            FailedNotif('Add receipt note failed')
            form.setErrors(e.message.data)
        }
    }, [navigate, Post])

    return (

        <ModalForm
            formId='formAddReceiptNoteSubcont'
            onSubmit={form.onSubmit(handleSubmit)} >

            <Select
                {...form.getInputProps('supplier')}
                radius='md'
                required
                data={supplierList.map(supplier => ({ value: supplier.id, label: supplier.name }))}
                m='xs'
                label='Supplier'
                placeholder="Select supplier"
                icon={<IconUserCheck />}
            />

            <TextInput
                {...form.getInputProps('code')}
                required
                radius='md'
                m='xs'
                label='Receipt number'
                placeholder="Input receipt number of subconstruction"
                icon={<IconCodeAsterix />}
            />

            <DatePicker
                label='Receipt date'
                placeholder="Pick receipt date"
                m='xs'
                clearable
                radius='md'
                icon={<IconCalendarEvent />}
                {...form.getInputProps('date')}
            />


            <Textarea
                m='xs'
                label='Receipt Description'
                radius='md'
                placeholder="Put description for receipt product subconstruction"
                {...form.getInputProps('note')}
            />



            <Group>

                <FileButton
                    m='xs'
                    mt='md'
                    radius='md'
                    leftIcon={<IconUpload />}
                    style={{ display: form.values.image === null ? '' : 'none' }}
                    {...form.getInputProps('image')}
                    accept="image/png,image/jpeg" >
                    {(props) => <Button   {...props}>Upload image</Button>}
                </FileButton>

                <Button
                    mt='md'
                    radius='md'
                    leftIcon={<IconTrash />}
                    color='red.7'
                    onClick={() => {
                        form.setFieldValue('image', null)
                        form.setDirty('image')
                    }}
                    style={{ display: form.values.image !== null ? '' : 'none' }} >
                    Delete image
                </Button>

                {form.values.image && (
                    <Text size="sm" color='dimmed' align="center" mt="sm">
                        {form.values.image.name}
                    </Text>
                )}
            </Group>

        </ModalForm>
    )
}


const ReceiptNoteProductSubconstruction = () => {

    const { Get } = useRequest()
    const [receiptNoteSubcont, setReceiptNoteSubcont] = useState([])
    const { query, lowerCaseQuery, setValueQuery } = useSearch()

    const filteredReceiptNoteSubcont = useMemo(() => {
        return receiptNoteSubcont.filter(dn => {
            const { supplier, code, date } = dn
            const { name } = supplier
            return name.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery) || date.toLowerCase().includes(lowerCaseQuery)
        })

    }, [lowerCaseQuery, receiptNoteSubcont])

    const columnReceiptNoteProductSubcont = useMemo(() => [
        {
            name: 'Supplier',
            selector: row => row.supplier.name
        },
        {
            name: 'Receipt number',
            selector: row => row.code
        },
        {
            name: 'Date',
            selector: row => row.date
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/ppic/warehouse/subcont-receipt/${row.id}`}
            />,
        }
    ], [])

    const fetch = useCallback(async () => {
        try {
            const receiptNoteSubcont = await Get('receipt-note-subcont')
            setReceiptNoteSubcont(receiptNoteSubcont)
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetch()
    }, [fetch])


    const openAddReceiptNoteSubcont = useCallback(() => openModal({
        title: 'New receipt note product subconstruction',
        radius: 'md',
        size: 'xl',
        children: <ModalAddReceiptNoteSubcont />
    }), [])

    return (
        <>

            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />
                <ButtonAdd
                    onClick={openAddReceiptNoteSubcont}
                >
                    Receipt note subcont
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                data={filteredReceiptNoteSubcont}
                column={columnReceiptNoteProductSubcont}
                noData='Tidak ada penerimaan product subcont'
            />

        </>
    )

}


export default ReceiptNoteProductSubconstruction
