import React from "react";
import ButtonSubmit from "./ButtonSubmit";


const ModalForm = (props) => {

    // form input used in every modal

    const { children, onSubmit, formId } = props

    return (
        <form
            id={formId}
            onSubmit={onSubmit}
        >
            {children}

            <ButtonSubmit
                formId={formId}
            />

        </form>
    )
}

export default ModalForm
