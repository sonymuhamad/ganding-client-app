import React, { useRef, useMemo } from "react";

import { BaseAside } from "../layout";
import BreadCrumb from '../BreadCrumb'
import { sectionStyle } from '../../styles'
import useScrollSpy from 'react-use-scrollspy'

import { Title, Divider } from "@mantine/core";
import { SupplierList } from './supplier'


export default function Suppliers() {


    const { classes } = sectionStyle()

    const links = useMemo(() => [
        {
            "label": 'List of supplier',
            "link": '#supplier-list',
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
            path: '/home/purchasing/suppliers',
            label: 'Suppliers'
        }
    ], [])


    return (
        <>

            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            <section id='supplier-list' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#supplier-list" className={classes.a_href} >
                        Supplier
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <SupplierList />

            </section>

        </>
    )
}
