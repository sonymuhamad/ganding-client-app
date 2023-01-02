import React, { useState, useEffect, useMemo, useCallback } from "react"

import { useRequest } from "../../../hooks"
import { CustomSelectComponentDetailMrp } from "../../layout"

import { BaseTableExpanded, BaseTable } from "../../tables"
import { SuccessNotif, FailedNotif } from "../../notifications"

import { Paper, TextInput, Group, NumberInput, Divider, Text, Button, ActionIcon, Select, NativeSelect, Badge } from "@mantine/core"

import { IconPlus, IconZoomCheck, IconAsset, IconBuildingWarehouse, IconAssembly, IconBarcode, IconTrash, IconChecklist, IconEdit, IconClipboardList, IconDownload } from "@tabler/icons"

import { useForm } from "@mantine/form"
import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals"



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
        <Paper m='xs' p='xs' >

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
                    value={data.material.warehousematerial}
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
                dense={true}
                column={columnDetailMrp}
                pagination={false}
                noData="There is no allocation data for this request material"
                data={data.detailmrp_set}
            />
        </Paper>
    )
}


const PostMaterialRequest = ({ setaction }) => {

    const { Post, Get, Loading } = useRequest()
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
            const material = await Get('material-lists')
            setMaterialList(material)

        } catch (e) {
            console.log(e)
        }
    }, [Get])

    useEffect(() => {
        fetch()
    }, [fetch])

    const handleSubmit = useCallback(async (value) => {
        try {
            await Post(value, 'mrp-management')
            SuccessNotif('Add request material success')
            setaction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            console.log(e)
            if (e.message.data.detailmrp_set) {
                FailedNotif(e.message.data.detailmrp_set)
            } else {
                FailedNotif('Add request material failed')
            }
        }
    }, [Post, setaction])

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

    }, [form, materialList])

    return (
        <>
            <Loading />
            <form id='formRequestMaterial' onSubmit={form.onSubmit(handleSubmit)}  >

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

                <Button
                    radius='md'
                    my='md'
                    form="formRequestMaterial"
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

const SendMaterialRequest = ({ mrp, setaction }) => {

    const { Put, Get, Loading } = useRequest()
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
                const materialList = await Get('material-lists')
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
            await Put(value.id, value, 'mrp-management')
            SuccessNotif('Material request data change is successful')
            setaction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            console.log(e)
            FailedNotif('Failed to change material request data')
            FailedNotif(e.message.data.detailmrp_set)
        }
    }, [Put, setaction])

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
            <Loading />
            <form id='formRequestMaterial' onSubmit={form.onSubmit(handleSubmit)}  >

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

                <Button
                    radius='md'
                    my='md'
                    form="formRequestMaterial"
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



const MaterialRequirementPlanning = () => {

    const { Get, Delete } = useRequest()

    const [mrpAction, setMrpAction] = useState(0)
    const [mrp, setMrp] = useState([])
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
            selector: row => row.buttonEdit,
            style: {
                margin: 0,
                padding: 0
            }
        },
        {
            name: '',
            selector: row => row.buttonDelete,
            style: {
                margin: 0,
                padding: 0
            }
        }
    ], [])

    const handleDeleteMrp = useCallback(async (id) => {
        try {
            await Delete(id, 'mrp-management')
            setMrpAction(prev => prev + 1)
            SuccessNotif('Delete mrp success')
        } catch (e) {
            console.log(e)
            FailedNotif('Delete mrp failed')
        }
    }, [])


    const openEditMrpModal = useCallback((mrp) => openModal({
        title: 'Edit material request',
        size: 'xl',
        radius: 'md',
        children: <SendMaterialRequest mrp={mrp} setaction={setMrpAction} />
    }), [])

    const openPostMrpModal = useCallback(() => openModal({
        title: 'Add material request',
        size: 'xl',
        radius: 'md',
        children: <PostMaterialRequest setaction={setMrpAction} />
    }), [])


    const openDeleteMrp = useCallback((id) => openConfirmModal({
        title: `Delete material request`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteMrp(id)
    }), [handleDeleteMrp])


    const fetchMrp = useCallback(async () => {
        try {

            const mrps = await Get('mrp-details')
            const dataMrp = mrps.map(mrp => ({
                ...mrp, buttonEdit: mrp.id ?

                    <Button
                        leftIcon={<IconEdit stroke={2} size={16} />}
                        color='teal.6'
                        variant='subtle'
                        radius='md'
                        mx='xs'
                        onClick={() => openEditMrpModal(mrp)}
                    >
                        Edit
                    </Button> : null,
                buttonDelete: mrp.id ? <Button
                    leftIcon={<IconTrash stroke={2} size={16} />}
                    color='red.6'
                    variant='subtle'
                    radius='md'
                    onClick={() => openDeleteMrp(mrp.id)}
                >
                    Delete
                </Button> : null

            }))
            setMrp(dataMrp)
        } catch (e) {
            console.log(e)
        }
    }, [openEditMrpModal, openDeleteMrp])

    useEffect(() => {
        // effect for mrp and mrp recommendations
        fetchMrp()

    }, [mrpAction, fetchMrp])



    return (
        <>


            <Group position="right" >
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openPostMrpModal}
                >
                    Add mrp
                </Button>
            </Group>

            <BaseTableExpanded
                column={columnMrp}
                data={mrp}
                expandComponent={ExpandedMrp}

            />

        </>
    )
}

export default MaterialRequirementPlanning
