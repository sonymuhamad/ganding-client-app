import React, { useMemo } from "react";
import { BaseLayout, NavLinks } from "../layout";

import { IconLayoutDashboard, IconUsers, IconReport, IconAsset, IconTruckDelivery } from "@tabler/icons";
import { Outlet } from "react-router-dom";


export default function BasePurchasing() {

    const links = useMemo(() => [
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
            label: 'Material',
            activeLabel: 'Material',
            icon: <IconAsset stroke={2} size={20} />,
            url: '/home/purchasing/material',
        },
        {
            label: 'Purchase Order',
            activeLabel: 'Purchase Order',
            icon: <IconReport stroke={2} size={20} />,
            url: '/home/purchasing/purchase-order',
        },
        {
            label: 'Shipments and receipts',
            activeLabel: 'Shipments and receipts',
            icon: <IconTruckDelivery stroke={2} size={20} />,
            url: '/home/purchasing/shipments-and-receipts',
        },
    ], [])

    return (
        <>
            <BaseLayout navlink={<NavLinks links={links} />}>
                <Outlet />
            </BaseLayout>
        </>
    )

}



