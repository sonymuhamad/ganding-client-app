import React from "react";
import NavLinks from "../layout/NavLinks";
import BaseLayout from "../layout/BaseLayout";

import { Outlet } from "react-router-dom";
import { IconLayoutDashboard, IconAsset, IconBuildingWarehouse, IconBuildingFactory, IconBarcode, IconTruckDelivery } from "@tabler/icons";


export default function BasePpic() {

    const links = [
        {
            label: 'Dashboard',
            activeLabel: '',
            icon: <IconLayoutDashboard stroke={2} size={20} />,
            url: '/home/ppic'
        },
        {
            label: 'Product',
            activeLabel: 'Product',
            icon: <IconBarcode stroke={2} size={20} />,
            url: '/home/ppic/product'
        },
        {
            label: 'Material',
            activeLabel: 'Material',
            icon: <IconAsset stroke={2} size={20} />,
            url: '/home/ppic/material'
        },
        {
            label: 'Warehouse',
            activeLabel: 'Warehouse',
            icon: <IconBuildingWarehouse stroke={2} size={20} />,
            url: '/home/ppic/warehouse'
        },
        {
            label: 'Production',
            activeLabel: 'Production',
            icon: <IconBuildingFactory stroke={2} size={20} />,
            url: '/home/ppic/production'
        },
        {
            label: 'Delivery',
            activeLabel: 'Delivery',
            icon: <IconTruckDelivery stroke={2} size={20} />,
            url: '/home/ppic/delivery',
        },
    ]

    return (
        <>
            <BaseLayout outlet={<Outlet />} navlink={<NavLinks links={links} />} />
        </>
    )

}

