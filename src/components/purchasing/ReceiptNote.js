import React, { useMemo } from "react";

import { SubcontReceiptNoteList, MaterialReceiptNoteList, DeliveryNoteSubcontList } from './receiptnote_components'


import { BaseAside } from "../layout";
import { Title, Divider } from "@mantine/core";
import { useSection } from "../../hooks";
import BreadCrumb from "../BreadCrumb";

const ReceiptNote = () => {

    const { sectionRefs, activeSection, classes } = useSection()
    const breadcrumb = useMemo(() => [
        {
            path: '/home/purchasing',
            label: 'Purchasing'
        },
        {
            path: '/home/purchasing/shipments-and-receipts',
            label: 'Shipments and receipts'
        }
    ], [])


    const links = useMemo(() => [
        {
            "label": "Material receipt notes",
            "link": "#material-receipt-note",
            "order": 1
        },
        {
            "label": "Product subcontstruction delivery notes",
            "link": "#delivery-note-subcont",
            "order": 1
        },
        {
            "label": "Product subcontstruction receipt notes",
            "link": "#receipt-note-subcont",
            "order": 1
        },

    ], [])


    return (
        <>


            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            <section id='material-receipt-note' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#material-receipt-note" className={classes.a_href} >
                        Material receipt notes
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <MaterialReceiptNoteList />


            </section>

            <section id='delivery-note-subcont' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#delivery-note-subcont" className={classes.a_href} >
                        Product subconstruction delivery notes
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <DeliveryNoteSubcontList />


            </section>

            <section id='receipt-note-subcont' className={classes.section} ref={sectionRefs[2]} >
                <Title className={classes.title} >
                    <a href="#receipt-note-subcont" className={classes.a_href} >
                        Product subcontstruction receipt notes
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <SubcontReceiptNoteList />


            </section>


        </>
    )
}

export default ReceiptNote
