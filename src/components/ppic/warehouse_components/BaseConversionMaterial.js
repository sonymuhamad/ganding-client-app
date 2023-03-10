import React, { useState, useEffect, useMemo, useCallback } from "react";
import { SuccessNotif, FailedNotif } from "../../notifications";
import { useRequest } from "../../../hooks";
import { BaseTable } from "../../tables";

import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";
import { Button, Group, TextInput, NativeSelect, Text, NumberInput } from "@mantine/core";
import { IconTrash, IconEdit, IconPlus } from "@tabler/icons";
import { useForm } from "@mantine/form";


const EditBaseConversionMaterial = ({ data, setaction }) => {

    const { Put, Get } = useRequest()
    const [material, setMaterial] = useState([])

    const form = useForm({
        initialValues: {
            material_input: data.material_input.id,
            material_output: data.material_output.id,
            quantity_input: data.quantity_input,
            quantity_output: data.quantity_output
        }
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            await Put(data.id, value, 'based-conversion-management')
            SuccessNotif('Edit base conversion material success')
            setaction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            FailedNotif(e.message.data.non_field_errors)
        }
    }, [Put, data.id, setaction])


    const openConfirmSubmit = useCallback((value) => openConfirmModal({
        title: `Edit base conversion material`,
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
        const fetchMaterial = async () => {
            try {
                const materials = await Get('material-lists')
                setMaterial(materials)

            } catch (e) {
                console.log(e)
            }
        }
        fetchMaterial()
    }, [Get])

    return (
        <>
            <form onSubmit={form.onSubmit(openConfirmSubmit)}  >
                <Group grow >
                    <NativeSelect
                        radius='md'
                        required
                        label='From material'
                        data={material.map(materi => ({ value: materi.id, label: materi.name }))}
                        {...form.getInputProps('material_input')}
                    />

                    <TextInput
                        label='Uom'
                        readOnly
                        radius='md'
                        value={material.find(materi => materi.id === parseInt(form.values.material_input)) === undefined ? '' : material.find(materi => materi.id === parseInt(form.values.material_input)).uom.name}
                    />

                    <NumberInput
                        hideControls
                        min={0}
                        radius='md'
                        label='Quantity'
                        required
                        {...form.getInputProps('quantity_input')}
                    />
                </Group>

                <Group grow my='lg' >
                    <NativeSelect
                        radius='md'
                        required
                        label='From material'
                        data={material.map(materi => ({ value: materi.id, label: materi.name }))}
                        {...form.getInputProps('material_output')}
                    />

                    <TextInput
                        label='Uom'
                        readOnly
                        radius='md'
                        value={material.find(materi => materi.id === parseInt(form.values.material_output)) === undefined ? '' : material.find(materi => materi.id === parseInt(form.values.material_output)).uom.name}
                    />

                    <NumberInput
                        hideControls
                        min={0}
                        radius='md'
                        label='Quantity'
                        required
                        {...form.getInputProps('quantity_output')}
                    />
                </Group>

                <Button
                    type="submit"
                    radius='md'
                    fullWidth
                    disabled={!form.isDirty()}
                >
                    Save
                </Button>
            </form>
        </>
    )
}

