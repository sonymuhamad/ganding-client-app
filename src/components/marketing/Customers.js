import React, { useMemo } from 'react'

import { BaseContent } from '../layout'
import { CustomerList } from './customer_components'

const Customers = () => {

    const breadcrumb = useMemo(() => [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/customers',
            label: 'Customers'
        }
    ], [])


    const links = useMemo(() => [
        {
            "label": "Customer list",
            "link": "customer",
            "order": 1
        },
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <CustomerList />
        }
    ], [])

    return (
        <BaseContent
            contents={contents}
            links={links}
            breadcrumb={breadcrumb}
        />
    )



}


export default Customers







