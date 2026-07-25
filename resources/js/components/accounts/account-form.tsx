import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import AccountController from '@/actions/App/Http/Controllers/AccountController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserCombobox from '@/components/user-combobox';
import type { Account } from '@/types';

type AccountFormData = {
    name: string;
    website: string;
    type: string;
    industry: string;
    sic_code: string;
    billing_address_street: string;
    billing_address_city: string;
    billing_address_state: string;
    billing_address_country: string;
    billing_address_postal_code: string;
    shipping_address_street: string;
    shipping_address_city: string;
    shipping_address_state: string;
    shipping_address_country: string;
    shipping_address_postal_code: string;
    description: string;
    is_locked: boolean;
    assigned_user_id: string;
};

function toFormData(account?: Account): AccountFormData {
    return {
        name: account?.name ?? '',
        website: account?.website ?? '',
        type: account?.type ?? '',
        industry: account?.industry ?? '',
        sic_code: account?.sic_code ?? '',
        billing_address_street: account?.billing_address_street ?? '',
        billing_address_city: account?.billing_address_city ?? '',
        billing_address_state: account?.billing_address_state ?? '',
        billing_address_country: account?.billing_address_country ?? '',
        billing_address_postal_code: account?.billing_address_postal_code ?? '',
        shipping_address_street: account?.shipping_address_street ?? '',
        shipping_address_city: account?.shipping_address_city ?? '',
        shipping_address_state: account?.shipping_address_state ?? '',
        shipping_address_country: account?.shipping_address_country ?? '',
        shipping_address_postal_code:
            account?.shipping_address_postal_code ?? '',
        description: account?.description ?? '',
        is_locked: account?.is_locked ?? false,
        assigned_user_id: account?.assigned_user_id
            ? String(account.assigned_user_id)
            : '',
    };
}

export default function AccountForm({
    account,
    accountTypes,
    industries,
    onCancel,
}: {
    account?: Account;
    accountTypes: string[];
    industries: string[];
    onCancel?: () => void;
}) {
    const { data, setData, post, put, processing, errors } =
        useForm<AccountFormData>(toFormData(account));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (account) {
            put(AccountController.update.url(account));
        } else {
            post(AccountController.store.url());
        }
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="name">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            value={data.website}
                            onChange={(e) => setData('website', e.target.value)}
                        />
                        <InputError message={errors.website} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="assigned_user_id">Assigned user</Label>
                        <UserCombobox
                            id="assigned_user_id"
                            value={data.assigned_user_id}
                            initialUser={account?.assigned_user}
                            onChange={(userId) =>
                                setData('assigned_user_id', userId)
                            }
                        />
                        <InputError message={errors.assigned_user_id} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Billing address</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="billing_address_street">Street</Label>
                        <Input
                            id="billing_address_street"
                            value={data.billing_address_street}
                            onChange={(e) =>
                                setData(
                                    'billing_address_street',
                                    e.target.value,
                                )
                            }
                        />
                        <InputError message={errors.billing_address_street} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="billing_address_city">City</Label>
                        <Input
                            id="billing_address_city"
                            value={data.billing_address_city}
                            onChange={(e) =>
                                setData('billing_address_city', e.target.value)
                            }
                        />
                        <InputError message={errors.billing_address_city} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="billing_address_state">State</Label>
                        <Input
                            id="billing_address_state"
                            value={data.billing_address_state}
                            onChange={(e) =>
                                setData('billing_address_state', e.target.value)
                            }
                        />
                        <InputError message={errors.billing_address_state} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="billing_address_country">Country</Label>
                        <Input
                            id="billing_address_country"
                            value={data.billing_address_country}
                            onChange={(e) =>
                                setData(
                                    'billing_address_country',
                                    e.target.value,
                                )
                            }
                        />
                        <InputError message={errors.billing_address_country} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="billing_address_postal_code">
                            Postal code
                        </Label>
                        <Input
                            id="billing_address_postal_code"
                            value={data.billing_address_postal_code}
                            onChange={(e) =>
                                setData(
                                    'billing_address_postal_code',
                                    e.target.value,
                                )
                            }
                        />
                        <InputError
                            message={errors.billing_address_postal_code}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Shipping address</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="shipping_address_street">Street</Label>
                        <Input
                            id="shipping_address_street"
                            value={data.shipping_address_street}
                            onChange={(e) =>
                                setData(
                                    'shipping_address_street',
                                    e.target.value,
                                )
                            }
                        />
                        <InputError message={errors.shipping_address_street} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="shipping_address_city">City</Label>
                        <Input
                            id="shipping_address_city"
                            value={data.shipping_address_city}
                            onChange={(e) =>
                                setData('shipping_address_city', e.target.value)
                            }
                        />
                        <InputError message={errors.shipping_address_city} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="shipping_address_state">State</Label>
                        <Input
                            id="shipping_address_state"
                            value={data.shipping_address_state}
                            onChange={(e) =>
                                setData(
                                    'shipping_address_state',
                                    e.target.value,
                                )
                            }
                        />
                        <InputError message={errors.shipping_address_state} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="shipping_address_country">
                            Country
                        </Label>
                        <Input
                            id="shipping_address_country"
                            value={data.shipping_address_country}
                            onChange={(e) =>
                                setData(
                                    'shipping_address_country',
                                    e.target.value,
                                )
                            }
                        />
                        <InputError message={errors.shipping_address_country} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="shipping_address_postal_code">
                            Postal code
                        </Label>
                        <Input
                            id="shipping_address_postal_code"
                            value={data.shipping_address_postal_code}
                            onChange={(e) =>
                                setData(
                                    'shipping_address_postal_code',
                                    e.target.value,
                                )
                            }
                        />
                        <InputError
                            message={errors.shipping_address_postal_code}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Combobox
                            items={accountTypes}
                            value={data.type || null}
                            onValueChange={(value) =>
                                setData('type', value ?? '')
                            }
                        >
                            <ComboboxInput
                                id="type"
                                placeholder="Select type"
                                showClear
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>No types found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(type) => (
                                        <ComboboxItem key={type} value={type}>
                                            {type}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <InputError message={errors.type} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Combobox
                            items={industries}
                            value={data.industry || null}
                            onValueChange={(value) =>
                                setData('industry', value ?? '')
                            }
                        >
                            <ComboboxInput
                                id="industry"
                                placeholder="Select industry"
                                showClear
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    No industries found.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(industry) => (
                                        <ComboboxItem
                                            key={industry}
                                            value={industry}
                                        >
                                            {industry}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <InputError message={errors.industry} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sic_code">SIC code</Label>
                        <Input
                            id="sic_code"
                            value={data.sic_code}
                            onChange={(e) =>
                                setData('sic_code', e.target.value)
                            }
                        />
                        <InputError message={errors.sic_code} />
                    </div>

                    <div className="flex items-center gap-2 self-end pb-2">
                        <Checkbox
                            id="is_locked"
                            checked={data.is_locked}
                            onCheckedChange={(checked) =>
                                setData('is_locked', checked === true)
                            }
                        />
                        <Label htmlFor="is_locked">Locked</Label>
                    </div>

                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <InputError message={errors.description} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4">
                <Button disabled={processing}>
                    {account ? 'Save changes' : 'Create account'}
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}
