import React, { useMemo } from "react";

import { BaseAside } from "../layout";
import { Title, Divider } from "@mantine/core";
import { useSection } from "../../hooks";
import BreadCrumb from "../BreadCrumb";
import { MaterialChart, MaterialReceived, MaterialRequest } from './dashboard_components'

export default function PurchasingDashboard() {

    const { sectionRefs, activeSection, classes } = useSection()
    const breadcrumb = useMemo(() => [
        {
            path: '/home/purchasing',
            label: 'Purchasing'
        }
    ], [])


    const links = useMemo(() => [
        {
            "label": "Request material",
            "link": "#request-material",
            "order": 1
        },
        {
            "label": "Charts of material usage and orders",
            "link": "#material-chart",
            "order": 1
        },
        {
            "label": "Material received",
            "link": "#material-receipt",
            "order": 1
        }
    ], [])


    return (
        <>

            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            <section id='request-material' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#request-material" className={classes.a_href} >
                        List of material request
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <MaterialRequest />

            </section>

            <section id='material-chart' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#material-chart" className={classes.a_href} >
                        Charts of material usage and orders
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <MaterialChart />

            </section>

            <section id='material-receipt' className={classes.section} ref={sectionRefs[2]} >
                <Title className={classes.title} >
                    <a href="#material-receipt" className={classes.a_href} >
                        List of material received
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <MaterialReceived />

            </section>



        </>
    )
}
