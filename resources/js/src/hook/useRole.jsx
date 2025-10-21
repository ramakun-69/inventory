import { usePage } from "@inertiajs/react";

export function useRole() {
    const { auth } = usePage().props;
    const roles = auth?.role || [];

    const hasAnyRole = (allowedRoles) =>
        roles.some((r) => allowedRoles.includes(r));

    const hasRole = (roleName) =>
        roles.includes(roleName);

    return { roles, hasAnyRole, hasRole };
}
