import React from "react";
import { customTableStyle } from "../../services/External";
import DataTable from "react-data-table-component";

export default function BaseTableDisableExpanded({ column, data, expandComponent, pagination = true, condition = row => row.id, disabled = null }) {

    return (
        <>
            <DataTable
                customStyles={customTableStyle}
                columns={column}
                data={data}
                expandableRows
                expandableRowDisabled={disabled}
                expandableRowExpanded={condition}
                expandableRowsComponent={expandComponent}
                highlightOnHover={true}
                pagination={pagination}

            />
        </>
    )

}


