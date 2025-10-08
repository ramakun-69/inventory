// components/ui/AppModal.jsx
import { Modal as BootstrapModal } from "react-bootstrap";
import Button from "./Button";
import { useTranslation } from "react-i18next";

export default function Modal({ show, onClose, title, onSave, children, saveText, processing = false, size = 'md', fullscreen = false, centered = false }) {
    const { t } = useTranslation();
    return (
        <BootstrapModal show={show} onHide={onClose} size={size} fullscreen={fullscreen} centered={centered}>
            <BootstrapModal.Header closeButton>
                <BootstrapModal.Title className="text-xl">{title}</BootstrapModal.Title>
            </BootstrapModal.Header>
            <BootstrapModal.Body>{children}</BootstrapModal.Body>
            <BootstrapModal.Footer>
                <Button type="button" className="btn btn-sm btn-secondary" onClick={onClose}>
                    {t('Cancel')}
                </Button>
                <Button type="button" className="btn btn-sm btn-primary" isLoading={processing} onClick={onSave}>
                    {saveText ?? t('Save')}
                </Button>
            </BootstrapModal.Footer>
        </BootstrapModal>
    );
}
