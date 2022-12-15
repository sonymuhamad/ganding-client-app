import React, { useMemo } from "react";
import { BaseAside } from "../layout";
import { useSection } from "../../hooks";
import BreadCrumb from "../BreadCrumb";

import { Title, Divider } from "@mantine/core";
import { UserList, GroupList } from "./user_components";


export default function Users() {

    const { classes, activeSection, sectionRefs } = useSection()

    const links = useMemo(() => [
        {
            "label": 'User list',
            "link": '#user-list',
            'order': 1
        },
        {
            "label": "Division",
            "link": "#division",
            "order": 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/plant-manager',
            label: 'Manager'
        },
        {
            path: '/home/plant-manager/users',
            label: 'User'
        }
    ], [])

    return (
        <>
            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            <section id='user-list' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#user-list" className={classes.a_href} >
                        User list
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <UserList />

            </section>

            <section id='division' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#division" className={classes.a_href} >
                        Division
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <GroupList />

            </section>


        </>
    )

}
