import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";


export const getCommonNavItems = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            items: [
                { title: "Home", href: "/", icon: "Home" },
                { title: "Dashboard", href: defaultDashboard, icon: "LayoutDashboard" },
                { title: "My Profile", href: "/my-profile", icon: "User" },
            ]
        },
        {
            title: "Settings",
            items: [
                { title: "Change Password", href: "/change-password", icon: "Settings" }
            ]
        }
    ];
};

export const userNavItems: NavSection[] = [
    {
        title: "My Content",
        items: [
            { title: "My Watchlist", href: "/dashboard/watchlist", icon: "Bookmark" },
            { title: "Subscription", href: "/dashboard/subscription", icon: "CreditCard" },
        ],
    },
];

export const adminNavItems: NavSection[] = [
    {
        title: "Content Management",
        items: [
            { title: "Media Library", href: "/admin/dashboard/media-management", icon: "Film" },
            { title: "Genres", href: "/admin/dashboard/genres-management", icon: "Tag" },
            { title: "Reviews", href: "/admin/dashboard/reviews-management", icon: "Star" },
        ],
    },
    {
        title: "User Management",
        items: [
            { title: "Users", href: "/admin/dashboard/users-management", icon: "Users" },
        ],
    },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "SUPER_ADMIN":
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];
        case "USER":
            return [...commonNavItems, ...userNavItems];
    }
};
