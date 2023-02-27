import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useRequest } from "../../../hooks";
import { BaseTableExpanded } from "../../tables";


import { TextInput, Text, Textarea, Group, Button, Paper, Select, FileButton } from "@mantine/core";
import { IconClipboardCheck, IconBarcode, IconRegex, IconPackgeImport, IconPlus, IconSearch, IconDotsCircleHorizontal, IconUserCheck, IconCodeAsterix, IconCalendarEvent, IconUpload, IconTrash, IconDownload } from "@tabler/icons";

import { openModal, closeAllModals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { FailedNotif, SuccessNotif } from "../../notifications";


const ExpandedReceiptNoteSubconstruction = ({ data }) => {

    const productReceivedSet = useMemo(() => {
        return data.subcontreceipt_set.map(subcont => (
            <Group key={subcont.id} p='xs' >
                <TextInput
                    label='Product'
                    readOnly
                    radius='md'
                    icon={<IconBarcode />}
                    value={subcont.product_subcont.product.name}
                />

                <TextInput
                    label='Product number'
                    readOnly
                    radius='md'
                    icon={<IconRegex />}
                    value={subcont.product_subcont.product.code}
                />

                <TextInput
                    label='Product number'
                    readOnly
                    radius='md'
                    icon={<IconPackgeImport />}
                    value={subcont.quantity}
                />

            </Group>
        ))
    }, [data])

    return (
        <Paper m='xs' p='xs' >
            <Textarea
                label='Receipt description'
                readOnly
                radius='md'
                value={data.note}
                icon={<IconClipboardCheck />}
            />

            {productReceivedSet.length === 0 ?
                <Text align="center" size='sm' color='dimmed' my='md' >
                    This receipt note doesn't have product received
                </Text>
                : productReceivedSet}

        </Paper>
    )
}

const ModalAddReceiptNoteSubcont = () => {

    const { Get, Post, Loading } = useRequest()
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
    }, [Get])

    useEffect(() => {
        fetch()
    }, [fetch])


    const handleSubmit = useCallback(async (value) => {
        let validate_data

        if (value.date) {
            validate_data = { ...value, date: value.date.toLocaleDateString('en-CA') }
        } else {
            validate_data = value
        }


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

        <form onSubmit={form.onSubmit(handleSubmit)} >

            <Loading />

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

            <Button
                m='xs'
                radius='md'
                leftIcon={<IconDownload />}
                type='submit'
            >

                Save

            </Button>


        </form>
    )
}


const ReceiptNoteProductSubconstruction = () => {

    const { Get } = useRequest()

    const [receiptNoteSubcont, setReceiptNoteSubcont] = useState([])
    const [searchVal, setSearchVal] = useState('')

    const filteredReceiptNoteSubcont = useMemo(() => {

        const filteredVal = searchVal.toLowerCase()

        return receiptNoteSubcont.filter(dn => dn.supplier.name.toLowerCase().includes(filteredVal) || dn.code.toLowerCase().includes(filteredVal) || dn.date.toLowerCase().includes(filteredVal))

    }, [searchVal, receiptNoteSubcont])

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
            selector: row => new Date(row.date).toDateString()
        },
        {
            name: 'Amount of product received',
            selector: row => row.subcontreceipt_set.length,
        },
        {
            name: '',
            selector: row => row.buttonDetail,

        }
    ], [])

    const fetch = useCallback(async () => {
        try {
            const receiptNoteSubcont = await Get('receipt-note-subcont')
            setReceiptNoteSubcont(receiptNoteSubcont.map(note => ({
                ...note, buttonDetail: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.6'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`/home/ppic/warehouse/subcont-receipt/${note.id}`}
                >
                    Detail
                </Button>
            })))
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
            <Group position="right" >
                <TextInput
                    icon={<IconSearch />}
                    placeholder='Search receipt note'
                    onChange={e => setSearchVal(e.target.value)}
                    value={searchVal}
                    radius='md'
                />
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openAddReceiptNoteSubcont}
                >
                    Receipt note subconstruction
                </Button>
            </Group>

            <BaseTableExpanded
                expandComponent={ExpandedReceiptNoteSubconstruction}
                data={filteredReceiptNoteSubcont}
                column={columnReceiptNoteProductSubcont}
            />

        </>
    )

}


export default ReceiptNoteProductSubconstruction
