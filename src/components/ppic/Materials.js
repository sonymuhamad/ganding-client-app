import React, { useMemo } from "react"
import { MaterialList, MaterialRequirementPlanning, UnitOfMaterial } from './material_components'
import { BaseContent } from "../layout";


export default function Materials() {

    const links = useMemo(() => [
        {
            "label": "Materials",
            "link": "material",
            "order": 1
        },
        {
            "label": 'Material requirement planning',
            "link": 'mrp',
            'order': 1
        },
        {
            "label": 'Unit of material',
            "link": 'uom',
            'order': 1
        },
    ], [])


    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/material',
            label: 'Material'
        }
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <MaterialList />,
        },
        {
            description: '',
            component: <MaterialRequirementPlanning />,
        },
        {
            description: '',
            component: <UnitOfMaterial />
        }
    ], [])


    return (
        <BaseContent links={links} contents={contents} breadcrumb={breadcrumb} />
    )
}









