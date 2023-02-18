import React, { useMemo } from "react";
import { BaseTableExpanded } from "../../../tables";
import { ExpandedPurchaseOrder } from "../../../layout";
import { NavigationDetailButton } from "../../../custom_components";

const SectionPurchaseOrderList = (
    { purchaseOrderList }
) => {


    const columnPurchaseOrderList = useMemo(() => [
        {
            name: 'Po number',
            selector: row => row.code,
            sortable: true
        },
        {
            name: 'Date',
            selector: row => new Date(row.date).toDateString(),
            sortable: true
        },
        {
            name: 'Total ordered material',
            selector: row => row.materialorder_set.length
        },
        {
            name: '',
            selector: row => <NavigationDetailButton
                url={`/home/purchasing/purchase-order/${row.id}`}
            />
        }
    ], [])

    return (
        <>

            <BaseTableExpanded
                noData="This supplier doesn't have any purchase order"
                column={columnPurchaseOrderList}
                data={purchaseOrderList}
                expandComponent={ExpandedPurchaseOrder}
            />
        </>
    )
}
export default SectionPurchaseOrderList

