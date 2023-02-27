import React, { useMemo } from "react"
import { UserList, GroupList } from "./user_components"
import { BaseContent } from "../layout"


export default function Users() {

    const links = useMemo(() => [
        {
            "label": 'User list',
            "link": 'user-list',
            'order': 1
        },
        {
            "label": "Division",
            "link": "division",
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

    const contents = useMemo(() => [
        {
            description: '',
            component: <UserList />,
        },
        {
            description: '',
            component: <GroupList />
        }
    ], [])

    return (
        <>

            <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />

        </>
    )

}
