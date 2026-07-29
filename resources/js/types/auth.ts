export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    role_name?: string;
    [key: string]: unknown;
};

export type DatabaseNotification = {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: {
        account_id?: number;
        account_name?: string;
        action?: 'created' | 'modified' | 'deleted';
        actor_id?: number;
        actor_name?: string;
        title?: string;
        message?: string;
        url?: string;
    };
    read_at: string | null;
    created_at: string;
    updated_at: string;
};

export type Auth = {
    user: User;
    isAdmin: boolean;
    module_permissions: Record<
        string,
        { view: boolean; insert: boolean; update: boolean; delete: boolean }
    > | null;
    unreadNotificationsCount?: number;
    recentNotifications?: DatabaseNotification[];
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
