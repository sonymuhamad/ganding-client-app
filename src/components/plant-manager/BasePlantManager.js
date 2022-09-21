import React, { useContext } from "react";
import { AuthContext } from '../../context/AuthContext'
import NavLinks from '../layout/NavLinks';
import BaseLayout from '../layout/BaseLayout';

import { IconUserCheck, IconReportAnalytics, IconCalendarEvent, IconReportMoney, IconGitPullRequestDraft, IconLayoutDashboard } from "@tabler/icons";
import { Outlet } from "react-router-dom";




export default function BasePlantManager() {

    const links = [

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
            label: 'Report',
            icon: <IconReportAnalytics stroke={2} size={20} />,
            nested: [
                {
                    label: 'Material Receipt',
                    icon: <IconCalendarEvent stroke={2} size={20} />,
                    activeLabel: 'Material Receipt',
                    url: '/home/plant-manager/report-material-receipt'
                },
                {
                    label: 'Sales Order',
                    icon: <IconReportMoney stroke={2} size={20} />,
                    activeLabel: 'Sales Order',
                    url: '/home/plant-manager/report-sales-order',
                },
                {
                    label: 'Mrp',
                    icon: <IconGitPullRequestDraft stroke={2} size={20} />,
                    activeLabel: 'Mrp',
                    url: '/home/plant-manager/report-mrp'
                }

            ]
        }
    ]


    return (

        <>
            <BaseLayout outlet={<Outlet />} navlink={<NavLinks links={links} />} />
        </>
    )


}


