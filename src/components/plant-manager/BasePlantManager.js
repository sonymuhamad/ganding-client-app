import React, { useMemo } from "react";
import { NavLinks, BaseLayout } from '../layout'

import { IconUserCheck, IconReportAnalytics, IconLayoutDashboard, IconClipboardList, IconClipboardCheck } from "@tabler/icons";
import { Outlet } from "react-router-dom";




export default function BasePlantManager() {

    const links = useMemo(() => [

        {
            label: 'Dashboard',
            icon: <IconLayoutDashboard stroke={2} size={20} />,
            activeLabel: '',
            url: '/home/plant-manager'
        },
        {
            label: 'User',
            icon: <IconUserCheck stroke={2} size={20} />,
            activeLabel: 'User',
            url: '/home/plant-manager/users',
        },
        {
            label: 'Purchase report',
            icon: <IconClipboardCheck stroke={2} size={20} />,
            activeLabel: 'Purchase report',
            url: '/home/plant-manager/purchase-report'
        },
        {
            label: 'Sales report',
            icon: <IconReportAnalytics stroke={2} size={20} />,
            activeLabel: 'Sales report',
            url: '/home/plant-manager/sales-report',
        },
        {
            label: 'Production report',
            icon: <IconClipboardList stroke={2} size={20} />,
            activeLabel: 'Production report',
            url: '/home/plant-manager/production-report'
        }
    ], [])


    return (

        <>
            <BaseLayout navlink={<NavLinks links={links} />} >
                <Outlet />
            </BaseLayout>
        </>
    )


}


