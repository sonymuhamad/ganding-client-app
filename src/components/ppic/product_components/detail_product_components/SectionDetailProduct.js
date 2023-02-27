import React from "react";
import { IconFileTypography, IconList, IconCodeAsterix, IconBarbell, IconUser, IconTrash, IconBarcode, IconUpload, IconSum } from "@tabler/icons"
import { TextInput, Group, Paper, Image, Button, FileButton, Text, Select } from "@mantine/core"

import { ActionButtons, PriceTextInput, DecimalInput, ReadOnlyTextInput } from "../../../custom_components";

const SectionDetailProduct = (
    {
        form,
        editAccess,
        handleClickEditButton,
        handleClickDeleteButton,
        customerName,
        productTypeList,
        handleSubmit,
        totalStock
    }
) => {

    return (
        <>

            <ActionButtons
                editAccess={editAccess}
                handleClickDeleteButton={handleClickDeleteButton}
                handleClickEditButton={handleClickEditButton}
                formState={form.isDirty()}
                formId='formEditProduct'
            />

            <form id="formEditProduct" onSubmit={form.onSubmit(handleSubmit)} >
                <ReadOnlyTextInput
                    icon={<IconUser />}
                    label='Customer'
                    value={customerName}
                />
                <TextInput
                    required
                    my='xs'
                    radius='md'
                    label='Product name'
                    readOnly={!editAccess ? true : false}
                    icon={<IconBarcode />}
                    {...form.getInputProps('name')}

                />
                <TextInput
                    radius='md'
                    required
                    readOnly={!editAccess ? true : false}
                    icon={<IconCodeAsterix />}
                    label='Product number'
                    {...form.getInputProps('code')}
                />

                <Group mt='md' grow >

                    <Select
                        radius='md'
                        required
                        readOnly={!editAccess ? true : false}
                        icon={<IconFileTypography />}
                        label='Product type'
                        {...form.getInputProps('type')}
                        data={productTypeList.map(type => ({ value: type.id, label: type.name }))}
                    />

                    <DecimalInput
                        readOnly={!editAccess ? true : false}
                        required
                        icon={<IconBarbell />}
                        label='Weight / unit'
                        {...form.getInputProps('weight')}
                        rightSection={<Text size='sm' color='dimmed'  >
                            Kg
                        </Text>}
                    />

                    <PriceTextInput
                        label='Harga / unit'
                        placeholder="Input harga per unit"
                        {...form.getInputProps('price')}
                        readOnly={!editAccess ? true : false}
                        required
                    />

                </Group>
                <Group grow mt='md' >

                    <ReadOnlyTextInput
                        icon={<IconList />}
                        label='Number of process'
                        {...form.getInputProps('process')}
                    />

                    <ReadOnlyTextInput
                        label='Total stock'
                        icon={<IconSum />}
                        value={totalStock}
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

export default SectionDetailProduct