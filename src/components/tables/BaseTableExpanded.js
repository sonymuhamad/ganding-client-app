import React from "react";
import { customTableStyle } from "../../services/External";
import DataTable from "react-data-table-component";

export default function BaseTableExpanded({ column, data, expandComponent, pagination = true }) {

    return (
        <>
            <DataTable
                customStyles={customTableStyle}
                columns={column}
                data={data}
                expandableRows
                expandableRowsComponent={expandComponent}
                highlightOnHover={true}
                pagination={pagination}

            />
        </>
    )

}


