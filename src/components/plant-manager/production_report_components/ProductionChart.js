import React, { useState, useEffect, useCallback } from "react";

import { useRequest } from "../../../hooks";
import { Months } from '../../../services'
import { LineChart } from '../../charts'

const ProductionChart = () => {

    const { GetAndExpiredTokenHandler } = useRequest()
    const [labels, setLabels] = useState([])
    const [dataGoodProduction, setDataGoodProduction] = useState([])
    const [dataNotGoodProduction, setDataNotGoodProduction] = useState([])


    const generateData = useCallback((data) => {

        let labels = []
        let dataGood = []
        let dataNotGood = []

        for (const each_data of data) {
            const { production_date, total_good_production, total_not_good_production } = each_data

            const date = production_date.split('-')

            labels.push(`${Months[date[1]]} ${date[0]}`)
            dataGood.push(total_good_production)
            dataNotGood.push(total_not_good_production)
        }

        setDataGoodProduction(dataGood)
        setDataNotGoodProduction(dataNotGood)
        setLabels(labels)

    }, [])


    useEffect(() => {

        GetAndExpiredTokenHandler('report-production').then(data => {
            generateData(data)
        })

    }, [generateData])


    return (
        <LineChart
            label={labels}
            dataset={[
                {
                    id: 1,
                    label: 'Good product',
                    data: dataGoodProduction
                },
                {
                    id: 2,
                    label: 'Not good product',
                    data: dataNotGoodProduction
                }
            ]}

            title='Monthly quantity production report'

        />
    )
}

export default ProductionChart
