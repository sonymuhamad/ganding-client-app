import React from "react";
import { customTableStyle } from "../../services/External";
import DataTable from "react-data-table-component";
import { Text } from "@mantine/core";

export default function BaseTableExpanded({ column, data, expandComponent, pagination = true, noData = 'There are no records to display', conditionalRowStyle = [], dense = false }) {

    return (
        <>
            <DataTable
                customStyles={customTableStyle}
                columns={column}
                data={data}
                expandableRows
                noDataComponent={<Text size='sm' color='dimmed'>{noData}</Text>}
                expandableRowsComponent={expandComponent}
                highlightOnHover={true}
                pagination={pagination}
                conditionalRowStyles={conditionalRowStyle}
                dense={dense}
            />
        </>
    )

}


