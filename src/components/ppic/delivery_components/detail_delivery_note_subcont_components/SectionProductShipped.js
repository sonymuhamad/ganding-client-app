import React, { useCallback, useMemo, } from "react"
import { Group, Text, TextInput, Divider, UnstyledButton, Paper } from "@mantine/core"
import { IconTimeline, IconRegex, IconAsset, IconBarcode, IconPackgeImport, IconPackgeExport, IconSortAscending2, } from "@tabler/icons"
import { openModal } from "@mantine/modals"

import ModalEditProductSubcont from './ModalEditProductSubcont'
import ModalAddProductSubcont from './ModalAddProductSubcont'
import { BaseTable } from "../../../tables"
import { useConfirmDelete, useRequest } from "../../../../hooks"
import {
    HeadSection,
    ButtonAdd,
    ButtonDelete,
    ButtonEdit,
    ReadOnlyTextInput
} from '../../../custom_components'
import { BaseTableExpanded } from '../../../tables'
import { SuccessNotif, FailedNotif } from "../../../notifications"


const ExpandedDeliveryNoteSubcont = ({ data }) => {

    const columnMaterialUsed = useMemo(() => [
        {
            name: 'Material',
            selector: row => row.material.name
        },
        {
            name: 'Spec',
            selector: row => row.material.spec
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        }
    ], [])

    const columnProductUsed = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name
        },
        {
            name: 'Product number',
            selector: row => row.product.code
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        }
    ], [])

    return (
        <Paper
            p='xs'
            m='xs'
            withBorder
            radius='md'
        >
            <ReadOnlyTextInput
                m='xs'
                icon={<IconBarcode />}
                value={data.product.name}
                label='Product name'
            />

            <ReadOnlyTextInput
                m='xs'
                icon={<IconRegex />}
                value={data.product.code}
                label='Product number'
            />

            <Group grow m='xs' >
                <ReadOnlyTextInput
                    icon={<IconTimeline />}
                    value={data.process.process_name}
                    label='Process'
                />

                <ReadOnlyTextInput
                    label='Wip'
                    value={`Wip${data.process.order}`}
                    icon={<IconSortAscending2 />}
                />
            </Group>

            <Group grow m='xs' >

                <ReadOnlyTextInput
                    icon={<IconPackgeExport />}
                    value={data.quantity}
                    label='Quantity product shipped'
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}
                />

                <ReadOnlyTextInput
                    icon={<IconPackgeImport />}
                    value={data.received}
                    label='Quantity product received'
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}

                />

            </Group>

            <Divider m='md' />

            <UnstyledButton >
                <Group>
                    <IconAsset />
                    <div>
                        <Text size='sm' color='dimmed' >Material used in subconstruction</Text>
                    </div>
                </Group>
            </UnstyledButton>

            <BaseTable
                column={columnMaterialUsed}
                data={data.requirementmaterialsubcont_set}
                noData={" This product subcont do not use any material "}
            />

            <Divider m='md' />

            <UnstyledButton>
                <Group>
                    <IconBarcode />
                    <div>
                        <Text size='sm' color='dimmed' >Product assembly used in subconstruction</Text>
                    </div>
                </Group>
            </UnstyledButton>

            <BaseTable
                column={columnProductUsed}
                data={data.requirementproductsubcont_set}
                noData={" This product subcont do not use any product assembly "}
            />

        </ Paper >
    )
}

const SectionProductShipped = (
    { setAddProductShipped,
        setUpdateProductShipped,
        setDeleteProductShipped,
        productSubcontList,
        deliveryNoteSubcontId
    }
) => {

    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Product shipped' })
    const { Delete } = useRequest()

    const openModalAddProductSubcont = useCallback(() => openModal({
        title: 'Add product subconstruction',
        radius: 'md',
        size: 'xl',
        children: <ModalAddProductSubcont
            setAddProductShipped={setAddProductShipped}
            deliveryNoteSubcontId={deliveryNoteSubcontId}
        />
    }), [setAddProductShipped, deliveryNoteSubcontId])

    const openModalEditProductSubcont = useCallback((data) => openModal({
        title: 'Edit product subconstruction',
        radius: 'md',
        size: 'xl',
        children: <ModalEditProductSubcont
            setUpdateProductShipped={setUpdateProductShipped}
            data={data} />

    }), [setUpdateProductShipped])

    const handleDeleteProductSubcont = useCallback(async (id) => {
        try {
            await Delete(id, 'product-delivery-subcont-management')
            SuccessNotif('Delete delivery product subconstruction success')
            setDeleteProductShipped(id)
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [setDeleteProductShipped])

    const columnProductSubcontShipped = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.product.name
        },
        {
            name: 'Quantity shipped',
            selector: row => `${row.quantity}  Pcs`
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openModalEditProductSubcont(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteProductSubcont(row.id))}
            />
        },
    ], [openModalEditProductSubcont, openConfirmDeleteData, handleDeleteProductSubcont])


    return (
        <>
            <HeadSection>
                <ButtonAdd
                    onClick={openModalAddProductSubcont}
                >
                    Product shipped
                </ButtonAdd>
            </HeadSection>

            <BaseTableExpanded
                data={productSubcontList}
                column={columnProductSubcontShipped}
                expandComponent={ExpandedDeliveryNoteSubcont}
                noData="This delivery note subconstruction doesn't have any product shipped "
            />



        </>
    )
}

export default SectionProductShipped