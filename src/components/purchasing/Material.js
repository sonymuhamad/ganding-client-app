import React, { useMemo } from "react";
import { BaseContent } from '../layout'
import { MaterialList } from "./materials";

export default function Material() {

    const links = useMemo(() => [
        {
            "label": 'List of material',
            "link": 'material-list',
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
        }
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <MaterialList />
        }
    ], [])

    return (
        <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />
    )
}
