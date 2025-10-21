import i18n from "./i18n";

function toDateString(date) {
    if (!date) return "-";
    const d = new Date(date);
    const locale = i18n.language;
    return d.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export { toDateString };