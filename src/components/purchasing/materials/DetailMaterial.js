import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useRequest } from '../../../hooks'
import { BaseContent } from "../../layout";
import { SectionMaterialCharts, SectionDetailMaterial, SectionMaterialUsage } from "./detail_material_components/";

const DetailMaterial = () => {

    const { materialId } = useParams()
    const { Retrieve } = useRequest()
    const [requirementMaterialList, setRequirementMaterialList] = useState([])
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

    useEffect(() => {
        Retrieve(materialId, 'material-list').then(data => {
            const { ppic_requirementmaterial_related, ...rest } = data
            setRequirementMaterialList(ppic_requirementmaterial_related)
            setDetailMaterial(rest)
        })

    }, [materialId])


    const links = useMemo(() => [
        {
            "label": 'Detail material',
            "link": 'detail-material',
            'order': 1
        },
        {
            "label": 'Chart of material usage and order',
            "link": 'chart-material',
            'order': 1
        },
        {
            "label": 'Usage material in production',
            "link": 'production-list',
            'order': 1
        },
    ], [])

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

    const contents = useMemo(() => [
        {
            description: '',
            component: <SectionDetailMaterial
                detailMaterial={detailMaterial}
            />
        },
        {
            description: '',
            component: <SectionMaterialCharts />
        },
        {
            description: '',
            component: <SectionMaterialUsage
                requirementMaterialList={requirementMaterialList}
            />
        }

    ], [requirementMaterialList, detailMaterial])

    return (
        <BaseContent
            links={links}
            contents={contents}
            breadcrumb={breadcrumb}
        />
    )

}

export default DetailMaterial
