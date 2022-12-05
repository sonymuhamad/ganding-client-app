import React, { useMemo, useRef } from "react";
import { Title, Divider } from "@mantine/core";

import BreadCrumb from '../BreadCrumb'

import { sectionStyle } from "../../styles";
import useScrollSpy from 'react-use-scrollspy'
import { BaseAside } from "../layout";

import { ProductList, ProcessType, ProductType } from "./product_components";



export default function Product() {

    const { classes } = sectionStyle()

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

    const links = useMemo(() => [
        {
            "label": "Products",
            "link": "#product",
            "order": 1
        },
        {
            "label": 'Product type',
            "link": '#product-type',
            'order': 1
        },
        {
            "label": 'Process type',
            "link": '#process-type',
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

    return (
        <>
            <BreadCrumb links={breadcrumb} />
            <BaseAside links={links} activeSection={activeSection} />

            <section id='product' className={classes.section} ref={sectionRefs[0]}  >

                <Title className={classes.title} >
                    <a href="#product" className={classes.a_href} >
                        Products
                    </a>
                </Title>

                <Divider my='md' />

                <ProductList />


            </section>

            <section id='product-type' className={classes.section} ref={sectionRefs[1]}  >
                <Title className={classes.title} >
                    <a href="#product-type" className={classes.a_href} >
                        Product type
                    </a>
                </Title>

                <Divider my='md' />

                <ProductType />

            </section>

            <section id='process-type' className={classes.section} ref={sectionRefs[2]}  >
                <Title className={classes.title} >
                    <a href="#process-type" className={classes.a_href} >
                        Process type
                    </a>
                </Title>

                <Divider my='md' />

                <ProcessType />

            </section>

        </>
    )

}


