import React, { useState, useEffect, useCallback } from "react";

import { useRequest } from "../../../hooks";
import { LineChart } from '../../charts'
import { Months } from "../../../services";


const PurchaseOrderChart = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [labels, setLabels] = useState([])
    const [data, setData] = useState([])

    const generateData = useCallback((data = []) => {

        let labels = []
        let store_data = []

        for (const each_data of data) {

            const date = each_data.order_date.split('-')

            labels.push(`${Months[(parseInt(date[1]) - 1)]} ${date[0]}`)
            store_data.push(each_data.total_order)
        }

        setLabels(labels)
        setData(store_data)

    }, [])

    useEffect(() => {

        GetAndExpiredTokenHandler('report-purchase-order').then(data => {
            generateData(data)
        })

    }, [generateData])


    return (

        <LineChart
            label={labels}

            dataset={[
                {
                    id: 1,
                    label: 'Total material ordered',
                    data: data
                }
            ]}

            title='Total of material ordered each month'

        />

    )
}

export default PurchaseOrderChart

