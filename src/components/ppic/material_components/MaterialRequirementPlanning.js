import React, { useState, useEffect, useMemo, useCallback } from "react"

import { useRequest, useConfirmDelete, useNotification } from "../../../hooks"
import { CustomSelectComponentDetailMrp } from "../../layout"

import { BaseTableExpanded, BaseTable } from "../../tables"

import { Paper, TextInput, Group, NumberInput, Divider, Text, Button, ActionIcon, Select, NativeSelect, Badge } from "@mantine/core"

import { IconPlus, IconZoomCheck, IconAsset, IconBuildingWarehouse, IconAssembly, IconBarcode, IconTrash, IconChecklist, IconClipboardList } from "@tabler/icons"

import { useForm } from "@mantine/form"
import { openModal, closeAllModals } from "@mantine/modals"
import { ButtonAdd, HeadSection, ButtonDelete, ButtonEdit, ModalForm } from "../../custom_components"


const ExpandedMrp = ({ data }) => {

    const columnDetailMrp = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.product.name,
            sortable: true
        },
        {
            name: 'Product number',
            selector: row => row.product.code
        },
        {
            name: 'Quantity',
            selector: row => `${row.quantity}  ${data.material.uom.name}`
        }
    ], [data.material.uom.name])


    return (
        <Paper
            mb='sm'
        >
            <TextInput
                radius='md'
                label='Material name'
                readOnly
                m='xs'
                icon={<IconAsset />}
                variant='filled'
                value={data.material.name}
            />

            <Group grow m='xs'>


                <TextInput
                    radius='md'
                    label='Spec material'
                    readOnly
                    icon={<IconZoomCheck />}
                    variant='filled'
                    value={data.material.spec}
                />

                <TextInput
                    radius='md'
                    label='Stock'
                    readOnly
                    icon={<IconBuildingWarehouse />}
                    variant='filled'
                    value={data.material.warehousematerial.quantity}
                    rightSection={<Text size='sm' color='dimmed' >
                        {data.material.uom.name}
                    </Text>}
                />

            </Group>

            <Divider m='xs' />

            {data.detailmrp_set.length > 0 &&

                <Text
                    align='center'
                    size='sm'
                    color='dimmed'
                    my='xs'
                >
                    Material will be allocated to
                </Text>
            }

            <BaseTable
                column={columnDetailMrp}
                pagination={false}
                noData="There is no allocation data for this request material"
                data={data.detailmrp_set}
            />
        </Paper>
    )
}


