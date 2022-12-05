import React, { useMemo, useRef } from "react";
import { Title, Divider } from "@mantine/core";
import { BaseAside } from '../layout'
import { sectionStyle } from "../../styles";
import useScrollSpy from 'react-use-scrollspy'

import BreadCrumb from "../BreadCrumb";
import { MaterialList, MaterialRequirementPlanning, UnitOfMaterial } from './material_components'


export default function Materials() {

    const { classes } = sectionStyle()

    const sectionRefs = [
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
            "label": "Materials",
            "link": "#material",
            "order": 1
        },
        {
            "label": 'Material requirement planning',
            "link": '#mrp',
            'order': 1
        },
        {
            "label": 'Unit of material',
            "link": '#uom',
            'order': 1
        },
    ], [])


    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/material',
            label: 'Material'
        }
    ], [])



    return (
        <>
            <BreadCrumb links={breadcrumb} />
            <BaseAside links={links} activeSection={activeSection} />

            <section id='material' className={classes.section} ref={sectionRefs[0]}  >
                <Title className={classes.title} >
                    <a href="#material" className={classes.a_href} >
                        Materials
                    </a>
                </Title>

                <Divider my='md' />
                <MaterialList />

            </section>


            <section id='mrp' className={classes.section} ref={sectionRefs[1]}  >
                <Title className={classes.title} >
                    <a href="#mrp" className={classes.a_href} >
                        Material requirement planning
                    </a>
                </Title>

                <Divider my='md' />

                <MaterialRequirementPlanning />

            </section>

            <section id='uom' className={classes.section} ref={sectionRefs[2]}  >
                <Title className={classes.title} >
                    <a href="#uom" className={classes.a_href} >
                        Unit of material
                    </a>
                </Title>

                <Divider my='md' />

                <UnitOfMaterial />

            </section>


        </>

    )
}









