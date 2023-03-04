import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IconEngine } from "@tabler/icons";
import { TextInput } from "@mantine/core";
import { openModal, closeAllModals } from "@mantine/modals";
import { useForm } from "@mantine/form";

import { useRequest, useConfirmDelete, useNotification } from "../../../hooks";
import { BaseTable } from "../../tables";
import { ButtonAdd, ButtonDelete, ButtonEdit, ModalForm, HeadSection } from '../../custom_components'

const ModalEditMachine = ({ data, setUpdateMachine }) => {

    const form = useForm({
        initialValues: {
            name: data.name
        }
    })
    const { Put } = useRequest()
    const { successNotif, failedNotif } = useNotification()
    const handleSubmit = useCallback(async (value) => {

        try {
            const updatedMachine = await Put(data.id, value, 'machine-management')
            closeAllModals()
            setUpdateMachine(updatedMachine)
            successNotif('Edit machine success')
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Edit machine failed')
        }
    }, [setUpdateMachine, data.id, successNotif, failedNotif])

    return (
        <>
            <ModalForm
                formId='formEditMachine'
                onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    radius='md'
                    label='Machine name'
                    required
                    m='xs'
                    icon={<IconEngine />}
                    {...form.getInputProps('name')}
                />

            </ModalForm>
        </>
    )
}

const ModalAddMachine = ({ setAddMachine }) => {

    const form = useForm({
        initialValues: {
            name: ''
        }
    })
    const { Post } = useRequest()
    const { successNotif, failedNotif } = useNotification()
    const handleSubmit = async (value) => {

        try {
            const newMachine = await Post(value, 'machine-management')
            closeAllModals()
            setAddMachine(newMachine)
            successNotif('Add machine success')
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Add machine failed')
        }
    }

    return (
        <>
            <ModalForm
                formId='formAddMachine'
                onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    radius='md'
                    label='Machine name'
                    required
                    m='xs'
                    icon={<IconEngine />}
                    {...form.getInputProps('name')}
                />

            </ModalForm>
        </>
    )
}

const Machine = () => {

    const [machine, setMachine] = useState([])
    const { Get, Delete } = useRequest()
    const { successNotif, failedNotif } = useNotification()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Machine' })

    const setAddMachine = useCallback((newMachine) => {
        setMachine(prev => [...prev, newMachine])
    }, [])

    const setUpdateMachine = useCallback((updatedMachine) => {
        const { id, name } = updatedMachine
        setMachine(prev => prev.map(machine => {
            if (machine.id === id) {
                return { ...machine, name: name }
            }
            return machine
        }))

    }, [])

    const setDeleteMachine = useCallback((idDeletedMachine) => {
        setMachine(prev => prev.filter(machine => machine.id !== idDeletedMachine))
    }, [])

    const openEditMachine = useCallback((machine) => openModal({
        title: 'Edit machine name',
        radius: 'md',
        children: <ModalEditMachine
            data={machine}
            setUpdateMachine={setUpdateMachine} />
    }), [setUpdateMachine])

    const openAddMachine = useCallback(() => openModal({
        title: 'Add new machine',
        radius: 'md',
        children: <ModalAddMachine
            setAddMachine={setAddMachine} />
    }), [setAddMachine])

    const handleDeleteMachine = useCallback(async (id) => {
        try {
            await Delete(id, 'machine-management')
            setDeleteMachine(id)
            successNotif('Delete machine success')
        } catch (e) {
            failedNotif(e, 'Delete machine failed')
        }
    }, [setDeleteMachine, successNotif, failedNotif])

    const fetchMachine = useCallback(async () => {
        try {
            const machineList = await Get('machine')
            setMachine(machineList)
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetchMachine()

    }, [fetchMachine])


    const columnMachine = useMemo(() => [
        {
            name: 'Machine name',
            selector: row => row.name
        },
        {
            name: 'Times used',
            selector: row => `${row.numbers_of_production} times`
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openEditMachine(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteMachine(row.id))}
            />
        },
    ], [openEditMachine, openConfirmDeleteData, handleDeleteMachine])

    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openAddMachine}
                >
                    Machine
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnMachine}
                data={machine}

            />
        </>
    )

}

export default Machine


