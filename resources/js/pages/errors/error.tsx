import { Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';

export default function ErrorPage({ status }: { status?: number }) {
    const title =
        {
            503: '503: Service Unavailable',
            500: '500: Server Error',
            404: '404: Page Not Found',
            403: '403: Forbidden',
        }[status ?? 404] || 'An Error Occurred';

    const description =
        {
            503: 'Sorry, we are doing some maintenance. Please check back soon.',
            500: 'Whoops, something went wrong on our servers.',
            404: 'Sorry, the page you are looking for could not be found.',
            403: 'Sorry, you are forbidden from accessing this page.',
        }[status ?? 404] || 'An unexpected error has occurred.';

    return (
        <Empty>
            <EmptyHeader>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button asChild>
                    <Link href="/">Go to Home Page</Link>
                </Button>
                <EmptyDescription>
                    Need help? <a href="#">Contact support</a>
                </EmptyDescription>
            </EmptyContent>
        </Empty>
    );
}
