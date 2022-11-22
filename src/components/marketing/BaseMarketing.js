import React, { useMemo } from 'react'

import { IconLayoutDashboard, IconClipboardText, IconReportMoney, IconUsers, } from "@tabler/icons";
import { Outlet } from "react-router-dom";

import NavLinks from '../layout/NavLinks';
import BaseLayout from '../layout/BaseLayout';


const BaseMarketing = () => {


    const links = useMemo(() => {
        return [
            {
                label: 'Dashboard',
                activeLabel: '',
                icon: <IconLayoutDashboard stroke={2} size={20} />,
                url: '/home/marketing'
            },
            {
                label: 'Customers',
                activeLabel: 'Customers',
                icon: <IconUsers stroke={2} size={20} />,
                url: '/home/marketing/customers'
            },
            {
                label: 'Sales Order',
                activeLabel: 'Sales Order',
                icon: <IconReportMoney stroke={2} size={20} />,
                url: '/home/marketing/sales-order'
            },
            {
                label: 'Delivery Note',
                activeLabel: 'Delivery Note',
                icon: <IconClipboardText stroke={2} size={20} />,
                url: '/home/marketing/delivery-note'
            },
        ]
    }, [])



    return (
        <>
            <BaseLayout
                outlet={<Outlet links={links} />}
                navlink={<NavLinks links={links} />}
            />

        </>
    )
}


export default BaseMarketing


