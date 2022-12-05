import React, { useMemo, useRef } from "react";
import { BaseAside } from "../layout";
import BreadCrumb from "../BreadCrumb";
import { sectionStyle } from "../../styles";
import useScrollSpy from 'react-use-scrollspy'
import { DeliveryNote, DeliveryNoteSubcont, DeliverySchedule, Driver, Vehicle } from "./delivery_components";

import { Title, Divider } from "@mantine/core";



export default function Delivery() {

    const { classes } = sectionStyle()

    const links = useMemo(() => [
        {
            "label": 'Delivery schedule',
            "link": '#delivery-schedule',
            'order': 1
        },
        {
            "label": "Delivery finished goods",
            "link": "#delivery-note",
            "order": 1
        },
        {
            "label": 'Delivery product subconstruction',
            "link": '#dn-subcont',
            'order': 1
        },
        {
            "label": 'Driver',
            "link": '#driver',
            'order': 1
        },
        {
            "label": 'Vehicle',
            "link": '#vehicle',
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
        },
        {
            path: '/home/ppic/delivery',
            label: 'Delivery'
        }
    ], [])


    return (
        <>

            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            <section id='delivery-schedule' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#delivery schedule" className={classes.a_href} >
                        Delivery schedule
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <DeliverySchedule />

            </section>

            <section id='delivery-note' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#delivery-note" className={classes.a_href} >
                        Delivery finished goods
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <DeliveryNote />

            </section>

            <section id='dn-subcont' className={classes.section} ref={sectionRefs[2]} >
                <Title className={classes.title} >
                    <a href="#dn-subcont" className={classes.a_href} >
                        Delivery product subconstruction
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <DeliveryNoteSubcont />

            </section>

            <section id='driver' className={classes.section} ref={sectionRefs[3]} >
                <Title className={classes.title} >
                    <a href="#driver" className={classes.a_href} >
                        Driver
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <Driver />

            </section>

            <section id='vehicle' className={classes.section} ref={sectionRefs[4]} >
                <Title className={classes.title} >
                    <a href="#vehicle" className={classes.a_href} >
                        Vehicle
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <Vehicle />

            </section>

        </>
    )
}
