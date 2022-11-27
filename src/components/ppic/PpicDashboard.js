import React, { useRef, useMemo } from "react";
import { Title, Divider } from "@mantine/core";
import BaseAside from '../layout/BaseAside'
import BreadCrumb from '../BreadCrumb'
import { sectionStyle } from "../../styles/sectionStyle";
import useScrollSpy from 'react-use-scrollspy'

import ProductionChart from "./dashboard/ProductionChart";
import ProductOrderList from "./dashboard/ProductOrderList";
import MaterialOrderList from "./dashboard/MaterialOrderList";



export default function PpicDashboard() {


    const { classes } = sectionStyle()

    const links = useMemo(() => [
        {
            "label": 'Production chart',
            "link": '#production-chart',
            'order': 1
        },
        {
            "label": "List of product order",
            "link": "#product-order",
            "order": 1
        },
        {
            "label": 'Purchase of material list',
            "link": '#material-purchase',
            'order': 1
        },
    ], [])

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

    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        }
    ], [])

    return (
        <>


            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />


            <section id='production-chart' className={classes.section} ref={sectionRefs[0]}  >
                <Title className={classes.title} >
                    <a href="#production-chart" className={classes.a_href} >
                        Production chart
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <ProductionChart />


            </section>

            <section id='product-order' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#product-order" className={classes.a_href} >
                        Product ordered
                    </a>
                </Title>

                <Divider my='md'></Divider>


                <ProductOrderList />

            </section>

            <section id='material-purchase' className={classes.section} ref={sectionRefs[2]} >
                <Title className={classes.title} >
                    <a href="#material-purchase" className={classes.a_href} >
                        Purchase of materials
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <MaterialOrderList />

            </section>

        </>
    )
}


