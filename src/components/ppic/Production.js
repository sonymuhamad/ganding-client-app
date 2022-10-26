import React, { useEffect, useRef, useContext, useState } from "react";
import useScrollSpy from 'react-use-scrollspy'

import { Title, Divider } from "@mantine/core";
import BaseAside from "../layout/BaseAside";
import BreadCrumb from "../BreadCrumb";
import { sectionStyle } from "../../styles/sectionStyle";
import Machine from "./production/Machine";
import Operator from "./production/Operator";
import ProductionReport from "./production/ProductionReport";
import ProductionPriority from "./production/ProductionPriority";

import { useRequest } from "../../hooks/useRequest";
import { AuthContext } from "../../context/AuthContext";

export default function Production() {

    const { classes } = sectionStyle()
    const { Get } = useRequest()
    const auth = useContext(AuthContext)

    const [customerProduct, setCustomerProduct] = useState([])
    const [machineList, setMachineList] = useState([])
    const [operatorList, setOperatorList] = useState([])
    const [actionProductionReport, setActionProductionReport] = useState(0)


    const sectionRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ]

    const activeSection = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -80
    })

    const links = [
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
            "label": 'Machine',
            "link": '#machine',
            'order': 1
        },
        {
            "label": 'Operator',
            "link": '#operator',
            'order': 1
        },
    ]

    const breadcrumb = [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/production',
            label: 'Production'
        }
    ]

    useEffect(() => {
        Get(auth.user.token, 'production-list').then(data => {
            const dataProduct = data.reduce((prev, current) => {
                const product = current.ppic_product_related.map(product => ({ ...product, group: current.name }))
                return [...prev, ...product]
            }, [])

            setCustomerProduct(dataProduct)
        })

        Get(auth.user.token, 'machine').then(data => {
            setMachineList(data)
        })

        Get(auth.user.token, 'operator').then(data => {
            setOperatorList(data)
        })
    }, [auth.user.token])


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

                <ProductionPriority setaction={setActionProductionReport} />

            </section>

            <section id='report' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#report" className={classes.a_href} >
                        Production report
                    </a>
                </Title>
                <Divider my='md'></Divider>
                <ProductionReport action={actionProductionReport} setaction={setActionProductionReport} machine={machineList} operator={operatorList} products={customerProduct} />
            </section>

            <section id='machine' className={classes.section} ref={sectionRefs[2]} >
                <Title className={classes.title} >
                    <a href="#machine" className={classes.a_href} >
                        Machine
                    </a>
                </Title>
                <Divider my='md'></Divider>
                <Machine />

            </section>

            <section id='operator' className={classes.section} ref={sectionRefs[3]} >
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
