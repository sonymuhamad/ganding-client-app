import React, { useMemo } from 'react'

import { IconLayoutDashboard, IconReportMoney, IconUsers, IconTruckDelivery, IconClipboardList, } from "@tabler/icons";
import { Outlet } from "react-router-dom";

import { NavLinks, BaseLayout } from '../layout'


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
                icon: <IconClipboardList stroke={2} size={20} />,
                url: '/home/marketing/sales-order'
            },
            {
                label: 'Delivery Note',
                activeLabel: 'Delivery Note',
                icon: <IconTruckDelivery stroke={2} size={20} />,
                url: '/home/marketing/delivery-note'
            },
            {
                label: 'Invoice',
                activeLabel: 'Invoice',
                icon: <IconReportMoney stroke={2} size={20} />,
                url: '/home/marketing/invoice'
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


