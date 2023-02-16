import React, { useState, useEffect, } from "react";

import { useRequest } from "../../../hooks";
import { LineChart } from '../../charts'
import { Months } from "../../../services";


const ProductOrderChart = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [labels, setLabels] = useState([])
    const [data, setData] = useState([])

    useEffect(() => {

        const generateData = (data) => {
            let labels = []
            let dataset = []
            for (const each_data of data) {
                const { date, total_order } = each_data
                const [year, month] = date.split('-')

                labels.push(`${Months[parseInt(month) - 1]} ${year}`)
                dataset.push(total_order)
            }
            setData(dataset)
            setLabels(labels)
        }

        GetAndExpiredTokenHandler('report-product-order').then(data => {
            generateData(data)
        })
    }, [])

    return (
        <LineChart
            label={labels}
            dataset={[
                {
                    id: '',
                    label: 'Total order',
                    data: data
                }
            ]}

            title='The total number of products ordered each month'
        />
    )
}

export default ProductOrderChart