import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRequest, useConfirmDelete } from "../../../../hooks";
import { BaseTable } from "../../../tables";
import { useParams } from "react-router-dom";
import { ButtonEdit, ButtonAdd, ButtonDelete, HeadSection } from '../../../custom_components'

import { openModal } from "@mantine/modals";
import ModalAddReceiptSchedule from "./ModalAddReceiptSchedule";
import ModalEditReceiptSchedule from "./ModalEditReceiptSchedule";
import { SuccessNotif, FailedNotif } from "../../../notifications";


export default function SectionReceiptSchedule(
    { materialOrderList }
) {

    const { purchaseOrderId } = useParams()
    const [scheduleList, setScheduleList] = useState([])
    const { RetrieveWithoutExpiredTokenHandler, Delete } = useRequest()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Receipt schedule' })

    const setUpdateSchedule = useCallback((updatedSchedule) => {
        //
        setScheduleList(schedule => schedule.map(sch => {
            if (sch.id === updatedSchedule.id) {
                return { ...sch, quantity: updatedSchedule.quantity, date: updatedSchedule.date }
            }
            return sch
        }))

    }, [])

    const setDeleteSchedule = useCallback((idDeletedSchedule) => {
        setScheduleList(schedules => schedules.filter(sch => sch.id !== parseInt(idDeletedSchedule)))
    }, [])

    const getSelectedMaterialOrder = useCallback((idMaterialOrder) => {
        // get selected material order when adding receipt schedule
        return materialOrderList.find(mo => mo.id === parseInt(idMaterialOrder))

    }, [materialOrderList])

    const setAddSchedule = useCallback((newSchedule) => {
        // add receipt schedule handler

        const { material_order, ...rest } = newSchedule
        const selectedMaterialOrder = getSelectedMaterialOrder(material_order)

        setScheduleList(prev => {
            return [...prev, { ...rest, material_order: selectedMaterialOrder }]
        })

    }, [getSelectedMaterialOrder])

    const openAddSchedule = useCallback(() => openModal({
        title: 'Add schedule',
        radius: 'md',
        size: 'xl',
        children: <ModalAddReceiptSchedule setAddSchedule={setAddSchedule} materialOrderList={materialOrderList} />
    }), [materialOrderList, setAddSchedule])

    const openEditSchedule = useCallback((data) => openModal({
        title: 'Edit schedule',
        radius: 'md',
        size: 'xl',
        children: <ModalEditReceiptSchedule data={data} setUpdateSchedule={setUpdateSchedule} />
    }), [setUpdateSchedule])

    const handleDeleteSchedule = useCallback(async (id) => {
        try {
            await Delete(id, 'material-receipt-schedule-management')
            SuccessNotif('Delete schedule success')
            setDeleteSchedule(id)
        } catch (e) {
            FailedNotif(e.message.data)
        }

    }, [setDeleteSchedule])

    const columnScheduleList = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.material_order.material.name,
            sortable: true
        },
        {
            name: 'Date',
            selector: row => new Date(row.date).toDateString()
        },
        {
            name: 'Quantity',
            selector: row => `${row.quantity} ${row.material_order.material.uom.name}`
        },
        {
            name: 'Arrived material',
            selector: row => `${row.fulfilled_quantity} ${row.material_order.material.uom.name}`
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openEditSchedule(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteSchedule(row.id))}
            />
        }
    ], [handleDeleteSchedule, openEditSchedule, openConfirmDeleteData])


    useEffect(() => {

        RetrieveWithoutExpiredTokenHandler(purchaseOrderId, 'material-receipt-schedule').then(data => {
            setScheduleList(data)
        })

    }, [purchaseOrderId])


    return (
        <>
            <HeadSection>
                <ButtonAdd
                    onClick={openAddSchedule}
                >
                    Receipt schedule
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnScheduleList}
                data={scheduleList}
                noData="There is no data of material receipt schedule"
            />

        </>
    )

}

