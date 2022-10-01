import React from "react";
import { customTableStyle } from "../../services/External";
import DataTable from "react-data-table-component";

export default function BaseTableDefaultExpanded({ column, data, expandComponent }) {

    return (
        <>
            <DataTable
                customStyles={customTableStyle}
                columns={[...column]}
                data={[...data]}
                expandableRows
                expandableRowExpanded={row => row.id}
                expandableRowsComponent={expandComponent}
                highlightOnHover={true}
                pagination

            />
        </>
    )

}


