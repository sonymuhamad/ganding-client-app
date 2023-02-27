import React, { useMemo } from "react";

import { BaseContent } from "../layout"
import { SupplierList } from './supplier'


export default function Suppliers() {

    const links = useMemo(() => [
        {
            "label": 'List of supplier',
            "link": 'supplier-list',
            'order': 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/purchasing',
            label: 'Purchasing'
        },
        {
            path: '/home/purchasing/suppliers',
            label: 'Suppliers'
        }
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <SupplierList />
        }
    ], [])

    return (
        <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />
    )
}
