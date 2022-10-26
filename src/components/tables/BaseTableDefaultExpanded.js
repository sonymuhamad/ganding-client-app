import React from "react";
import { customTableStyle } from "../../services/External";
import DataTable from "react-data-table-component";

export default function BaseTableDefaultExpanded({ column, data, expandComponent, pagination = true, condition = row => row.id }) {

    return (
        <>
            <DataTable
                customStyles={customTableStyle}
                columns={[...column]}
                data={[...data]}
                expandableRows
                expandableRowExpanded={condition}
                expandableRowsComponent={expandComponent}
                highlightOnHover={true}
                pagination={pagination}

            />
        </>
    )

}


