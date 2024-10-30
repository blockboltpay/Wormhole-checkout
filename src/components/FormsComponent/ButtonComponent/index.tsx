import React from 'react'
import { Button } from 'react-bootstrap'

const ButtonComponent = ({
    onClick,
    btnText,
    variantType,
    sizeName,
    disabled,
    extraClass,
    ...props
}: any) => {
    return (
        <Button
            size={sizeName}
            variant={variantType}
            disabled={disabled}
            onClick={onClick}
            className={extraClass}
        >
            {btnText}
        </Button>
    )
}

export default ButtonComponent