const PostBaseConversionMaterial = ({ setaction }) => {
    const { Post, Get } = useRequest()
    const [material, setMaterial] = useState([])

    const form = useForm({
        initialValues: {
            material_input: '',
            material_output: '',
            quantity_input: '',
            quantity_output: ''
        }
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            await Post(value, 'based-conversion-management')
            SuccessNotif('Add base conversion material success')
            setaction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data.non_field_errors)
        }
    }, [Post, setaction])


    const openConfirmSubmit = useCallback((value) => openConfirmModal({
        title: `Add base conversion material`,
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
        const fetchMaterial = async () => {
            try {
                const materials = await Get('material-lists')
                setMaterial(materials)

            } catch (e) {
                console.log(e)
            }
        }
        fetchMaterial()
    }, [Get])

    return (
        <>
            <form onSubmit={form.onSubmit(openConfirmSubmit)}  >
                <Group grow >
                    <NativeSelect
                        radius='md'
                        label='From material'
                        required
                        placeholder="Select material name"
                        data={material.map(materi => ({ value: materi.id, label: materi.name }))}
                        {...form.getInputProps('material_input')}
                    />

                    <TextInput
                        label='Uom'
                        readOnly
                        radius='md'
                        value={material.find(materi => materi.id === parseInt(form.values.material_input)) === undefined ? '' : material.find(materi => materi.id === parseInt(form.values.material_input)).uom.name}
                    />

                    <NumberInput
                        hideControls
                        min={0}
                        radius='md'
                        required
                        label='Quantity'
                        placeholder="Input quantity"
                        {...form.getInputProps('quantity_input')}
                    />
                </Group>

                <Group grow my='lg' >
                    <NativeSelect
                        radius='md'
                        placeholder="Select material name"
                        required
                        label='From material'
                        data={material.map(materi => ({ value: materi.id, label: materi.name }))}
                        {...form.getInputProps('material_output')}
                    />

                    <TextInput
                        label='Uom'
                        readOnly
                        radius='md'
                        value={material.find(materi => materi.id === parseInt(form.values.material_output)) === undefined ? '' : material.find(materi => materi.id === parseInt(form.values.material_output)).uom.name}
                    />

                    <NumberInput
                        hideControls
                        min={0}
                        required
                        radius='md'
                        placeholder="Input quantity"
                        label='Quantity'
                        {...form.getInputProps('quantity_output')}
                    />
                </Group>

                <Button
                    type="submit"
                    radius='md'
                    fullWidth >
                    Save
                </Button>
            </form>
        </>
    )
}

const BaseConversionMaterial = () => {

    const [basedConversionMaterial, setBasedConversionMaterial] = useState([])
    const { Get, Delete } = useRequest()
    const [actionBaseConversionMaterial, setActionBaseConversionMaterial] = useState(0)

    const columnConversionMaterial = useMemo(() => [
        {
            name: 'From material',
            selector: row => row.material_input.name,
            sortable: true
        },
        {
            name: 'Qty',
            selector: row => row.quantity_input
        },
        {
            name: 'To material',
            selector: row => row.material_output.name
        },
        {
            name: 'Qty',
            selector: row => row.quantity_output
        },
        {
            name: '',
            selector: row => row.buttonEdit,
            style: {
                padding: 0,
                margin: 0
            }
        },
        {
            name: '',
            selector: row => row.buttonDelete,
            style: {
                padding: 0,
                margin: 0
            }
        }
    ], [])

    const handleDeleteBaseConversionMaterial = useCallback(async (id) => {
        try {
            await Delete(id, 'based-conversion-management')
            SuccessNotif('Delete conversion material success')
            setActionBaseConversionMaterial(prev => prev + 1)
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [])



    const openDeleteBaseConversionMaterialModal = useCallback((id) => openConfirmModal({
        title: 'Delete conversion material',
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteBaseConversionMaterial(id)
    }), [handleDeleteBaseConversionMaterial])


    const openEditBaseConversionMaterial = useCallback((baseConversion) => openModal({
        title: 'Edit Base conversion material',
        radius: 'md',
        size: 'xl',
        children: <EditBaseConversionMaterial data={baseConversion} setaction={setActionBaseConversionMaterial} />
    }), [])

    const openPostBaseConversionMaterial = useCallback(() => openModal({
        title: 'Add Base conversion material',
        radius: 'md',
        size: 'xl',
        children: <PostBaseConversionMaterial setaction={setActionBaseConversionMaterial} />
    }), [])

    useEffect(() => {
        // effect for conversion material report and base

        const fetchConversionMaterial = async () => {
            try {
                const basedConversion = await Get('based-conversion-detail')

                setBasedConversionMaterial(basedConversion.map(based => ({
                    ...based, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='blue.6'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditBaseConversionMaterial(based)}
                        >
                            Edit
                        </Button>,
                    buttonDelete: <Button
                        leftIcon={<IconTrash stroke={2} size={16} />}
                        color='red'
                        variant='subtle'
                        radius='md'
                        onClick={() => openDeleteBaseConversionMaterialModal(based.id)}
                    >
                        Delete
                    </Button>
                })))

            } catch (e) {
                console.log(e)
            }
        }

        fetchConversionMaterial()

    }, [actionBaseConversionMaterial, openDeleteBaseConversionMaterialModal, openEditBaseConversionMaterial])


    return (
        <>
            <Group position="right" >
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openPostBaseConversionMaterial}
                >
                    Base conversion
                </Button>
            </Group>

            <BaseTable
                column={columnConversionMaterial}
                data={basedConversionMaterial}
            />
        </>
    )
}


export default BaseConversionMaterial

