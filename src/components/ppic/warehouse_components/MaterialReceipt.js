import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRequest, useSearch } from "../../../hooks";
import { BaseTable } from "../../tables";
import { Button, Textarea, TextInput, Group, NativeSelect, Text, FileButton } from "@mantine/core";
import { IconUpload, IconTrash, IconCodeAsterix, IconUserCheck, IconClipboardCheck, IconCalendar } from "@tabler/icons";
import { openModal, closeAllModals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mantine/dates";

import { HeadSection, SearchTextInput, NavigationDetailButton, ButtonAdd, ModalForm } from '../../custom_components'
import { generateDataWithDate } from "../../../services";


const ModalAddDeliveryNoteMaterial = () => {

    const [supplierList, setSupplierList] = useState([])
    const navigate = useNavigate()
    const { Get, Post } = useRequest()
    const form = useForm({
        initialValues: {
            supplier: null,
            code: '',
            note: '',
            image: null,
            date: null
        },
        validate: {
            supplier: value => value === null ? 'Please select supplier' : null,
            code: value => value === '' ? 'This field is required' : null
        }
    })

    useEffect(() => {
        Get('supplier-list').then(data => {
            setSupplierList(data)
        })
    }, [])

    const handleSubmit = useCallback(async (value) => {
        const { date, ...rest } = value
        const validate_data = generateDataWithDate(date, rest)
        try {
            const newDnMaterial = await Post(validate_data, 'deliverynote-material-management', 'multipart/form-data')
            SuccessNotif('Add material delivery note success')
            closeAllModals()
            navigate(`/home/ppic/warehouse/material-receipt/${newDnMaterial.id}`)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add material delivery note failed')
        }
    }, [Post, navigate])


    return (

        <ModalForm
            formId='formAddReceiptNoteMaterial'
            onSubmit={form.onSubmit(handleSubmit)} >

            <NativeSelect
                icon={<IconUserCheck />}
                radius='md'
                m='xs'
                label='Supplier'
                placeholder="Select supplier"
                data={supplierList.map(supplier => ({ value: supplier.id, label: supplier.name }))}
                {...form.getInputProps('supplier')}
            />

            <TextInput
                icon={<IconCodeAsterix />}
                m='xs'
                label='Receipt number'
                radius='md'
                required
                placeholder="Input receipt note number"
                {...form.getInputProps('code')}
            />

            <DatePicker
                icon={<IconCalendar />}
                label='Receipt date'
                m='xs'
                placeholder="Select receipt date"
                radius='md'
                required
                {...form.getInputProps('date')}
            />

            <Textarea
                m='xs'
                icon={<IconClipboardCheck />}
                label='Material receipt description'
                radius='md'
                placeholder="Input description for this material receipt"
                {...form.getInputProps('note')}
            />


            <Group m='xs' >

                <FileButton
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


const MaterialReceipt = () => {

    const { Get } = useRequest()
    const [data, setData] = useState([])
    const { query, setValueQuery, lowerCaseQuery } = useSearch()

    const filteredData = useMemo(() => {
        return data.filter(dn => {
            const { supplier, code, date } = dn
            const { name } = supplier
            return name.toLowerCase().includes(lowerCaseQuery) || code.toLowerCase().includes(lowerCaseQuery) || date.toLowerCase().includes(lowerCaseQuery)
        })

    }, [lowerCaseQuery, data])

    const columnDeliveryNotes = useMemo(() => [
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
                url={`/home/ppic/warehouse/material-receipt/${row.id}`}
            />,
        }
    ], [])

    const openAddDeliveryNoteMaterial = useCallback(() => openModal({
        title: 'Add material receipt note',
        radius: 'md',
        size: 'xl',
        children: <ModalAddDeliveryNoteMaterial />
    }), [])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await Get('deliverynote-material')
                setData(data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [])


    return (
        <>
            <HeadSection>
                <SearchTextInput
                    query={query}
                    setValueQuery={setValueQuery}
                />
                <ButtonAdd
                    onClick={openAddDeliveryNoteMaterial}
                >
                    Material receipt note
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnDeliveryNotes}
                data={filteredData}
                noData='Tidak ada data penerimaan material'
            />
        </>
    )

}

export default MaterialReceipt

