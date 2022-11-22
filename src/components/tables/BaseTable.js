import React from "react";
import { customTableStyle } from "../../services/External";
import DataTable from "react-data-table-component";
import { Text } from "@mantine/core";

export default function BaseTable({ column, data, pagination = true, conditionalRowStyle = [], dense = false, noData = 'There are no records to display' }) {

    return (
        <>
            <DataTable
                customStyles={customTableStyle}
                columns={column}
                data={data}
                highlightOnHover={true}
                conditionalRowStyles={conditionalRowStyle}
                pagination={pagination}
                dense={dense}
                noDataComponent={<Text my='sm' size='sm' color='dimmed' > {noData} </Text>}
            />
        </>
    )

}


