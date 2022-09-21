import React from "react";
import BaseLayout from "../layout/BaseLayout";
import NavLinks from "../layout/NavLinks";

import { IconLayoutDashboard, IconUsers, IconReport, IconCalendarEvent } from "@tabler/icons";
import { Outlet } from "react-router-dom";


export default function BasePurchasing() {

    const links = [
        {
            label: 'Dashboard',
            activeLabel: '',
            icon: <IconLayoutDashboard stroke={2} size={20} />,
            url: '/home/purchasing'
        },
        {
            label: 'Supplier',
            activeLabel: 'Supplier',
            icon: <IconUsers stroke={2} size={20} />,
            url: '/home/purchasing/suppliers'
        },
        {
            label: 'Purchase Order',
            activeLabel: 'Purchase Order',
            icon: <IconReport stroke={2} size={20} />,
            url: '/home/purchasing/purchase-order',
        },
        {
            label: 'Material Receipt Schedule',
            activeLabel: 'Material Receipt Schedule',
            icon: <IconCalendarEvent stroke={2} size={20} />,
            url: '/home/purchasing/material-receipt-schedule',
        },
    ]

    return (
        <>
            <BaseLayout outlet={<Outlet />} navlink={<NavLinks links={links} />} />
        </>
    )

}



