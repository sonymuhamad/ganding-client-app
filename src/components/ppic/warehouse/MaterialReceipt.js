import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useRequest } from "../../../hooks/useRequest";
import BaseTableExpanded from "../../tables/BaseTableExpanded";
import { Button, Textarea, Paper, TextInput, NumberInput, Group, NativeSelect, Text, FileButton } from "@mantine/core";
import { IconDotsCircleHorizontal, IconClipboard, IconPlus, IconUpload, IconTrash, IconSearch } from "@tabler/icons";
import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from "../../notifications/Notifications";
import { useNavigate } from "react-router-dom";



const ExpandedMaterialReceipt = ({ data }) => {

    const materialReceipts = data.materialreceipt_set.map(mr => (
        <Group key={mr.id} grow my='lg' >

            <TextInput
                label='Material'
                radius='md'
                value={mr.material_order.material.name}
                readOnly
            />

            <NumberInput
                hideControls
                label='Quantity'
                value={mr.quantity}
                readOnly
            />

            <TextInput
                label='Purchase order'
                radius='md'
                value={mr.material_order.purchase_order_material.code}
                readOnly
            />

        </Group>
    ))

    return (
        <Paper p='lg' >
            <Textarea
                icon={<IconClipboard />}
                label='Notes'
                readOnly
                value={data.note}
                radius='md'
            />

            {materialReceipts}
        </Paper>
    )
}

const ModalAddDeliveryNoteMaterial = () => {

    const [supplierList, setSupplierList] = useState([])
    const auth = useContext(AuthContext)
    const navigate = useNavigate()
    const { Get, Loading, Post } = useRequest()
    const form = useForm({
        initialValues: {
            supplier: '',
            code: '',
            note: '',
            image: null
        }
    })

    useEffect(() => {
        Get(auth.user.token, 'supplier-list').then(data => {
            setSupplierList(data)
        })
    }, [])

    const handleSubmit = async (value) => {
        try {
            const newDnMaterial = await Post(value, auth.user.token, 'deliverynote-material-management', 'multipart/form-data')
            SuccessNotif('Add material delivery note success')
            closeAllModals()
            navigate(`/home/ppic/warehouse/${newDnMaterial.id}`)
        } catch (e) {
            console.log(e)
            FailedNotif('Add material delivery note failed')
        }
    }


    const openConfirmSubmit = (value) => openConfirmModal({
        title: `Add receipt note`,
        children: (
            <Text size="sm">
                Are you sure?, data will be saved.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit(value)
    })

    return (
        <>
            <Loading />

            <form onSubmit={form.onSubmit(openConfirmSubmit)} >

                <NativeSelect
                    radius='md'
                    label='Supplier'
                    placeholder="Select supplier"
                    data={supplierList.map(supplier => ({ value: supplier.id, label: supplier.name }))}
                    {...form.getInputProps('supplier')}
                />



                <TextInput
                    my='lg'
                    label='Receipt number'
                    radius='md'
                    required
                    placeholder="Input delivery note number"
                    {...form.getInputProps('code')}
                />

                <Textarea
                    label='Note'
                    radius='md'
                    placeholder="Put notes for this material delivery"
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

    const auth = useContext(AuthContext)
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
            style: {
                padding: -5,
                margin: -10
            }
        },
        {
            name: '',
            selector: row => row.buttonDetail,
            style: {
                padding: -5,
                margin: -10
            }

        }
    ], [])

    const openAddDeliveryNoteMaterial = () => openModal({
        title: 'Add material receipt note',
        radius: 'md',
        size: 'lg',
        children: <ModalAddDeliveryNoteMaterial />
    })


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await Get(auth.user.token, 'deliverynote-material')
                const dataDeliveryNotes = data.map(dn => ({
                    ...dn, buttonDetail: <Button
                        leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                        color='teal.6'
                        variant='subtle'
                        radius='md'
                        component={Link}
                        to={`/home/ppic/warehouse/${dn.id}`}
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
    }, [auth.user.token])


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

