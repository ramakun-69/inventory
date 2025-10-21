import { useTranslation } from "react-i18next";

export default function Search({ setSearch, search }) {
    const { t } = useTranslation();

    return (
        <div className="d-flex justify-content-end mb-3">
            <input
                type="text"
                className="form-control"
                placeholder={t('Search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                autoFocus
            />
        </div>
    );
}