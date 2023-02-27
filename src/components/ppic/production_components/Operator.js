import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IconId } from "@tabler/icons";
import { openModal, closeAllModals } from "@mantine/modals";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useRequest, useConfirmDelete } from "../../../hooks";
import { BaseTable } from '../../tables'
import { FailedNotif, SuccessNotif } from "../../notifications";
import { ModalForm, ButtonAdd, ButtonDelete, ButtonEdit, HeadSection } from "../../custom_components";


const ModalEditOperator = ({ data, setUpdateOperator }) => {

    const form = useForm({
        initialValues: {
            name: data.name
        }
    })
    const { Put } = useRequest()

    const handleSubmit = useCallback(async (value) => {
        try {
            const updatedOperator = await Put(data.id, value, 'operator-management')
            setUpdateOperator(updatedOperator)
            closeAllModals()
            SuccessNotif('Edit operator name success')
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit operator name failed')
        }
    }, [setUpdateOperator, data.id])


    return (
        <>
            <ModalForm
                formId='formEditOperator'
                onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    icon={<IconId />}
                    radius='md'
                    m='xs'
                    label='Operator name'
                    required
                    {...form.getInputProps('name')}
                />

            </ModalForm>
        </>
    )
}

const ModalAddOperator = ({ setAddOperator }) => {
    const form = useForm({
        initialValues: {
            name: ''
        }
    })
    const { Post } = useRequest()

    const handleSubmit = async (value) => {
        try {
            const newOperator = await Post(value, 'operator-management')
            setAddOperator(newOperator)
            closeAllModals()
            SuccessNotif('Add new operator success')
        } catch (e) {
            form.setErrors(e.message.data)
            console.log(e)
            FailedNotif('Add operator failed')
        }
    }

    return (
        <ModalForm
            formId='formAddOperator'
            onSubmit={form.onSubmit(handleSubmit)}  >

            <TextInput
                radius='md'
                label='Operator name'
                required
                m='xs'
                icon={<IconId />}
                {...form.getInputProps('name')}
            />

        </ModalForm>
    )
}



const Operator = () => {

    const [operator, setOperator] = useState([])
    const { Get, Delete } = useRequest()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Operator' })

    const setAddOperator = useCallback((newOperator) => {
        setOperator(prev => [...prev, newOperator])
    }, [])

    const setUpdateOperator = useCallback((updatedOperator) => {
        const { id, name } = updatedOperator
        setOperator(prev => prev.map(operator => {
            if (operator.id === id) {
                return { ...operator, name: name }
            }
            return operator
        }))

    }, [])

    const setDeleteOperator = useCallback((idDeletedOperator) => {
        setOperator(prev => prev.filter(operator => operator.id !== idDeletedOperator))
    }, [])

    const openEditOperator = useCallback((operator) => openModal({
        title: 'Edit operator name',
        radius: 'md',
        children: <ModalEditOperator
            data={operator}
            setUpdateOperator={setUpdateOperator} />
    }), [setUpdateOperator])


    const openAddOperator = useCallback(() => openModal({
        title: 'Add new operator',
        radius: 'md',
        children: <ModalAddOperator
            setAddOperator={setAddOperator} />
    }), [setAddOperator])

    const handleDeleteOperator = useCallback(async (id) => {
        try {
            await Delete(id, 'operator-management')
            SuccessNotif('Delete data operator success')
            setDeleteOperator(id)
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Delete operator failed')
        }
    }, [setDeleteOperator])

    const fetchOperator = useCallback(async () => {
        try {
            const operatorList = await Get('operator')
            setOperator(operatorList)
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetchOperator()

    }, [fetchOperator])


    const columnOperator = useMemo(() => [
        {
            name: 'Operator name',
            selector: row => row.name
        },
        {
            name: 'Total production',
            selector: row => `${row.numbers_of_production} times production`
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openEditOperator(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteOperator(row.id))}
            />
        },

    ], [openEditOperator, openConfirmDeleteData, handleDeleteOperator])

    return (
        <>
            <HeadSection>
                <ButtonAdd
                    onClick={openAddOperator}
                >
                    Operator
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnOperator}
                data={operator}

            />
        </>
    )

}

export default Operator


