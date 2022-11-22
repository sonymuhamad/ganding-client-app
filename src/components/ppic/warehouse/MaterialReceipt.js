import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useRequest } from "../../../hooks/useRequest";
import BaseTableExpanded from "../../tables/BaseTableExpanded";
import { Button, Textarea, Paper, TextInput, NumberInput, Group, NativeSelect, Text, FileButton } from "@mantine/core";
import { IconDotsCircleHorizontal, IconClipboard, IconPlus, IconUpload, IconTrash, IconSearch, IconAsset, IconPackgeImport, IconCodeAsterix, IconUserCheck, IconClipboardCheck } from "@tabler/icons";
import { openModal, closeAllModals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from "../../notifications/Notifications";
import { useNavigate } from "react-router-dom";



const ExpandedMaterialReceipt = ({ data }) => {

    const materialReceipts = useMemo(() => {
        return data.materialreceipt_set.map(mr => (
            <Group key={mr.id} grow my='lg' >

                <TextInput
                    icon={<IconAsset />}
                    label='Material'
                    radius='md'
                    value={mr.material_order.material.name}
                    readOnly
                />

                <NumberInput
                    icon={<IconPackgeImport />}
                    radius='md'
                    hideControls
                    label='Quantity'
                    value={mr.quantity}
                    readOnly
                />

                <TextInput
                    icon={<IconCodeAsterix />}
                    label='Purchase order'
                    radius='md'
                    value={mr.material_order.purchase_order_material.code}
                    readOnly
                />

            </Group>
        ))
    }, [data])

    return (
        <Paper m='xs' p='xs' >

            <Textarea
                icon={<IconClipboard />}
                label='Receipt descriptions'
                readOnly
                value={data.note}
                radius='md'
            />

            {materialReceipts.length === 0 ?
                <Text align="center" size='sm' color='dimmed' my='md' >
                    This receipt note doesn't have material received
                </Text>
                : materialReceipts}

        </Paper>
    )
}

const ModalAddDeliveryNoteMaterial = () => {

    const [supplierList, setSupplierList] = useState([])
    const navigate = useNavigate()
    const { Get, Loading, Post } = useRequest()
    const form = useForm({
        initialValues: {
            supplier: null,
            code: '',
            note: '',
            image: null
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
    }, [Get])

    const handleSubmit = useCallback(async (value) => {
        try {
            const newDnMaterial = await Post(value, 'deliverynote-material-management', 'multipart/form-data')
            SuccessNotif('Add material delivery note success')
            closeAllModals()
            navigate(`/home/ppic/warehouse/material-receipt/${newDnMaterial.id}`)
        } catch (e) {
            console.log(e)
            FailedNotif('Add material delivery note failed')
        }
    }, [Post, navigate])


    return (
        <>
            <Loading />

            <form onSubmit={form.onSubmit(handleSubmit)} >

                <NativeSelect
                    icon={<IconUserCheck />}
                    radius='md'
                    label='Supplier'
                    placeholder="Select supplier"
                    data={supplierList.map(supplier => ({ value: supplier.id, label: supplier.name }))}
                    {...form.getInputProps('supplier')}
                />



                <TextInput
                    icon={<IconCodeAsterix />}
                    my='lg'
                    label='Receipt number'
                    radius='md'
                    required
                    placeholder="Input receipt note number"
                    {...form.getInputProps('code')}
                />

                <Textarea
                    icon={<IconClipboardCheck />}
                    label='Material receipt description'
                    radius='md'
                    placeholder="Input description for this material receipt"
                    {...form.getInputProps('note')}
                />


                <Group>

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

                <Button
                    fullWidth
                    type="submit"
                    radius='md'
                    my='lg'
                >
                    Save
                </Button>

            </form>

        </>
    )
}


const MaterialReceipt = () => {

    const { Get } = useRequest()
    const [data, setData] = useState([])
    const [searchVal, setSearchVal] = useState('')

    const filteredData = useMemo(() => {

        const filteredVal = searchVal.toLowerCase()

        return data.filter(dn => dn.supplier.name.toLowerCase().includes(filteredVal) || dn.code.toLowerCase().includes(filteredVal) || dn.date.toLowerCase().includes(filteredVal))

    }, [searchVal, data])

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
            selector: row => new Date(row.date).toDateString()
        },
        {
            name: 'Amount of material received',
            selector: row => row.materialreceipt_set.length,
        },
        {
            name: '',
            selector: row => row.buttonDetail,
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
                const dataDeliveryNotes = data.map(dn => ({
                    ...dn, buttonDetail: <Button
                        leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                        color='teal.6'
                        variant='subtle'
                        radius='md'
                        component={Link}
                        to={`/home/ppic/warehouse/material-receipt/${dn.id}`}
                    >
                        Detail
                    </Button>
                }))

                setData(dataDeliveryNotes)

            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [])


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
                    onClick={openAddDeliveryNoteMaterial}
                >
                    Add material receipt note
                </Button>
            </Group>
            <BaseTableExpanded
                column={columnDeliveryNotes}
                data={filteredData}
                expandComponent={ExpandedMaterialReceipt}
            />
        </>
    )

}

export default MaterialReceipt

