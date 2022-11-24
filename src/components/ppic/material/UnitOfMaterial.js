import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, TextInput, Group, Text } from "@mantine/core";

import { IconPlus, IconTrash, IconEdit, IconSignature, IconDownload, } from "@tabler/icons";


import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";

import { useRequest } from "../../../hooks/useRequest";
import BaseTable from "../../tables/BaseTable";
import { FailedNotif, SuccessNotif } from '../../notifications/Notifications'



const EditUnitOfMaterial = ({ uom, setaction }) => {

    const [name, setName] = useState('')
    const { Put, Loading } = useRequest()
    const [errorName, setErrorName] = useState(false)
    useEffect(() => {
        setName(uom.name)
    }, [uom.name])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        try {
            await Put(uom.id, { name: name }, 'uom-management')
            setaction(prev => prev + 1)
            SuccessNotif('Edit unit of material success')
            closeAllModals()
        } catch (e) {
            if (e.message.data.name) {
                setErrorName(e.message.data.name)
            }
            FailedNotif('Edit unit of material failed')
        }
    }
        , [Put, setaction, name, uom.id])

    return (
        <>
            <Loading />
            <form onSubmit={handleSubmit}   >

                <TextInput
                    icon={<IconSignature />}
                    error={errorName}
                    radius='md'
                    value={name}
                    required
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <Button
                    my='md'
                    radius='md'
                    type="submit"
                    fullWidth
                    leftIcon={<IconDownload />}
                    disabled={name === '' || name === uom.name}
                >
                    Save
                </Button>
            </form>
        </>
    )
}

const PostUnitOfMaterial = ({ setaction }) => {
    const [name, setName] = useState('')
    const { Post, Loading } = useRequest()
    const [errorName, setErrorName] = useState(false)

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        try {
            await Post({ name: name }, 'uom-management')
            setaction(prev => prev + 1)
            SuccessNotif('Add unit of material success')
            closeAllModals()
        } catch (e) {
            if (e.message.data.name) {
                setErrorName(e.message.data.name)
            }
            FailedNotif('Add unit of material failed')
        }
    }
        , [Post, setaction, name])



    return (
        <>
            <Loading />
            <form onSubmit={handleSubmit}  >

                <TextInput
                    error={errorName}
                    icon={<IconSignature />}
                    radius='md'
                    value={name}
                    required
                    label='Uom name'
                    placeholder="Input name of new unit of material"
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <Button
                    my='md'
                    radius='md'
                    type="submit"
                    fullWidth
                    leftIcon={<IconDownload />}
                >
                    Save
                </Button>
            </form>
        </>
    )
}

const UnitOfMaterial = () => {

    const { Get, Delete } = useRequest()
    const [uoms, setUoms] = useState([])
    const [uomAction, setUomAction] = useState(0)
    const columnUoms = useMemo(() => [
        {
            name: 'Unit of material',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Amount of material',
            selector: row => row.materials
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

    const handleDeleteUom = useCallback(async (id) => {
        try {
            await Delete(id, 'uom-management')
            setUomAction(prev => prev + 1)
            SuccessNotif('Delete unit of material success')
        } catch (e) {
            console.log(e)
            FailedNotif('Delete unit of material failed')
        }
    }, [])

    const openEditUomModal = useCallback((uom) => openModal({
        title: `Edit unit of material`,
        radius: 'md',
        children: <EditUnitOfMaterial uom={uom} setaction={setUomAction} />,
    }), [])

    const openPostUomModal = useCallback(() => openModal({
        title: `Add unit of material`,
        radius: 'md',
        children: <PostUnitOfMaterial setaction={setUomAction} />,
    }), [])

    const openDeleteUom = useCallback((id) => openConfirmModal({
        title: `Delete unit of material`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteUom(id)
    }), [handleDeleteUom])

    const fetchUom = useCallback(async () => {
        try {
            const uoms = await Get('uom-list')
            const unitOfMaterials = uoms.map(uom => ({
                ...uom, buttonEdit:

                    <Button
                        leftIcon={<IconEdit stroke={2} size={16} />}
                        color='teal.8'
                        variant='subtle'
                        radius='md'
                        mx='xs'
                        onClick={() => openEditUomModal(uom)}
                    >
                        Edit
                    </Button>,
                buttonDelete: <Button
                    leftIcon={<IconTrash stroke={2} size={16} />}
                    color='red'
                    variant='subtle'
                    radius='md'
                    onClick={() => openDeleteUom(uom.id)}
                >
                    Delete
                </Button>
            }))

            setUoms(unitOfMaterials)
        } catch (e) {
            console.log(e)
        }
    }, [openEditUomModal, openDeleteUom])

    useEffect(() => {

        // effect for unit of material

        fetchUom()

    }, [fetchUom, uomAction])


    return (
        <>

            <Group position="right" >
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    onClick={openPostUomModal}
                    variant='outline'
                >
                    Add unit of material
                </Button>
            </Group>

            <BaseTable
                column={columnUoms}
                data={uoms}
                pagination={false}
            />
        </>
    )


}

export default UnitOfMaterial
