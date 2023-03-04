import { DecimalInput, ActionButtons, PriceTextInput, ReadOnlyTextInput } from "../../../custom_components"

import { TextInput, Group, Button, Paper, NativeSelect, Text, Image, FileButton } from "@mantine/core";
import { IconUpload, IconTrash, IconUserCheck, IconAsset, IconPerspective, IconAtom2, IconBuildingWarehouse, IconRuler2, IconDimensions, IconRulerMeasure, IconScale } from "@tabler/icons";


const SectionDetailMaterial = (
    { editAccess,
        form,
        handleClickDeleteButton,
        handleClickEditButton,
        handleSubmit,
        stockWarehouse,
        supplierName,
        uomList
    }
) => {

    return (
        <>

            <ActionButtons
                formState={form.isDirty()}
                formId='formEditMaterial'
                handleClickEditButton={handleClickEditButton}
                handleClickDeleteButton={handleClickDeleteButton}
                editAccess={editAccess}
            />

            <form id='formEditMaterial' onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    icon={<IconUserCheck />}
                    label='Supplier'
                    radius='md'
                    variant='filled'
                    readOnly
                    defaultValue={supplierName}
                />

                <TextInput
                    icon={<IconAsset />}
                    label='Material name'
                    my='xs'
                    readOnly={!editAccess}
                    placeholder="Input material name"
                    radius='md'
                    {...form.getInputProps('name')}
                />

                <Group mb='xs' grow >
                    <TextInput
                        icon={<IconPerspective />}
                        readOnly={!editAccess}
                        label='Material specification'
                        radius='md'
                        {...form.getInputProps('spec')}
                        placeholder="Input material specification"
                    />


                    <NativeSelect
                        icon={<IconAtom2 />}
                        label='Unit of material'
                        disabled={!editAccess}
                        radius='md'
                        placeholder="select an unit of material"
                        data={uomList.map(unit => ({ value: unit.id, label: unit.name }))}
                        {...form.getInputProps('uom')}
                    />

                    <PriceTextInput
                        label='Harga / unit'
                        placeholder="Input harga per unit"
                        {...form.getInputProps('price')}
                        readOnly={!editAccess}
                    />
                </Group>



                <Group
                    grow
                    mb='xs'
                >

                    <DecimalInput
                        icon={<IconRuler2 />}
                        label='Length'
                        rightSection={<Text size='sm' color='dimmed'> mm </Text>}
                        disabled={!editAccess}
                        {...form.getInputProps('length')}
                        placeholder="length of material"
                    />

                    <DecimalInput
                        icon={<IconDimensions />}
                        rightSection={<Text size='sm' color='dimmed'> mm </Text>}
                        placeholder="width of material"
                        disabled={!editAccess}
                        label='Width'
                        {...form.getInputProps('width')}
                    />

                    <DecimalInput
                        icon={<IconRulerMeasure />}
                        rightSection={<Text size='sm' color='dimmed'> mm </Text>}
                        placeholder="thickness of material"
                        label='Thickness'
                        {...form.getInputProps('thickness')}
                        disabled={!editAccess}
                    />

                </Group>

                <Group
                    grow
                >

                    <DecimalInput
                        icon={<IconScale />}
                        disabled={!editAccess}
                        rightSection={<Text size='sm' color='dimmed'> kg </Text>}
                        label='Kg/pcs'
                        {...form.getInputProps('weight')}
                        placeholder="weight of material"
                    />
                    <DecimalInput
                        icon={<IconScale />}
                        label='Berat jenis'
                        disabled={!editAccess}
                        {...form.getInputProps('berat_jenis')}
                        placeholder="Input berat jenis"
                    />

                    <ReadOnlyTextInput
                        icon={<IconBuildingWarehouse />}
                        label='Stock in warehouse'
                        value={stockWarehouse}
                    />

                </Group>


            </form>

            <Group my='lg' >
                <Paper>
                    <Image
                        radius='md'
                        src={form.values.image}
                        alt='product image'
                        withPlaceholder
                    />
                </Paper>

                <FileButton
                    radius='md'
                    leftIcon={<IconUpload />}
                    style={{ display: !editAccess ? 'none' : form.values.image === null ? '' : 'none' }}
                    {...form.getInputProps('image')}
                    accept="image/png,image/jpeg" >
                    {(props) => <Button   {...props}>Upload image</Button>}
                </FileButton>

                <Button
                    radius='md'
                    leftIcon={<IconTrash />}
                    color='red.7'
                    onClick={() => {
                        form.setFieldValue('image', null)
                        form.setDirty('image')
                    }}
                    style={{ display: !editAccess ? 'none' : form.values.image !== null ? '' : 'none' }} >
                    Delete image
                </Button>

                {form.values.image && (
                    <Text size="sm" color='dimmed' align="center" mt="sm">
                        {form.values.image.name}
                    </Text>
                )}
            </Group>


        </>
    )

}

export default SectionDetailMaterial