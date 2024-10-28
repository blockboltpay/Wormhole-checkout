import React from 'react'
import { Button } from 'react-bootstrap'

const ButtonComponent = ({
    onClick,
    btnText,
    variantType,
    sizeName,
    disabled,
    ...props
}: any) => {
    return (
        <Button
            size={sizeName}
            variant={variantType}
            disabled={disabled}
            onClick={onClick}
        >
            {btnText}
        </Button>
    )
}

export default ButtonComponent