import ResourceSelect from './resource-select';

type UserOption = { value: string; label: string };

type UserComboboxProps = {
    value: string;
    onChange: (userId: string) => void;
    placeholder?: string;
    id?: string;
    initialUser?: { id: number; name: string } | null;
};

export default function UserCombobox({
    value,
    onChange,
    placeholder = 'Unassigned',
    id,
    initialUser,
}: UserComboboxProps) {
    const initialItem = initialUser
        ? { value: String(initialUser.id), label: initialUser.name }
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
            mapItem={(u: { id: number; name: string }) => ({
                value: String(u.id),
                label: u.name,
            })}
        />
    );
}
