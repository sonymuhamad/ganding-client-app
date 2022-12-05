import React, { useMemo, useRef } from "react";

import { sectionStyle } from '../../styles'
import useScrollSpy from 'react-use-scrollspy'

import { BaseAside } from "../layout";
import BreadCrumb from "../BreadCrumb";
import { Title, Divider } from "@mantine/core";
import { PurchaseOrderList } from "./purchaseorders";


export default function PurchaseOrder() {

    const { classes } = sectionStyle()

    const links = useMemo(() => [
        {
            "label": 'List of purchase order',
            "link": '#purchase-order',
            'order': 1
        },
    ], [])

    const sectionRefs = [
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
            path: '/home/purchasing/purchase-order',
            label: 'Purchase order'
        }
    ], [])



    return (
        <>
            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            <section id='purchase-order' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#purchase-order" className={classes.a_href} >
                        Purchase order
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <PurchaseOrderList />

            </section>

        </>
    )
}
