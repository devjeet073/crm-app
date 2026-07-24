import type { User } from './auth';

export type DocumentFolder = {
    id: string;
    name: string | null;
    description: string | null;
    parent_id: string | null;
    parent?: DocumentFolder | null;
    documents_count?: number;
    created_by?: User | null;
    created_at: string;
    updated_at: string;
};

export type CrmFile = {
    id: string;
    name: string;
    original_name: string;
    mime_type: string;
    size: number;
    size_for_humans: string;
    disk: string;
    path: string;
    uploaded_by_id: string | null;
    download_url: string;
    created_at: string;
    updated_at: string;
};

export type Document = {
    id: string;
    name: string | null;
    status: string;
    type: string | null;
    publish_date: string | null;
    expiration_date: string | null;
    description: string | null;
    file_id: string | null;
    file?: CrmFile | null;
    folder_id: string | null;
    folder?: DocumentFolder | null;
    assigned_user_id: string | null;
    assigned_user?: User | null;
    created_by?: User | null;
    leads_count?: number;
    accounts_count?: number;
    created_at: string;
    updated_at: string;
};

export type Account = {
    id: number;
    name: string | null;
    website: string | null;
    type: string | null;
    industry: string | null;
    sic_code: string | null;
    billing_address_street: string | null;
    billing_address_city: string | null;
    billing_address_state: string | null;
    billing_address_country: string | null;
    billing_address_postal_code: string | null;
    shipping_address_street: string | null;
    shipping_address_city: string | null;
    shipping_address_state: string | null;
    shipping_address_country: string | null;
    shipping_address_postal_code: string | null;
    description: string | null;
    is_locked: boolean;
    assigned_user_id: number | null;
    assigned_user?: User | null;
    created_by?: User | null;
    calls_count?: number;
    meetings_count?: number;
    tasks_count?: number;
    leads_count?: number;
    created_at: string;
    updated_at: string;
};

export type Lead = {
    id: number;
    salutation_name: string | null;
    first_name: string | null;
    last_name: string | null;
    middle_name: string | null;
    title: string | null;
    status: string;
    source: string | null;
    industry: string | null;
    opportunity_amount: number | null;
    opportunity_amount_currency: string | null;
    website: string | null;
    address_street: string | null;
    address_city: string | null;
    address_state: string | null;
    address_country: string | null;
    address_postal_code: string | null;
    do_not_call: boolean;
    description: string | null;
    converted_at: string | null;
    account_name: string | null;
    assigned_user_id: number | null;
    assigned_user?: User | null;
    created_by?: User | null;
    created_account?: Account | null;
    created_at: string;
    updated_at: string;
};

export type Task = {
    id: number;
    name: string | null;
    status: string;
    priority: string;
    date_start: string | null;
    date_end: string | null;
    date_start_date: string | null;
    date_end_date: string | null;
    date_completed: string | null;
    description: string | null;
    parent_id: number | null;
    parent_type: string | null;
    account_id: number | null;
    contact_id: number | null;
    email_id: number | null;
    assigned_user_id: number | null;
    assigned_user?: User | null;
    created_by?: User | null;
    account?: Account | null;
    created_at: string;
    updated_at: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    current_page: number;
    data: T[];
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string | null;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};

export type PermissionLevel = 'not-set' | 'yes' | 'no' | 'team' | 'own' | 'all';

export type Role = {
    id: number;
    name: string;
    description: string | null;
    // scope-level permissions
    assignment_permission: PermissionLevel;
    user_permission: PermissionLevel;
    message_permission: PermissionLevel;
    portal_permission: PermissionLevel;
    group_email_account_permission: PermissionLevel;
    export_permission: PermissionLevel;
    mass_update_permission: PermissionLevel;
    data_privacy_permission: PermissionLevel;
    follower_management_permission: PermissionLevel;
    audit_permission: PermissionLevel;
    mention_permission: PermissionLevel;
    user_calendar_permission: PermissionLevel;
    lock_permission: PermissionLevel;
    // entity-level ACL (JSON)
    data: Record<string, Record<string, string>> | null;
    field_data: Record<string, Record<string, Record<string, string>>> | null;
    // relationships
    users?: CrmUser[];
    teams?: Team[];
    users_count?: number;
    teams_count?: number;
    created_at: string;
    updated_at: string;
};

export type Team = {
    id: number;
    name: string;
    description: string | null;
    position_list: string[] | null;
    // relationships
    users?: CrmUser[];
    roles?: Role[];
    users_count?: number;
    roles_count?: number;
    created_at: string;
    updated_at: string;
};

export type TeamPivot = {
    role: string | null; // position label in team
};

export type CrmUser = {
    id: number;
    name: string;
    email: string;
    type: 'regular' | 'admin' | 'portal' | 'api' | 'system';
    is_active: boolean;
    title: string | null;
    avatar: string | null;
    avatar_url: string | null;
    avatar_color: string | null;
    salutation_name: string | null;
    middle_name: string | null;
    gender: string | null;
    default_team_id: number | null;
    default_team?: Team | null;
    roles?: Role[];
    teams?: Team[];
    roles_count?: number;
    teams_count?: number;
    created_at: string;
    updated_at: string;
};

export type AuthLogRecord = {
    id: number;
    username: string | null;
    ip_address: string | null;
    is_denied: boolean;
    denial_reason: string | null;
    request_time: number | null;
    request_url: string | null;
    request_method: string | null;
    authentication_method: string | null;
    user_id: number | null;
    created_at: string;
};
