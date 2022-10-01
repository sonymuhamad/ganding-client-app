import React from "react";
import { customTableStyle } from "../../services/External";
import DataTable from "react-data-table-component";

export default function BaseTable({ column, data }) {

    return (
        <>
            <DataTable
                customStyles={customTableStyle}
                columns={[...column]}
                data={[...data]}
                highlightOnHover={true}
                pagination

            />
        </>
    )

}


