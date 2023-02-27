import React, { useMemo } from "react"
import { BaseContent } from "../layout";

import { ProductList, ProcessType, ProductType } from "./product_components";



export default function Product() {


    const links = useMemo(() => [
        {
            "label": "Products",
            "link": "product",
            "order": 1
        },
        {
            "label": 'Product type',
            "link": 'product-type',
            'order': 1
        },
        {
            "label": 'Process type',
            "link": 'process-type',
            'order': 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/product',
            label: 'Product'
        }
    ]
        , [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <ProductList />
        },
        {
            description: '',
            component: <ProductType />
        },
        {
            description: '',
            component: <ProcessType />
        }
    ], [])


    return (
        <BaseContent links={links} contents={contents} breadcrumb={breadcrumb} />
    )

}


