import ResourceSelect from './resource-select';

type UserComboboxProps = {
    value: string;
    onChange: (userId: string) => void;
    placeholder?: string;
    id?: string;
    initialUser?: {
        id: number;
        name: string;
        avatar_url?: string | null;
        avatar_color?: string | null;
    } | null;
};

export default function UserCombobox({
    value,
    onChange,
    placeholder = 'Unassigned',
    id,
    initialUser,
}: UserComboboxProps) {
    const initialItem = initialUser
        ? {
              value: String(initialUser.id),
              label: initialUser.name,
              avatar_url: initialUser.avatar_url,
              avatar_color: initialUser.avatar_color,
          }
        : null;

    return (
        <ResourceSelect
            id={id}
            value={value}
            onChange={onChange}
            searchUrl="/users/search"
            placeholder={placeholder}
            initialItem={initialItem}
            responseKey="users"
            mapItem={(u: {
                id: number;
                name: string;
                avatar_url?: string | null;
                avatar_color?: string | null;
            }) => ({
                value: String(u.id),
                label: u.name,
                avatar_url: u.avatar_url,
                avatar_color: u.avatar_color,
            })}
        />
    );
}
