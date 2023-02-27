import React from "react";
import { customTableStyle } from "../../services";
import DataTable from "react-data-table-component";
import { Text } from "@mantine/core";

export default function BaseTable({ column, data, pagination = true, conditionalRowStyle = [], dense = false, noData = 'There are no records to display', title = null }) {

    return (
        <>
            <DataTable
                customStyles={customTableStyle}
                columns={column}
                data={data}
                title={<Text align="center" size='sm' color='dimmed' > {title} </Text>}
                highlightOnHover={true}
                conditionalRowStyles={conditionalRowStyle}
                pagination={pagination}
                dense={dense}
                noDataComponent={<Text my='sm' size='sm' color='dimmed' > {noData} </Text>}
            />
        </>
    )

}


