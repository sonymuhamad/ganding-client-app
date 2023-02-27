import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useRequest, useConfirmDelete } from "../../../hooks";
import { TextInput, } from "@mantine/core";

import { BaseTable } from "../../tables";
import { IconSignature } from "@tabler/icons";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { closeAllModals, openModal } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { ModalForm, ButtonAdd, ButtonDelete, ButtonEdit, HeadSection } from "../../custom_components";


const AddProcessType = ({ setAddProcessType }) => {

    const { Post } = useRequest()
    const form = useForm({
        initialValues: {
            name: ''
        }
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            const newProcessType = await Post(value, 'process-type-management')
            setAddProcessType(newProcessType)
            SuccessNotif('Add process type success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add process type failed')
        }
    }, [Post, setAddProcessType])

    return (
        <ModalForm
            formId='formAddProcessType'
            onSubmit={form.onSubmit(handleSubmit)}  >

            <TextInput
                icon={<IconSignature />}
                radius='md'
                {...form.getInputProps('name')}
                required
                label='Type name'
                placeholder="Input name of new type"
            />

        </ModalForm>

    )
}


const EditProcessType = ({ setUpdateProcessType, data }) => {


    const { Put } = useRequest()
    const form = useForm({
        initialValues: {
            name: data.name
        }
    })


    const handleSubmit = useCallback(async (value) => {
        try {
            const updatedProcessType = await Put(data.id, value, 'process-type-management')
            closeAllModals()
            setUpdateProcessType(updatedProcessType)
            SuccessNotif('Edit process type success')
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit process type failed')
        }
    }, [setUpdateProcessType, data.id])

    return (
        <ModalForm
            formId='formEditProcessType'
            onSubmit={form.onSubmit(handleSubmit)}  >

            <TextInput
                icon={<IconSignature />}
                radius='md'
                label='Type'
                placeholder="Input type of process"
                required
                {...form.getInputProps('name')}
            />

        </ModalForm>
    )

}



const ProcessType = () => {

    const { Get, Delete } = useRequest()
    const [processType, setProcessType] = useState([])
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Process type' })

    const setAddProcessType = useCallback((newProcessType) => {
        setProcessType(prev => [...prev, newProcessType])
    }, [])

    const setUpdateProcessType = useCallback((updatedProcessType) => {
        const { name, id } = updatedProcessType
        setProcessType(prev => {
            return prev.map(processType => {
                if (processType.id === id) {
                    return { ...processType, name: name }
                }
                return processType
            })
        })
    }, [])

    const setDeleteProcessType = useCallback((idDeletedProcessType) => {
        setProcessType(prev => prev.filter(processType => processType.id !== idDeletedProcessType))
    }, [])

    const openAddProcessType = useCallback(() => openModal({
        title: `Add process type`,
        radius: 'md',
        children: <AddProcessType setAddProcessType={setAddProcessType} />,
    }), [setAddProcessType])

    const openEditProcessType = useCallback((data) => openModal({
        title: `Edit process type`,
        radius: 'md',
        children: <EditProcessType
            data={data}
            setUpdateProcessType={setUpdateProcessType} />
    }), [setUpdateProcessType])

    const handleDeleteProcessType = useCallback(async (id) => {
        try {
            await Delete(id, 'process-type-management')
            setDeleteProcessType(id)
            SuccessNotif('Delete process type success')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Delete process type failed')
        }
    }, [setDeleteProcessType])

    useEffect(() => {
        const fetchProcessType = async () => {
            try {
                const process_type = await Get('process-type')
                setProcessType(process_type)
            } catch (e) {
                console.log(e)
            }
        }
        fetchProcessType()

    }, [])


    const columnProcessType = useMemo(() => [
        {
            name: 'Type',
            selector: row => row.name
        },
        {
            name: 'Amount of process',
            selector: row => row.amount_of_process ? row.amount_of_process : 0
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openEditProcessType(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteProcessType(row.id))}
            />
        }
    ], [openEditProcessType, handleDeleteProcessType, openConfirmDeleteData])

    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openAddProcessType}
                >
                    Process type
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnProcessType}
                data={processType}

            />

        </>
    )
}

export default ProcessType