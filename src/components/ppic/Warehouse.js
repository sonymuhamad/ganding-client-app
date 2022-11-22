import React, { useState, useRef, useMemo } from "react";

import { Title, Divider } from "@mantine/core";
import useScrollSpy from 'react-use-scrollspy'

import BaseAside from "../layout/BaseAside";
import BreadCrumb from "../BreadCrumb";
import { sectionStyle } from "../../styles/sectionStyle";

import RawMaterial from "./warehouse/RawMaterial";
import FinishGood from "./warehouse/FinishGood";
import Wip from "./warehouse/Wip";
import ConversionUom from "./warehouse/ConversionUom";
import BaseConversionMaterial from "./warehouse/BaseConversionMaterial";
import ConvertMaterial from "./warehouse/ConvertMaterial";
import MaterialReceipt from "./warehouse/MaterialReceipt";
import ReceiptSchedule from './warehouse/ReceiptSchedule'

import ReceiptNoteProductSubconstruction from "./warehouse/ReceiptNoteProductSubconstruction";
import ReceiptSubcontSchedule from "./warehouse/ReceiptSubcontSchedule";


export default function Warehouse() {

    const { classes } = sectionStyle()
    const [actionConvertMaterial, setActionConvertMaterial] = useState(0)

    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/warehouse',
            label: 'Warehouse'
        }
    ], [])

    const sectionRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
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
            "label": "Raw materials",
            "link": "#material-wh",
            "order": 1
        },
        {
            "label": 'Conversion unit of material ',
            "link": '#conversion-uom',
            'order': 2
        },
        {
            "label": 'Base conversion material',
            "link": '#base-conversion-material',
            'order': 2
        },
        {
            "label": 'Converted materials',
            "link": '#converted-materials',
            'order': 2
        },
        {
            label: 'Finished goods',
            link: "#product-wh",
            order: 1
        },
        {
            label: 'Product work in process',
            link: "#wip-wh",
            order: 2
        },
        {
            label: 'Material receipt note',
            link: '#material-receipt',
            order: 1
        },
        {
            label: 'Material receipt schedule',
            link: '#receipt-schedule',
            order: 1
        },
        {
            label: 'Product subconstruction receipt note',
            link: '#receipt-note-subcont',
            order: 1
        },
        {
            label: 'Product subconstruction receipt schedule',
            link: '#subcont-receipt-schedule',
            order: 1
        },
    ], [])

    return (
        <>
            <BreadCrumb links={breadcrumb} />
            <BaseAside links={links} activeSection={activeSection} />

            <section id='material-wh' className={classes.section} ref={sectionRefs[0]}   >
                <Title className={classes.title} >
                    <a href="#material-wh" className={classes.a_href} >
                        Raw materials
                    </a>
                </Title>

                <p>
                    This section contains information about stock of material based on its unit of material, and also access to edit stock
                </p>

                <Divider mb='md'></Divider>

                <RawMaterial actions={actionConvertMaterial} />

            </section>

            <section id='conversion-uom' className={classes.section} ref={sectionRefs[1]}   >
                <Title className={classes.title} >
                    <a href="#conversion-uom" className={classes.a_href} >
                        Conversion unit of material
                    </a>
                </Title>

                <Divider mb='md'></Divider>

                <ConversionUom />

            </section>

            <section id='base-conversion-material' className={classes.section} ref={sectionRefs[2]}   >
                <Title className={classes.title} >
                    <a href="#base-conversion-material" className={classes.a_href} >
                        Base conversion material
                    </a>
                </Title>
                <p>
                    This section contains data of conversion material that used as the basis to convert material in <a href="#converted-materials"  >Converted material </a>section
                </p>

                <Divider mb='md'></Divider>

                <BaseConversionMaterial />


            </section>

            <section id='converted-materials' className={classes.section} ref={sectionRefs[3]}   >
                <Title className={classes.title} >
                    <a href="#converted-materials" className={classes.a_href} >
                        Converted materials
                    </a>
                </Title>

                <p>
                    Reports of process transforming raw materials into another material
                </p>

                <Divider mb='md'></Divider>

                <ConvertMaterial actions={actionConvertMaterial} setaction={setActionConvertMaterial} />


            </section>


            <section id='product-wh' className={classes.section} ref={sectionRefs[4]}   >
                <Title className={classes.title} >
                    <a href="#product-wh" className={classes.a_href} >
                        Finished goods
                    </a>
                </Title>
                <p>
                    This section contains finished good stock of each product
                </p>

                <Divider mb='md'></Divider>

                <FinishGood />

            </section>


            <section id='wip-wh' className={classes.section} ref={sectionRefs[5]}   >
                <Title className={classes.title} >
                    <a href="#wip-wh" className={classes.a_href} >
                        Product work in process
                    </a>
                </Title>

                <Divider mb='md'></Divider>
                <Wip />

            </section>


            <section id='material-receipt' className={classes.section} ref={sectionRefs[6]}   >
                <Title className={classes.title} >
                    <a href="#material-receipt" className={classes.a_href} >
                        Material receipt
                    </a>
                </Title>

                <Divider mb='md'></Divider>

                <MaterialReceipt />

            </section>

            <section id='receipt-schedule' className={classes.section} ref={sectionRefs[7]}   >
                <Title className={classes.title} >
                    <a href="#receipt-schedule" className={classes.a_href} >
                        Receipt schedule
                    </a>
                </Title>

                <Divider mb='md'></Divider>

                <ReceiptSchedule />

            </section>

            <section id='receipt-note-subcont' className={classes.section} ref={sectionRefs[8]}   >
                <Title className={classes.title} >
                    <a href="#receipt-note-subcont" className={classes.a_href} >
                        Receipt note subconstruction
                    </a>
                </Title>

                <Divider mb='md'></Divider>

                <ReceiptNoteProductSubconstruction />

            </section>

            <section id='subcont-receipt-schedule' className={classes.section} ref={sectionRefs[9]}   >
                <Title className={classes.title} >
                    <a href="#subcont-receipt-schedule" className={classes.a_href} >
                        Product subconstruction receipt schedule
                    </a>
                </Title>

                <Divider mb='md'></Divider>

                <ReceiptSubcontSchedule />

            </section>

        </>
    )

}

