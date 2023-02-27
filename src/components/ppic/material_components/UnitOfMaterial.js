import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TextInput } from "@mantine/core";
import { IconSignature } from "@tabler/icons";
import { openModal, closeAllModals } from "@mantine/modals";

import { useRequest, useConfirmDelete } from "../../../hooks";
import { BaseTable } from "../../tables";
import { FailedNotif, SuccessNotif } from '../../notifications'
import { ButtonEdit, ButtonAdd, ButtonDelete, HeadSection, ModalForm } from "../../custom_components";

const EditUnitOfMaterial = ({ uom, setEditUom }) => {

    const [name, setName] = useState(uom.name)
    const { Put } = useRequest()
    const [errorName, setErrorName] = useState(false)

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        try {
            const updatedUom = await Put(uom.id, { name: name }, 'uom-management')
            setEditUom(updatedUom)
            SuccessNotif('Edit unit of material success')
            closeAllModals()
        } catch (e) {
            if (e.message.data.name) {
                setErrorName(e.message.data.name)
            }
            FailedNotif('Edit unit of material failed')
        }
    }, [setEditUom, name, uom.id])

    return (
        <>
            <ModalForm
                formId='formEditUom'
                onSubmit={handleSubmit}   >

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

            </ModalForm>
        </>
    )
}

const PostUnitOfMaterial = ({ setAddUom }) => {
    const [name, setName] = useState('')
    const { Post } = useRequest()
    const [errorName, setErrorName] = useState(false)

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        try {
            const addedUom = await Post({ name: name }, 'uom-management')
            setAddUom(addedUom)
            SuccessNotif('Add unit of material success')
            closeAllModals()
        } catch (e) {
            if (e.message.data.name) {
                setErrorName(e.message.data.name)
            }
            FailedNotif('Add unit of material failed')
        }
    }
        , [setAddUom, name])



    return (
        <>

            <ModalForm
                formId='formAddUom'
                onSubmit={handleSubmit}  >

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

            </ModalForm>
        </>
    )
}

const UnitOfMaterial = () => {

    const { Get, Delete } = useRequest()
    const [uoms, setUoms] = useState([])
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Unit of material' })


    const setDeleteUom = useCallback((idDeletedUom) => {
        setUoms(prev => prev.filter(uom => uom.id !== idDeletedUom))
    }, [])

    const setAddUom = useCallback((newUom) => {
        setUoms(prev => [...prev, newUom])
    }, [])

    const setEditUom = useCallback((updatedUom) => {
        const { name, id } = updatedUom
        setUoms(prev => {
            return prev.map(uom => {
                if (uom.id === id) {
                    return { ...uom, name: name }
                }
                return uom
            })
        })

    }, [])

    const handleDeleteUom = useCallback(async (id) => {
        try {
            await Delete(id, 'uom-management')
            setDeleteUom(id)
            SuccessNotif('Delete unit of material success')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [setDeleteUom])

    const openEditUomModal = useCallback((uom) => openModal({
        title: `Edit unit of material`,
        radius: 'md',
        children: <EditUnitOfMaterial
            uom={uom}
            setEditUom={setEditUom} />,
    }), [setEditUom])

    const openPostUomModal = useCallback(() => openModal({
        title: `Add unit of material`,
        radius: 'md',
        children: <PostUnitOfMaterial
            setAddUom={setAddUom} />,
    }), [setAddUom])

    const fetchUom = useCallback(async () => {
        try {
            const uomList = await Get('uom-list')
            setUoms(uomList)
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetchUom()
    }, [fetchUom])

    const columnUoms = useMemo(() => [
        {
            name: 'Unit of material',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Amount of material',
            selector: row => row.materials ? row.materials : 0
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openEditUomModal(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteUom(row.id))}
            />
        }
    ], [openEditUomModal, openConfirmDeleteData, handleDeleteUom])


    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openPostUomModal}
                >
                    Unit of material
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnUoms}
                data={uoms}
                pagination={false}
            />
        </>
    )


}

export default UnitOfMaterial
