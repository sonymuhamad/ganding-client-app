import React, { useMemo, useCallback } from "react";
import { Group, Textarea } from "@mantine/core";
import { IconBarcode, IconClipboardList, IconCodeAsterix } from "@tabler/icons";

import ModalEditProductShipped from './ModalEditProductShipped'
import ModalAddProductShipped from './ModalAddProductShipped'
import { ButtonEdit, ButtonDelete, ButtonAdd, HeadSection } from '../../../custom_components'
import { BaseTableExpanded } from "../../../tables";
import { useConfirmDelete, useRequest } from "../../../../hooks";
import { openModal } from "@mantine/modals";
import { SuccessNotif, FailedNotif } from "../../../notifications";
import { ReadOnlyTextInput } from "../../../custom_components";

const ExpandedProductShipped = ({ data }) => {
    const { description, product_order } = data
    const { sales_order } = product_order
    const { product } = product_order
    const { code } = product

    return (
        <>
            <Group
                grow
                m='xs'
            >
                <ReadOnlyTextInput
                    icon={<IconBarcode />}
                    value={code}
                    label='Product number'
                />

                <ReadOnlyTextInput
                    icon={<IconCodeAsterix />}
                    value={sales_order.code}
                    label='Sales order number'
                />
            </Group>


            <Textarea
                icon={<IconClipboardList />}
                value={description}
                readOnly
                variant='filled'
                radius='md'
                m='xs'
            />

        </>
    )
}



export default function SectionProductShipped(
    { productShippedList,
        setAddProductShipped,
        setEditProductShipped,
        setDeleteProductShipped,
        idDeliveryNote,
    }
) {
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Product shipped' })
    const { Delete } = useRequest()
    const handleDeleteProductShipped = useCallback(async (id) => {
        try {
            await Delete(id, 'deliveries/products-shipped/customer')
            setDeleteProductShipped(id)
            SuccessNotif('Delete product shipped success')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [setDeleteProductShipped])

    const openModalAddProductShipped = useCallback(() => openModal({
        title: 'Add product shipped',
        radius: 'md',
        size: 'xl',
        children: <ModalAddProductShipped
            idDeliveryNote={idDeliveryNote}
            setAddProductShipped={setAddProductShipped}
        />
    }), [setAddProductShipped, idDeliveryNote])

    const openModalEditProductShipped = useCallback((data) => openModal({
        title: 'Edit product shipped',
        radius: 'md',
        size: 'xl',
        children: <ModalEditProductShipped
            data={data}
            idDeliveryNote={idDeliveryNote}
            setEditProductShipped={setEditProductShipped}
        />

    }), [setEditProductShipped, idDeliveryNote])


    const columnProductShipped = useMemo(() => [
        {
            name: 'Product name',
            selector: row => {
                const { product_order } = row
                const { product } = product_order
                const { name } = product
                return name
            },
        },
        {
            name: 'Quantity',
            selector: row => `${row.quantity} pcs`
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openModalEditProductShipped(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteProductShipped(row.id))}
            />
        }
    ], [openConfirmDeleteData, openModalEditProductShipped, handleDeleteProductShipped])

    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openModalAddProductShipped}
                >
                    Product shipped
                </ButtonAdd>
            </HeadSection>

            <BaseTableExpanded
                column={columnProductShipped}
                data={productShippedList}
                expandComponent={ExpandedProductShipped}
                noData={'Tidak ada product yang dikirim'}
            />

        </>
    )
}
