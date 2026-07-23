import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import LeadController from '@/actions/App/Http/Controllers/LeadController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserCombobox from '@/components/user-combobox';
import type { Lead, User } from '@/types';

type LeadFormData = {
    salutation_name: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    title: string;
    status: string;
    source: string;
    industry: string;
    opportunity_amount: string;
    opportunity_amount_currency: string;
    website: string;
    address_street: string;
    address_city: string;
    address_state: string;
    address_country: string;
    address_postal_code: string;
    do_not_call: boolean;
    description: string;
    account_name: string;
    assigned_user_id: string;
};

function toFormData(lead?: Lead): LeadFormData {
    return {
        salutation_name: lead?.salutation_name ?? '',
        first_name: lead?.first_name ?? '',
        last_name: lead?.last_name ?? '',
        middle_name: lead?.middle_name ?? '',
        title: lead?.title ?? '',
        status: lead?.status ?? 'New',
        source: lead?.source ?? '',
        industry: lead?.industry ?? '',
        opportunity_amount:
            lead?.opportunity_amount != null
                ? String(lead.opportunity_amount)
                : '',
        opportunity_amount_currency: lead?.opportunity_amount_currency ?? 'USD',
        website: lead?.website ?? '',
        address_street: lead?.address_street ?? '',
        address_city: lead?.address_city ?? '',
        address_state: lead?.address_state ?? '',
        address_country: lead?.address_country ?? '',
        address_postal_code: lead?.address_postal_code ?? '',
        do_not_call: lead?.do_not_call ?? false,
        description: lead?.description ?? '',
        account_name: lead?.account_name ?? '',
        assigned_user_id: lead?.assigned_user_id
            ? String(lead.assigned_user_id)
            : '',
    };
}

export default function LeadForm({
    lead,
    users,
    statuses,
    sources,
    industries,
    salutations,
    onCancel,
}: {
    lead?: Lead;
    users: User[];
    statuses: string[];
    sources: string[];
    industries: string[];
    salutations: string[];
    onCancel?: () => void;
}) {
    const { data, setData, post, put, processing, errors } =
        useForm<LeadFormData>(toFormData(lead));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (lead) {
            put(LeadController.update.url(lead));
        } else {
            post(LeadController.store.url());
        }
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="salutation_name">Salutation</Label>
                        <Select
                            value={data.salutation_name}
                            onValueChange={(value) =>
                                setData('salutation_name', value)
                            }
                        >
                            <SelectTrigger
                                id="salutation_name"
                                className="w-full"
                            >
                                <SelectValue placeholder="—" />
                            </SelectTrigger>
                            <SelectContent>
                                {salutations.map((salutation) => (
                                    <SelectItem
                                        key={salutation}
                                        value={salutation}
                                    >
                                        {salutation}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.salutation_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="first_name">First name</Label>
                        <Input
                            id="first_name"
                            value={data.first_name}
                            onChange={(e) =>
                                setData('first_name', e.target.value)
                            }
                        />
                        <InputError message={errors.first_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="last_name">Last name</Label>
                        <Input
                            id="last_name"
                            value={data.last_name}
                            onChange={(e) =>
                                setData('last_name', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.last_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="middle_name">Middle name</Label>
                        <Input
                            id="middle_name"
                            value={data.middle_name}
                            onChange={(e) =>
                                setData('middle_name', e.target.value)
                            }
                        />
                        <InputError message={errors.middle_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Job title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="account_name">Company name</Label>
                        <Input
                            id="account_name"
                            value={data.account_name}
                            onChange={(e) =>
                                setData('account_name', e.target.value)
                            }
                        />
                        <InputError message={errors.account_name} />
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
                            initialUser={lead?.assigned_user}
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
                    <CardTitle>Address</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="address_street">Street</Label>
                        <Input
                            id="address_street"
                            value={data.address_street}
                            onChange={(e) =>
                                setData('address_street', e.target.value)
                            }
                        />
                        <InputError message={errors.address_street} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address_city">City</Label>
                        <Input
                            id="address_city"
                            value={data.address_city}
                            onChange={(e) =>
                                setData('address_city', e.target.value)
                            }
                        />
                        <InputError message={errors.address_city} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address_state">State</Label>
                        <Input
                            id="address_state"
                            value={data.address_state}
                            onChange={(e) =>
                                setData('address_state', e.target.value)
                            }
                        />
                        <InputError message={errors.address_state} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address_country">Country</Label>
                        <Input
                            id="address_country"
                            value={data.address_country}
                            onChange={(e) =>
                                setData('address_country', e.target.value)
                            }
                        />
                        <InputError message={errors.address_country} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address_postal_code">Postal code</Label>
                        <Input
                            id="address_postal_code"
                            value={data.address_postal_code}
                            onChange={(e) =>
                                setData('address_postal_code', e.target.value)
                            }
                        />
                        <InputError message={errors.address_postal_code} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => setData('status', value)}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="source">Source</Label>
                        <Select
                            value={data.source}
                            onValueChange={(value) => setData('source', value)}
                        >
                            <SelectTrigger id="source" className="w-full">
                                <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                                {sources.map((source) => (
                                    <SelectItem key={source} value={source}>
                                        {source}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.source} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                            value={data.industry}
                            onValueChange={(value) =>
                                setData('industry', value)
                            }
                        >
                            <SelectTrigger id="industry" className="w-full">
                                <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                                {industries.map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                        {industry}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.industry} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="opportunity_amount">
                                Opportunity amount
                            </Label>
                            <Input
                                id="opportunity_amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.opportunity_amount}
                                onChange={(e) =>
                                    setData(
                                        'opportunity_amount',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={errors.opportunity_amount} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="opportunity_amount_currency">
                                Currency
                            </Label>
                            <Input
                                id="opportunity_amount_currency"
                                maxLength={3}
                                value={data.opportunity_amount_currency}
                                onChange={(e) =>
                                    setData(
                                        'opportunity_amount_currency',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                            />
                            <InputError
                                message={errors.opportunity_amount_currency}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-end pb-2">
                        <Checkbox
                            id="do_not_call"
                            checked={data.do_not_call}
                            onCheckedChange={(checked) =>
                                setData('do_not_call', checked === true)
                            }
                        />
                        <Label htmlFor="do_not_call">Do not call</Label>
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
                    {lead ? 'Save changes' : 'Create lead'}
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
