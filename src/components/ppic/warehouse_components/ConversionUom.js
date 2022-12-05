import React, { useState, useEffect, useMemo, useCallback } from "react";
import { SuccessNotif, FailedNotif } from "../../notifications";
import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";
import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { Button, Group, NativeSelect, Text } from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons";


const EditConversionUom = ({ data, setaction }) => {
    const { Get, Put } = useRequest()
    const [uom, setUom] = useState([])

    const form = useForm({
        initialValues: {
            uom_input: data.uom_input.id,
            uom_output: data.uom_output.id,
        }
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            await Put(data.id, value, 'uom-conversion-management')
            setaction(prev => prev + 1)
            SuccessNotif('Edit conversion unit of material success')
            closeAllModals()
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data.non_field_errors)
        }
    }, [data.id, Put, setaction])


    const openConfirmSubmit = useCallback((value) => openConfirmModal({
        title: `Edit conversion unit of material`,
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
    }), [handleSubmit])

    useEffect(() => {

        const fetchUom = async () => {
            try {
                const uoms = await Get('uom-list')
                setUom(uoms)
            } catch (e) {
                console.log(e)
            }
        }

        fetchUom()

    }, [Get])

    return (
        <>
            <form onSubmit={form.onSubmit(openConfirmSubmit)}   >
                <Group grow my='md' >
                    <NativeSelect
                        label='Unit input'
                        radius='md'
                        required
                        data={uom.map(unit => ({ value: unit.id, label: unit.name }))}
                        {...form.getInputProps('uom_input')}
                    />

                    <NativeSelect
                        label='Unit output'
                        radius='md'
                        required
                        data={uom.map(unit => ({ value: unit.id, label: unit.name }))}
                        {...form.getInputProps('uom_output')}
                    />


                </Group>
                <Button
                    radius='md'
                    fullWidth
                    type='submit'
                >
                    Save
                </Button>
            </form>

        </>
    )
}

const PostConversionUom = ({ setaction }) => {

    const { Get, Post } = useRequest()
    const [uom, setUom] = useState([])

    const form = useForm({
        initialValues: {
            uom_input: '',
            uom_output: '',
        }
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            await Post(value, 'uom-conversion-management')
            setaction(prev => prev + 1)
            SuccessNotif('Add conversion unit of material success')
            closeAllModals()
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data.non_field_errors)
        }
    }
        , [Post, setaction])


    const openConfirmSubmit = useCallback((value) => openConfirmModal({
        title: `Add conversion unit of material`,
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
    }), [handleSubmit])

    useEffect(() => {

        const fetchUom = async () => {
            try {
                const uoms = await Get('uom-list')
                setUom(uoms)
            } catch (e) {
                console.log(e)
            }
        }

        fetchUom()

    }, [Get])

    return (
        <>
            <form onSubmit={form.onSubmit(openConfirmSubmit)}   >
                <Group grow my='md' >
                    <NativeSelect
                        label='Unit input'
                        radius='md'
                        required
                        placeholder="Select unit for base conversion"
                        data={uom.map(unit => ({ value: unit.id, label: unit.name }))}
                        {...form.getInputProps('uom_input')}
                    />

                    <NativeSelect
                        label='Unit output'
                        required
                        placeholder="Select unit for target conversion"
                        radius='md'
                        data={uom.map(unit => ({ value: unit.id, label: unit.name }))}
                        {...form.getInputProps('uom_output')}
                    />


                </Group>
                <Button
                    radius='md'
                    fullWidth
                    type='submit'
                >
                    Save
                </Button>
            </form>

        </>
    )
}

const ConversionUom = () => {

    const { Get, Delete } = useRequest()
    const [conversionUom, setConversionUom] = useState([])

    const [actionConversionUom, setActionConversionUom] = useState(0)
    const columnsConversionUom = useMemo(() => [
        {
            name: 'From uom',
            selector: row => row.uom_input.name
        },
        {
            name: 'To uom',
            selector: row => row.uom_output.name
        },
        {
            name: '',
            selector: row => row.buttonEdit
        },
        {
            name: '',
            selector: row => row.buttonDelete
        }
    ], [])

    const handleDeleteConversionUom = useCallback(async (id) => {
        try {
            await Delete(id, 'uom-conversion-management')
            SuccessNotif('Delete success')
            setActionConversionUom(prev => prev + 1)
        } catch (e) {
            FailedNotif('Delete failed')
        }
    }, [])

    const openDeleteConversionUom = useCallback((id) => openConfirmModal({
        title: 'Delete conversion unit of material',
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteConversionUom(id)
    }), [handleDeleteConversionUom])

    const openEditConversionUom = useCallback((conversionUom) => openModal({
        title: 'Edit conversion unit of material',
        radius: 'md',
        size: 'lg',
        children: <EditConversionUom data={conversionUom} setaction={setActionConversionUom} />
    }), [])

    const openPostConversionUom = useCallback(() => openModal({
        title: 'Add conversion unit of material',
        radius: 'md',
        size: 'lg',
        children: <PostConversionUom setaction={setActionConversionUom} />
    }), [])


    useEffect(() => {
        // effect for conversion unit of material

        const fetchConversionUom = async () => {

            try {
                const uoms = await Get('uom-conversion-detail')

                setConversionUom(uoms.map(uom => ({
                    ...uom, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='blue.6'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditConversionUom(uom)}
                        >
                            Edit
                        </Button>,
                    buttonDelete: <Button
                        leftIcon={<IconTrash stroke={2} size={16} />}
                        color='red'
                        variant='subtle'
                        radius='md'
                        onClick={() => openDeleteConversionUom(uom.id)}
                    >
                        Delete
                    </Button>
                })))

            } catch (e) {
                console.log(e)
            }
        }

        fetchConversionUom()
    }, [actionConversionUom, openDeleteConversionUom, openEditConversionUom])


    return (
        <>

            <Group position="right" >
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openPostConversionUom}
                >
                    Conversion unit of material
                </Button>
            </Group>

            <BaseTable

                column={columnsConversionUom}
                data={conversionUom}

            />

        </>
    )

}


export default ConversionUom