import React, { useMemo, useRef } from "react";
import useScrollSpy from 'react-use-scrollspy'

import { Title, Divider } from "@mantine/core";
import BaseAside from "../layout/BaseAside";
import BreadCrumb from "../BreadCrumb";
import { sectionStyle } from "../../styles/sectionStyle";
import { Machine, Operator, ProductSubconstruction, ProductionPriority, ProductionReport, } from './production_components'

export default function Production() {

    const { classes } = sectionStyle()

    const sectionRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ]

    const activeSection = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -80
    })

    const links = useMemo(() => [
        {
            "label": 'Production priority',
            "link": '#production-priority',
            'order': 1
        },
        {
            "label": "Production report",
            "link": "#report",
            "order": 1
        },
        {
            "label": "Product in subconstruction",
            "link": "#product-subconstruction",
            "order": 1
        },
        {
            "label": 'Machine',
            "link": '#machine',
            'order': 1
        },
        {
            "label": 'Operator',
            "link": '#operator',
            'order': 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/production',
            label: 'Production'
        }
    ], [])



    return (
        <>
            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />


            <section id='production-priority' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#production-priority" className={classes.a_href} >
                        Production priority
                    </a>
                </Title>

                <p>
                    this section contains information about which products are prioritized for production, based on product orders
                </p>
                <Divider my='md'></Divider>

                <ProductionPriority />

            </section>

            <section id='report' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#report" className={classes.a_href} >
                        Production report
                    </a>
                </Title>
                <Divider my='md'></Divider>
                <ProductionReport />
            </section>

            <section id='product-subconstruction' className={classes.section} ref={sectionRefs[2]} >
                <Title className={classes.title} >
                    <a href="#product-subconstruction" className={classes.a_href} >
                        Product in subconstruction
                    </a>
                </Title>
                <Divider my='md'></Divider>

                <ProductSubconstruction />

            </section>

            <section id='machine' className={classes.section} ref={sectionRefs[3]} >
                <Title className={classes.title} >
                    <a href="#machine" className={classes.a_href} >
                        Machine
                    </a>
                </Title>
                <Divider my='md'></Divider>
                <Machine />

            </section>

            <section id='operator' className={classes.section} ref={sectionRefs[4]} >
                <Title className={classes.title} >
                    <a href="#operator" className={classes.a_href} >
                        Operator
                    </a>
                </Title>
                <Divider my='md' ></Divider>
                <Operator />

            </section>

        </>
    )
}