const AddMaterialRequest = ({ setAction }) => {

    const { successNotif, failedNotif } = useNotification()
    const { Post, Get } = useRequest()
    const [materialList, setMaterialList] = useState([])

    const form = useForm({
        initialValues: {
            id: '',
            material: null,
            quantity: '',
            detailmrp_set: []
        },
        validate: {
            detailmrp_set: {
                product: (value) => value === null ? 'This field is required' : null
            }
        }
    })

    const fetch = useCallback(async () => {
        try {
            const material = await Get('material-detail')
            setMaterialList(material)

        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetch()
    }, [fetch])

    const handleSubmit = useCallback(async (value) => {
        try {
            await Post(value, 'mrps-management')
            setAction()
            successNotif('Add material request success')
            closeAllModals()
        } catch (e) {
            failedNotif(e, 'Add material request failed')
        }
    }, [setAction, successNotif, failedNotif])

    const dataProduct = useMemo(() => {
        if (form.values.material !== null) {
            const selectedMaterial = materialList.find(material => material.id === parseInt(form.values.material))
            const { ppic_requirementmaterial_related } = selectedMaterial

            return ppic_requirementmaterial_related.map(reqMaterial => ({ value: reqMaterial.process.product.id, label: reqMaterial.process.product.name, process: reqMaterial.process.process_name, order: reqMaterial.process.order }))
        }
        return []

    }, [form.values.material, materialList])

    const detailmrp = useMemo(() => {
        return form.values.detailmrp_set.map((mrp, index) => (
            <Paper m='xs' p='xs' radius='md' shadow='xs' key={index + 2}  >

                <Group position="right" >

                    <ActionIcon
                        color="red"
                        mt='lg'
                        onClick={() => {
                            form.removeListItem(`detailmrp_set`, index)
                        }}
                    >
                        <IconTrash />
                    </ActionIcon>
                </Group>

                <Group grow m='xs' >

                    <Select
                        icon={<IconBarcode />}
                        itemComponent={CustomSelectComponentDetailMrp}
                        label='product'
                        radius='md'
                        required
                        placeholder="Select product"
                        data={dataProduct}
                        {...form.getInputProps(`detailmrp_set.${index}.product`)}
                    />
                </Group>



                <NumberInput
                    min={0}
                    m='xs'
                    icon={<IconAssembly />}
                    hideControls
                    label='Quantity required for this product'
                    radius='md'
                    required
                    placeholder="Quantity material required for this product"
                    {...form.getInputProps(`detailmrp_set.${index}.quantity`)}
                />

                <NumberInput
                    min={0}
                    m='xs'
                    icon={<IconChecklist />}
                    hideControls
                    label='Quantity production planning'
                    radius='md'
                    required
                    placeholder="Input quantity production planning"
                    {...form.getInputProps(`detailmrp_set.${index}.quantity_production`)}
                />


            </Paper>
        ))

    }, [form, dataProduct])

    return (
        <>

            <ModalForm
                formId='formRequestMaterial'
                onSubmit={form.onSubmit(handleSubmit)}  >

                <NativeSelect
                    icon={<IconAsset />}
                    label='Material'
                    placeholder="Select material"
                    data={materialList.map(material => ({ value: material.id, label: material.name }))}
                    radius='md'
                    required
                    {...form.getInputProps('material')}
                />

                <NumberInput
                    min={0}
                    hideControls
                    icon={<IconClipboardList />}
                    label='Quantity'
                    radius='md'
                    required
                    placeholder="input quantity"
                    {...form.getInputProps('quantity')}
                />
                <Divider m='xs' />

                <Text
                    align='center'
                    size='sm'
                    color='dimmed'
                >
                    Material will be allocated to
                </Text>

                {detailmrp}

                <Button
                    radius='md'
                    m='xs'
                    leftIcon={<IconPlus />}
                    onClick={() => {
                        form.insertListItem(`detailmrp_set`, {
                            product: null,
                            quantity: '',
                            quantity_production: '',
                        })
                    }}
                >
                    Product
                </Button>

            </ModalForm>
        </>
    )
}

const EditMaterialRequest = ({ mrp, setAction }) => {

    const { successNotif, failedNotif } = useNotification()
    const { Put, Get } = useRequest()
    const [materialList, setMaterialList] = useState([])

    const form = useForm({
        initialValues: {
            id: '',
            material: null,
            quantity: '',
            detailmrp_set: []
        },
        validate: {
            detailmrp_set: {
                product: (value) => value === null ? 'This field is required' : null
            }
        }
    })

    useEffect(() => {
        const fetch = async () => {
            try {
                const materialList = await Get('material-detail')
                setMaterialList(materialList)

                const { material, ...rest } = mrp
                form.setValues({ ...rest, material: material.id })

            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [Get, mrp])

    const handleSubmit = useCallback(async (value) => {

        try {
            await Put(value.id, value, 'mrps-management')
            setAction()
            successNotif('Edit material request success')
            closeAllModals()
        } catch (e) {
            failedNotif(e, 'Edit material request failed')
        }
    }, [setAction, successNotif, failedNotif])

    const detailmrp = useMemo(() => {

        return form.values.detailmrp_set.map((mrp, index) => (
            <Paper m='xs' p='xs' radius='md' shadow='xs' key={index}  >

                <Group position="right" >

                    <ActionIcon
                        color="red"
                        mt='lg'
                        onClick={() => {
                            form.removeListItem(`detailmrp_set`, index)
                        }}
                    >
                        <IconTrash />
                    </ActionIcon>
                </Group>

                <Group grow m='xs' >

                    <Select
                        icon={<IconBarcode />}
                        itemComponent={CustomSelectComponentDetailMrp}
                        label='product'
                        radius='md'
                        required
                        placeholder="Select product"
                        data={form.values.material !== null ? materialList.find(material => material.id === parseInt(form.values.material)).ppic_requirementmaterial_related.map(reqMaterial => ({ value: reqMaterial.process.product.id, label: reqMaterial.process.product.name, process: reqMaterial.process.process_name, order: reqMaterial.process.order })) : []}
                        {...form.getInputProps(`detailmrp_set.${index}.product`)}
                    />
                </Group>



                <NumberInput
                    min={0}
                    m='xs'
                    icon={<IconAssembly />}
                    hideControls
                    label='Quantity material required for this product'
                    radius='md'
                    required
                    placeholder="Input quantity material required"
                    {...form.getInputProps(`detailmrp_set.${index}.quantity`)}
                />

                <NumberInput
                    min={0}
                    m='xs'
                    icon={<IconChecklist />}
                    hideControls
                    label='Production quantity planning'
                    radius='md'
                    required
                    placeholder="Input production quantity planning "
                    {...form.getInputProps(`detailmrp_set.${index}.quantity_production`)}
                />


            </Paper>
        ))

    }, [form.values.detailmrp_set, form.values.material, materialList])

    return (
        <>

            <ModalForm
                formId='formRequestMaterial'
                onSubmit={form.onSubmit(handleSubmit)}  >

                <NativeSelect
                    icon={<IconAsset />}
                    label='Material'
                    placeholder="Select material"
                    data={materialList.map(material => ({ value: material.id, label: material.name }))}
                    radius='md'
                    required
                    {...form.getInputProps('material')}
                />

                <NumberInput
                    hideControls
                    min={0}
                    icon={<IconClipboardList />}
                    label='Quantity'
                    radius='md'
                    required
                    placeholder="input quantity"
                    {...form.getInputProps('quantity')}
                />
                <Divider m='xs' />

                <Text
                    align='center'
                    size='sm'
                    color='dimmed'
                >
                    Material will be allocated to
                </Text>

                {detailmrp}

                <Button
                    radius='md'
                    m='xs'
                    leftIcon={<IconPlus />}
                    onClick={() => {
                        form.insertListItem(`detailmrp_set`, {
                            product: null,
                            quantity: '',
                            quantity_production: '',
                        })
                    }}
                >
                    Product
                </Button>

            </ModalForm>
        </>
    )

}



const MaterialRequirementPlanning = () => {

    const { Get, Delete } = useRequest()
    const { successNotif, failedNotif } = useNotification()
    const [mrpAction, setMrpAction] = useState(0)
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Mrp' })
    const [mrp, setMrp] = useState([])

    const setAction = useCallback(() => {
        setMrpAction(prev => prev + 1)
    }, [])

    const handleDeleteMrp = useCallback(async (id) => {
        try {
            await Delete(id, 'mrps-management')
            setAction()
            successNotif('Delete material request success')
        } catch (e) {
            failedNotif(e, 'Delete material request failed')
        }
    }, [setAction, successNotif, failedNotif])

    const openEditMrpModal = useCallback((mrp) => openModal({
        title: 'Edit material request',
        size: 'xl',
        radius: 'md',
        children: <EditMaterialRequest mrp={mrp} setAction={setAction} />
    }), [setAction])

    const openPostMrpModal = useCallback(() => openModal({
        title: 'Add material request',
        size: 'xl',
        radius: 'md',
        children: <AddMaterialRequest setAction={setAction} />
    }), [setAction])

    const fetchMrp = useCallback(async () => {
        try {

            const mrpList = await Get('mrps')
            setMrp(mrpList)
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        // effect for mrp and mrp recommendations
        fetchMrp()

    }, [fetchMrp, mrpAction])

    const columnMrp = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.material.name,
            sortable: true
        },
        {
            name: 'Quantity needed',
            selector: row => `${row.quantity} ${row.material.uom.name}`
        },
        {
            name: 'Request type',
            selector: row => row.id ? <Badge
                variant='filled'
                color='teal.6'
            >Additional</Badge> : <Badge
                color='blue.6'
                variant='filled'
            >Production</Badge>
        },
        {
            name: '',
            selector: row => row.id ? <ButtonEdit
                onClick={() => openEditMrpModal(row)}
            /> : null,
        },
        {
            name: '',
            selector: row => row.id ? <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteMrp(row.id))}
            /> : null,
        }
    ], [openConfirmDeleteData, handleDeleteMrp, openEditMrpModal])


    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openPostMrpModal}
                >
                    Mrp
                </ButtonAdd>
            </HeadSection>

            <BaseTableExpanded
                column={columnMrp}
                data={mrp}
                expandComponent={ExpandedMrp}

            />

        </>
    )
}

export default MaterialRequirementPlanning
