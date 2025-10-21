import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslation } from "react-i18next";

export default function Loading() {
    const { t } = useTranslation();
    return (
        <div className="d-flex flex-column align-items-center">
            <Icon icon="svg-spinners:blocks-wave" width="30" height="30" style={{color: "#487fff"}} />
            <span>{t('Loading')}...</span>
        </div>
    );
}
