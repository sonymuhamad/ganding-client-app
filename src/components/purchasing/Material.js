import React, { useRef, useMemo } from "react";
import { BaseAside } from '../layout'
import BreadCrumb from '../BreadCrumb'
import { sectionStyle } from '../../styles'
import useScrollSpy from 'react-use-scrollspy'

import { Title, Divider } from "@mantine/core";
import { MaterialList } from "./materials";

export default function Material() {


    const { classes } = sectionStyle()

    const links = useMemo(() => [
        {
            "label": 'List of material',
            "link": '#material-list',
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
            path: '/home/purchasing/material',
            label: 'Material'
        }
    ], [])


    return (
        <>

            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            <section id='material-list' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#material-list" className={classes.a_href} >
                        Material
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <MaterialList />

            </section>

        </>
    )
}
