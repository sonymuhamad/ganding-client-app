import React, { useState, useEffect, useMemo } from "react";

import { BaseTable } from "../../tables";
import { useRequest } from "../../../hooks";

import { Badge } from "@mantine/core";

import { getPercentage } from "./OperatorList";



const MachineList = () => {

    const { Get } = useRequest()
    const [machineList, setMachineList] = useState([])

    const columnMachine = useMemo(() => [
        {
            name: 'Machine',
            selector: row => row.name
        },
        {
            name: 'Used',
            selector: row => `${row.times_do_production} times`
        },
        {
            name: 'Total goods produced',
            selector: row => `${row.total_goods_produced} unit`
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

        Get('report-machine').then(data => {
            setMachineList(data)
        })

    }, [])


    return (
        <BaseTable
            column={columnMachine}
            data={machineList}
            noData="No data machine"
        />
    )
}

export default MachineList

