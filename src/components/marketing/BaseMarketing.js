import React, { useContext, useState } from 'react'

import { IconLayoutDashboard, IconClipboardText, IconReportMoney, IconUsers, IconCalendarEvent, IconFileReport, } from "@tabler/icons";
import { Outlet, useLocation, Link } from "react-router-dom";


import { AuthContext } from '../../context/AuthContext'
import NavLinks from '../layout/NavLinks';
import BaseLayout from '../layout/BaseLayout';
import { Text, Breadcrumbs } from '@mantine/core';


const BaseMarketing = () => {

    const value = useContext(AuthContext)
    const location = useLocation()

    const links = [
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
        {
            label: 'Report',
            icon: <IconFileReport stroke={2} size={20} />,
            nested: [
                {

                    label: 'Delivery Schedule',
                    activeLabel: 'Delivery Schedule',
                    icon: <IconCalendarEvent stroke={2} size={20} />,
                    url: '/home/marketing/delivery-schedule'
                }
            ]
        }


    ]



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


