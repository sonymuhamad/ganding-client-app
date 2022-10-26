import React, { useState, useEffect, useContext, useMemo } from "react";
import { SuccessNotif, FailedNotif } from "../../notifications/Notifications";
import { useRequest } from "../../../hooks/useRequest";
import { AuthContext } from "../../../context/AuthContext";
import BaseTableExpanded from "../../tables/BaseTableExpanded";
import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";

import { Button, Text, TextInput, NumberInput, Group, Paper, NativeSelect } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useForm } from "@mantine/form";




const ExpandedReportConversionMaterial = ({ data }) => {

    return (
        <Paper p='xs'  >
            <Group grow >
                <TextInput
                    label='From material'
                    value={data.material_input.name}
                    readOnly
                    radius='md'
                />

                <TextInput
                    label='Quantity'
                    value={data.quantity_input}
                    readOnly
                    radius='md'
                />
            </Group>

            <Group grow my='xs'  >
                <TextInput
                    label='To material'
                    value={data.material_output.name}
                    readOnly
                    radius='md'
                />

                <TextInput
                    label='Quantity'
                    value={data.quantity_output}
                    readOnly
                    radius='md'
                />
            </Group>

            <TextInput
                label='Created'
                readOnly
                value={new Date(data.created).toString()}
                radius='md'
            />

            <TextInput
                label='Last update'
                readOnly
                value={data.last_update === null ? '' : data.last_update}
                radius='md'
            />
        </Paper>
    )
}

const PostConvertMaterial = ({ setaction, basedConversion }) => {

    const { Get, Post } = useRequest()
    const [material, setMaterial] = useState([])
    const auth = useContext(AuthContext)


    const form = useForm({
        initialValues: {
            material_input: '',
            material_output: '',
            quantity_output: ''
        }
    })


    const openSubmit = (value) => {

        let text
        const data = basedConversion.find(base => base.material_input.id === parseInt(value.material_input) && base.material_output.id === parseInt(value.material_output))

        if (data) {
            const usedMaterial = (value.quantity_output / data.quantity_output) * data.quantity_input

            if (usedMaterial % 1 === 0) {
                text = ` ${usedMaterial} unit of ${data.material_input.name} will be converted to ${value.quantity_output} unit of ${data.material_output.name},`
            } else {

                text = ` ${Math.ceil(usedMaterial)} unit of ${data.material_input.name} will be converted to ${value.quantity_output} unit of ${data.material_output.name}, this conversion will leave a ${data.material_input.name} with an amount of ${(Math.round((Math.ceil(usedMaterial) - usedMaterial) * 100) / 100).toFixed(2)},`

            }
        } else {
            text = ''
        }

        return openConfirmModal({
            title: 'Convert material',
            children: (
                <>
                    <Text size="sm">
                        {text}
                    </Text>
                    <Text size='sm' >
                        Are you sure?, converted material cannot be returned.
                    </Text>
                </>
            ),
            radius: 'md',
            labels: { confirm: 'Yes, convert', cancel: "No, don't convert it" },
            cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
            confirmProps: { radius: 'md' },
            onConfirm: () => handleSubmit(value)
        })
    }


    const handleSubmit = async (value) => {
        try {
            await Post(value, auth.user.token, 'report-conversion-management')
            setaction(prev => prev + 1)
            closeAllModals()
            SuccessNotif('Convert material success')
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data.non_field_errors)
        }
    }

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const material = await Get(auth.user.token, 'material-lists')
                setMaterial(material)
            } catch (e) {
                console.log(e)
            }
        }
        fetchMaterial()

    }, [])

    return (
        <>
            <form onSubmit={form.onSubmit(openSubmit)}  >
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

                </Group>

                <Group grow my='lg' >
                    <NativeSelect
                        radius='md'
                        required
                        placeholder="Select material name"
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



const ConvertMaterial = ({ setaction, actions }) => {

    const auth = useContext(AuthContext)
    const { Get } = useRequest()
    const [conversionMaterialReport, setConversionMaterialReport] = useState([])
    const [basedConversionMaterial, setBasedConversionMaterial] = useState([])

    const columnConversionMaterialReport = useMemo(() => [
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
    ], [])

    const openPostConvertMaterial = () => openModal({
        title: 'Add Base conversion material',
        radius: 'md',
        size: 'xl',
        children: <PostConvertMaterial basedConversion={basedConversionMaterial} setaction={setaction} />
    })


    useEffect(() => {
        // effect for conversion material report and base

        const fetchConversionMaterial = async () => {
            try {
                const reportConversion = await Get(auth.user.token, 'report-conversion-detail')
                const basedConversion = await Get(auth.user.token, 'based-conversion-detail')
                setConversionMaterialReport(reportConversion)
                setBasedConversionMaterial(basedConversion)

            } catch (e) {
                console.log(e)
            }
        }

        fetchConversionMaterial()

    }, [auth.user.token, actions])

    return (
        <>
            <Group position="right" >
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openPostConvertMaterial}
                >
                    Convert material
                </Button>
            </Group>

            <BaseTableExpanded
                column={columnConversionMaterialReport}
                data={conversionMaterialReport}
                expandComponent={ExpandedReportConversionMaterial}
            />
        </>
    )
}

export default ConvertMaterial