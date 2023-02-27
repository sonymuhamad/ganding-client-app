import React, { useState, useEffect, useMemo } from "react";

import { BaseTable } from "../../tables";
import { useRequest } from "../../../hooks";

import { Badge } from "@mantine/core";

export function getPercentage(goods_percentage) {
    if (goods_percentage >= 90) {
        return 'blue'
    }
    if (goods_percentage < 75) {
        return 'red'
    }
    return 'yellow'
}


const OperatorList = () => {

    const { Get } = useRequest()
    const [operatorList, setOperatorList] = useState([])

    const columnOperator = useMemo(() => [
        {
            name: 'Operator',
            selector: row => row.name
        },
        {
            name: 'Do production',
            selector: row => `${row.times_do_production} times`
        },
        {
            name: 'Total goods produced',
            selector: row => `${row.total_goods_produced} unit `
        },
        {
            name: 'Average',
            selector: row => `${row.avg_production} unit`
        },
        {
            name: 'Production success rate',
            selector: row => {
                const { good_percentage } = row
                const color = getPercentage(good_percentage)
                return (
                    <Badge
                        variant='filled'
                        color={color}
                    >
                        {`${good_percentage} %`}
                    </Badge>
                )
            }
        }
    ], [])

    useEffect(() => {

        Get('report-operator').then(data => {
            setOperatorList(data)
        })

    }, [])


    return (
        <BaseTable
            column={columnOperator}
            data={operatorList}
            noData='No data operator'
        />
    )
}

export default OperatorList

