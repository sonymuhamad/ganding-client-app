import React, { useMemo, useCallback } from "react";
import { openModal } from "@mantine/modals";
import { ButtonDelete, ButtonEdit, ButtonAdd, HeadSection, } from '../../../custom_components'
import { ExpandedProcess } from "../../../layout";
import ModalAddProcess from './ModalAddProcess'
import ModalEditProcess from './ModalEditProcess'
import { useConfirmDelete, useRequest, useNotification } from "../../../../hooks"
import { BaseTableExpanded } from "../../../tables";

const SectionManufacuringProcess = (
    {
        setAddProcess,
        setUpdateProcess,
        setDeleteProcess,
        processList,
        productId,
    }
) => {

    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Manufacturing process' })
    const { Delete } = useRequest()
    const { successNotif, failedNotif } = useNotification()

    const generateDataProcessType = useCallback((dataProcess, processTypeList) => {
        const { process_type } = dataProcess
        const selectedProcessType = processTypeList.find(processType => processType.id === parseInt(process_type))
        return { ...dataProcess, process_type: selectedProcessType }
    }, [])

    const handleDeleteProcess = useCallback(async (idProcess) => {
        try {
            await Delete(idProcess, 'process/management')
            setDeleteProcess(idProcess)
            successNotif('Delete manufacturing process success')
        } catch (e) {
            failedNotif(e, 'Delete manufacturing process failed')
        }
    }, [setDeleteProcess, successNotif, failedNotif])

    const searchMaterial = useCallback((idReqMaterial, materialList) => {
        return materialList.find(material => material.id === idReqMaterial)
    }, [])

    const generateDataRequirementMaterial = useCallback((requirementMaterialList, materialList) => {
        // a function to get object of material if each requirement material list
        return requirementMaterialList.map(reqMaterial => {
            const { material } = reqMaterial // materialId
            const selectedMaterial = searchMaterial(material, materialList)
            return { ...reqMaterial, material: selectedMaterial }
        })
    }, [searchMaterial])

    const searchProduct = useCallback((idReqProduct, productList) => {
        return productList.find(product => product.id === idReqProduct)
    }, [])

    const generateDataRequirementProduct = useCallback((requirementProductList, productList) => {
        // a function to get object of product in each requirement product list

        return requirementProductList.map(reqProduct => {
            const { product } = reqProduct // productId
            const selectedProduct = searchProduct(product, productList)
            return { ...reqProduct, product: selectedProduct }
        })
    }, [searchProduct])

    const generateDataProcess = useCallback((process, productList, materialList, processTypeList) => {
        // a function to generate data process after insert or update process

        const { requirementproduct_set, requirementmaterial_set, ...restDataProcess } = process
        const requirementProduct = generateDataRequirementProduct(requirementproduct_set, productList)
        const requirementMaterial = generateDataRequirementMaterial(requirementmaterial_set, materialList)
        return generateDataProcessType({ ...restDataProcess, requirementproduct_set: requirementProduct, requirementmaterial_set: requirementMaterial }, processTypeList)

    }, [generateDataRequirementMaterial, generateDataRequirementProduct, generateDataProcessType])

    const openAddProcess = useCallback(() => openModal({
        title: 'Add manufacturing process',
        size: 'xl',
        children: <ModalAddProcess
            setAddProcess={setAddProcess}
            productId={productId}
            generateDataProcess={generateDataProcess}
        />
    }), [setAddProcess, productId, generateDataProcess])

    const openEditProcess = useCallback((data) => openModal({
        title: 'Edit manufacturing process',
        size: 'xl',
        children: <ModalEditProcess
            setUpdateProcess={setUpdateProcess}
            data={data}
            generateDataProcess={generateDataProcess}
        />
    }), [generateDataProcess, setUpdateProcess])

    const generateReqMaterialBeforeEdit = useCallback((reqMaterial) => {
        return reqMaterial.map(req => {
            const { material, ...rest } = req
            const { id } = material
            return { ...rest, material: id }
        })
    }, [])

    const generateReqProductBeforeEdit = useCallback((reqProduct) => {
        return reqProduct.map(req => {
            const { product, ...rest } = req
            const { id } = product
            return { ...rest, product: id }
        })
    }, [])

    const generateProcessTypeBeforeEdit = useCallback((process) => {
        const { process_type, ...rest } = process
        const { id } = process_type
        return { ...rest, process_type: id }
    }, [])

    const generateProcessBeforeEdit = useCallback((dataProcess) => {
        const { requirementmaterial_set, requirementproduct_set, ...rest } = dataProcess

        const reqMaterial = generateReqMaterialBeforeEdit(requirementmaterial_set)
        const reqProduct = generateReqProductBeforeEdit(requirementproduct_set)
        return generateProcessTypeBeforeEdit({ ...rest, product: productId, requirementmaterial_set: reqMaterial, requirementproduct_set: reqProduct })

    }, [generateReqMaterialBeforeEdit, generateReqProductBeforeEdit, generateProcessTypeBeforeEdit, productId])

    const columnManufacturingProcess = useMemo(() => [
        {
            name: 'Process name',
            selector: row => row.process_name
        },
        {
            name: 'Process type',
            selector: row => row.process_type.name
        },
        {
            name: 'Wip',
            selector: row => row.order,
            sortable: true
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openEditProcess(generateProcessBeforeEdit(row))}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteProcess(row.id))}
            />
        }
    ], [handleDeleteProcess, openEditProcess, openConfirmDeleteData, generateProcessBeforeEdit])

    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openAddProcess}
                >
                    Manufacturing process
                </ButtonAdd>
            </HeadSection>

            <BaseTableExpanded
                data={processList}
                column={columnManufacturingProcess}
                noData='Product ini tidak memiliki process'
                expandComponent={ExpandedProcess}
            />

        </>
    )
}

export default SectionManufacuringProcess
