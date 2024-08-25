"use client"
import { useState } from "react";
import { Modal } from "../../components/Modal";
import { Form, FieldFromTime, FieldToTime } from "../../components/Form";

type PropsType = {
    onClose: () => void
}

export default function ParamModal( { onClose }: PropsType ) {

    console.log( "rendering: ParamModal..." )

    return (
        <Modal onClose={ onClose }>
            <Form>
                <FieldFromTime />
                <FieldToTime />
            </Form>
        </Modal>
    );
}
