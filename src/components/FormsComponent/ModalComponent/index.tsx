import React from 'react'
import { Modal } from 'react-bootstrap'

const ModalComponent = ({
    show,
    onHide,
    sizeType,
    backdropValue,
    isCenterd,
    modalTitle,
    bodyContent,
    footerContent
}: any) => {
    return (
        <Modal show={show} onHide={onHide} size={sizeType} backdrop={backdropValue} centered={isCenterd}>
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{bodyContent}</Modal.Body>
            <Modal.Footer>{footerContent}</Modal.Footer>
        </Modal>
    )
}

export default ModalComponent