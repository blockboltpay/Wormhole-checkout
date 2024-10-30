import React from 'react'
import { Form } from 'react-bootstrap'

const DropdownComponent = ({
    extaClass,
    asType,
    label,
    value,
    onChange,
    disabledValue,
    renderContent
}: any) => {
    return (
        <Form.Group className={extaClass}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                as={asType}
                value={value}
                onChange={onChange}
                disabled={disabledValue}
            >
                {renderContent}
            </Form.Control>
        </Form.Group>
    )
}

export default DropdownComponent