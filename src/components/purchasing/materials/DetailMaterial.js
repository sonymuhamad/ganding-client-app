import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useRequest } from '../../../hooks'
import BreadCrumb from "../../BreadCrumb";
import { BaseAside } from "../../layout";
import useScrollSpy from 'react-use-scrollspy'
import { Title, Divider, TextInput, Image, Group, Paper } from "@mantine/core"
import { sectionStyle } from '../../../styles'
import { BaseTable } from '../../tables'
import { IconAsset, IconPerspective, IconScale, IconRuler2, IconRulerMeasure, IconDimensions, IconAtom2, IconBuildingWarehouse, IconUserCheck } from "@tabler/icons";

import { Months } from "../../../services";
import { LineChart } from "../../charts";



const DetailMaterial = () => {

    const { materialId } = useParams()
    const { classes } = sectionStyle()

    const links = useMemo(() => [
        {
            "label": 'Detail material',
            "link": '#detail-material',
            'order': 1
        },
        {
            "label": 'Chart of material usage and order',
            "link": '#chart-material',
            'order': 1
        },
        {
            "label": 'Usage material in production',
            "link": '#production-list',
            'order': 1
        },
    ], [])

    const sectionRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
    ]

    const activeSection = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -80
    })

    const breadcrumb = useMemo(() => [
        {
            path: '/home/purchasing',
            label: 'Purchasing'
        },
        {
            path: '/home/purchasing/material',
            label: 'Material'
        },
        {
            path: `/home/purchasing/material/${materialId}`,
            label: 'Detail material'
        },
    ], [materialId])

    const { Retrieve, Loading, RetrieveWithoutExpiredTokenHandler } = useRequest()
    const [requirementMaterialList, setRequirementMaterialList] = useState([])
    const [orderDataSet, setOrderDataSet] = useState([])
    const [usageDataSet, setUsageDataSet] = useState([])
    const [labels, setLabels] = useState([])
    const [detailMaterial, setDetailMaterial] = useState({
        id: '',
        name: '',
        length: '',
        image: '',
        spec: '',
        created: '',
        last_update: '',
        supplier: {
            name: '',
        },
        thickness: '',
        uom: {
            id: '',
            name: ''
        },
        warehousematerial: {
            quantity: ''
        },
        weight: '',
        width: ''
    })

    const columnRequirementMaterial = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.process.product.name,
            sortable: true
        },
        {
            name: 'Process name',
            selector: row => row.process.process_name,
            sortable: true,
        },
        {
            name: 'Process type',
            selector: row => row.process.process_type.name,

        },
        {
            name: 'Usage',
            selector: row => row.input,

        },
        {
            name: 'Output',
            selector: row => row.output,

        },
    ], [])


    useEffect(() => {
        Retrieve(materialId, 'material-list').then(data => {
            const { ppic_requirementmaterial_related, ...rest } = data
            setRequirementMaterialList(ppic_requirementmaterial_related)
            setDetailMaterial(rest)
        })

        RetrieveWithoutExpiredTokenHandler(materialId, 'report-material-usage-and-order').then(data => {
            let labels = []
            let firstDataSet = []
            let secondDataSet = []

            for (const material of data) {
                const date = material.date.split('-')
                labels.push(`${Months[parseInt(date[1]) - 1]} ${date[0]}`)
                firstDataSet.push(material.total_order)
                secondDataSet.push(material.total_usage)
            }


            setOrderDataSet(firstDataSet)
            setUsageDataSet(secondDataSet)
            setLabels(labels)

        })
    }, [])

    return (
        <>


            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />
            <Loading />

            <section id='detail-material' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#detail-material" className={classes.a_href} >
                        Detail material
                    </a>
                </Title>

                <Divider my='md'></Divider>


                <TextInput
                    variant='filled'
                    icon={<IconUserCheck />}
                    label='Supplier'
                    radius='md'
                    readOnly
                    value={detailMaterial.supplier.name}
                />

                <TextInput
                    variant='filled'
                    icon={<IconAsset />}
                    label='Material name'
                    my='xs'
                    readOnly
                    placeholder="Input material name"
                    radius='md'
                    value={detailMaterial.name}
                />

                <Group mb='xs' grow >
                    <TextInput
                        variant='filled'
                        icon={<IconPerspective />}
                        readOnly
                        label='Material specification'
                        radius='md'
                        value={detailMaterial.spec}
                        placeholder="Input material specification"
                    />


                    <TextInput
                        variant='filled'
                        icon={<IconAtom2 />}
                        label='Unit of material'
                        readOnly
                        radius='md'
                        placeholder="select an unit of material"
                        value={detailMaterial.uom.name}
                    />

                    <TextInput
                        variant='filled'
                        icon={<IconBuildingWarehouse />}
                        label='Stock in warehouse'
                        radius='md'
                        value={detailMaterial.warehousematerial.quantity}
                        readOnly
                    />


                </Group>

                <Group grow >

                    <TextInput
                        variant='filled'
                        icon={<IconRuler2 />}
                        value={detailMaterial.length}
                        label='Length'
                        readOnly
                        radius='md'
                        placeholder="length of material"
                    />

                    <TextInput
                        variant='filled'
                        icon={<IconDimensions />}
                        label='Width'
                        readOnly
                        value={detailMaterial.width}
                        placeholder="width of material"
                        radius='md'
                    />

                    <TextInput
                        variant='filled'
                        icon={<IconRulerMeasure />}
                        label='Thickness'
                        readOnly
                        value={detailMaterial.thickness}
                        placeholder="thickness of material"
                        radius='md'
                    />
                    <TextInput
                        variant='filled'
                        icon={<IconScale />}
                        label='Kg/pcs'
                        readOnly
                        value={detailMaterial.weight}
                        placeholder="weight of material"
                        radius='md'
                    />
                </Group>


                <Group my='lg' >
                    <Paper>
                        <Image
                            radius='md'
                            src={detailMaterial.image}
                            alt='product image'
                            withPlaceholder
                        />
                    </Paper>

                </Group>

            </section>

            <section id='chart-material' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#chart-material" className={classes.a_href} >
                        Chart of material usage and order
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <LineChart label={labels} dataset={[
                    {
                        id: 1,
                        label: 'Amount of material ordered',
                        data: orderDataSet,
                    },
                    {
                        id: 2,
                        label: 'Amount of material used',
                        data: usageDataSet,
                    },
                ]}
                    title='Monthly data on material usage and ordering'
                />

            </section>

            <section id='production-list' className={classes.section} ref={sectionRefs[2]} >
                <Title className={classes.title} >
                    <a href="#production-list" className={classes.a_href} >
                        Usage materials in production
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <BaseTable
                    column={columnRequirementMaterial}
                    data={requirementMaterialList}
                    noData="This material is not used at all in production"
                />


            </section>


        </>
    )

}

export default DetailMaterial
