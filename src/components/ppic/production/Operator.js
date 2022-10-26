import React, { useEffect, useState, useContext, useMemo } from "react";

import { IconEdit, IconTrash, IconPlus } from "@tabler/icons";
import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";
import { Button, Group, TextInput, Text } from "@mantine/core";
import { useRequest } from "../../../hooks/useRequest";
import { AuthContext } from "../../../context/AuthContext";
import BaseTable from '../../tables/BaseTable'
import { FailedNotif, SuccessNotif } from "../../notifications/Notifications";



const ModalEditOperator = ({ data, action }) => {

    const [name, setName] = useState('')
    const auth = useContext(AuthContext)
    const { Put, Loading } = useRequest()

    const handleSubmit = async (data) => {
        try {
            await Put(data.id, { name: name }, auth.user.token, 'operator')
            closeAllModals()
            action(prev => prev + 1)
            SuccessNotif('Edit operator name success')
        } catch (e) {
            console.log(e)
            FailedNotif('Edit operator name failed')
        }
    }

    useEffect(() => {
        setName(data.name)
    }, [])

    return (
        <>
            <Loading />
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(data)
            }}  >

                <TextInput
                    radius='md'
                    label='Operator name'
                    required
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <Button
                    my='md'
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

const ModalAddOperator = ({ action }) => {
    const [name, setName] = useState('')
    const auth = useContext(AuthContext)
    const { Post, Loading } = useRequest()

    const handleSubmit = async () => {
        try {
            await Post({ name: name }, auth.user.token, 'operator')
            closeAllModals()
            action(prev => prev + 1)
            SuccessNotif('Add new operator success')
        } catch (e) {
            console.log(e)
            FailedNotif('Add operator failed')
        }
    }

    return (
        <>
            <Loading />
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}  >

                <TextInput
                    radius='md'
                    label='Operator name'
                    required
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <Button
                    my='md'
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



const Operator = () => {

    const [operator, setOperator] = useState([])
    const [action, setAction] = useState([])
    const auth = useContext(AuthContext)
    const { Get, Delete } = useRequest()

    const columnOperator = useMemo(() => [
        {
            name: 'Operator name',
            selector: row => row.name
        },
        {
            name: '',
            selector: row => row.buttonEdit
        },
        {
            name: '',
            selector: row => row.buttonDelete
        },
        // {
        //     name: 'jumlah produksi harian',
        //     selector: row => row.buttonDelete
        // },
        // {
        //     name: 'total produksi bulan ini',
        //     selector: row => row.buttonDelete
        // },
    ], [])



    const openEditOperator = (operator) => openModal({
        title: 'Edit operator name',
        radius: 'md',
        children: <ModalEditOperator data={operator} action={setAction} />
    })


    const openAddOperator = () => openModal({
        title: 'Add new operator',
        radius: 'md',
        children: <ModalAddOperator action={setAction} />
    })


    const openDeleteOperator = (id) => openConfirmModal({
        title: 'Delete operator',
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteOperator(id)
    })

    const handleDeleteOperator = async (id) => {
        try {
            await Delete(id, auth.user.token, 'operator')
            SuccessNotif('delete data operator success')
            setAction(prev => prev + 1)
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data)
        }
    }

    useEffect(() => {
        // effect for fetch machine

        const fetchOperator = async () => {
            try {
                const operators = await Get(auth.user.token, 'operator')
                const operator = operators.map(op => ({
                    ...op, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='blue.6'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditOperator(op)}
                        >
                            Edit
                        </Button>,
                    buttonDelete: <Button
                        leftIcon={<IconTrash stroke={2} size={16} />}
                        color='red'
                        variant='subtle'
                        radius='md'
                        onClick={() => openDeleteOperator(op.id)}
                    >
                        Delete
                    </Button>
                }))

                setOperator(operator)
            } catch (e) {
                console.log(e)
            }
        }

        fetchOperator()

    }, [auth.user.token, action])


    return (
        <>

            <Group position="right" >
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openAddOperator}
                >
                    Operator
                </Button>
            </Group>
            <BaseTable
                column={columnOperator}
                data={operator}

            />
        </>
    )

}

export default Operator


