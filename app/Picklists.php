<?php

namespace App;

/**
 * Shared picklist option lists, mirrored from EspoCRM's entityDefs metadata
 * (Account.json / Lead.json), used for both validation and form dropdowns.
 */
final class Picklists
{
    public const ACCOUNT_TYPES = ['Customer', 'Investor', 'Partner', 'Reseller'];

    public const INDUSTRIES = [
        'Advertising', 'Aerospace', 'Agriculture', 'Apparel & Accessories', 'Architecture',
        'Automotive', 'Banking', 'Biotechnology', 'Building Materials & Equipment', 'Chemical',
        'Construction', 'Consulting', 'Computer', 'Culture', 'Creative', 'Defense', 'Education',
        'Electronics', 'Electric Power', 'Energy', 'Entertainment & Leisure', 'Finance',
        'Food & Beverage', 'Grocery', 'Healthcare', 'Hospitality', 'Insurance', 'Legal',
        'Manufacturing', 'Mass Media', 'Marketing', 'Mining', 'Music', 'Publishing', 'Petroleum',
        'Real Estate', 'Retail', 'Service', 'Sports', 'Software', 'Support', 'Shipping', 'Travel',
        'Technology', 'Telecommunications', 'Television', 'Transportation',
        'Testing, Inspection & Certification', 'Venture Capital', 'Wholesale', 'Water',
    ];

    public const LEAD_STATUSES = ['New', 'Assigned', 'In Process', 'Converted', 'Recycled', 'Dead'];

    public const LEAD_SOURCES = [
        'Call', 'Email', 'Existing Customer', 'Partner', 'Public Relations', 'Web Site', 'Campaign', 'Other',
    ];

    public const SALUTATIONS = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];

    public const TASK_STATUSES = ['Not Started', 'Started', 'Completed'];

    public const TASK_PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];
}
