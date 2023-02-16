import React from "react";
import { Button, Group } from "@mantine/core";
import { IconEdit, IconX, IconDownload, IconTrashX } from "@tabler/icons";


export default function ActionButtons(props) {

    // component provide 3 button i.e edit, save changes, delete

    const {
        editAccess, // Type:bool 
        handleClickEditButton, // Type:Callback
        formState, // Type:bool,  imply the form is dirty or not
        handleClickDeleteButton, // Type:Callback
        formId // Type:string // id of the form 
    } = props

    return (

        <Group position="right" >
            <Button.Group>

                <Button
                    size='xs'
                    radius='md'
                    color={!editAccess ? 'blue.6' : 'red.6'}
                    onClick={() => handleClickEditButton()}
                    leftIcon={!editAccess ? <IconEdit /> : <IconX />}
                >
                    {!editAccess ? 'Edit' : 'Cancel'}
                </Button>

                <Button
                    form={formId}
                    size='xs'
                    color='blue.6'
                    type='submit'
                    disabled={editAccess ? !formState : true}
                    leftIcon={<IconDownload />} >
                    Save Changes
                </Button>

                <Button
                    size='xs'
                    color='red.6'
                    disabled={editAccess}
                    radius='md'
                    onClick={handleClickDeleteButton}
                    leftIcon={<IconTrashX />} >
                    Delete
                </Button>

            </Button.Group>
        </Group>
    )
}

