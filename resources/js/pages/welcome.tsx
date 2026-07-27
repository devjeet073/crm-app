import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login } from '@/routes/index';
import { register } from '@/routes/index';

export default function Welcome() {
    const { auth } = usePage().props;

    const handleDemoLogin = (role: string) => {
        router.post('/demo-login', { role });
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 font-medium text-lg">
                                Welcome to CRM Demo
                            </h1>
                            <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                Select a role below to quickly log in and explore the application with different access levels.
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleDemoLogin('Administrator')}
                                    className="flex w-full items-center justify-between rounded-lg border border-[#e3e3e0] bg-[#FDFDFC] p-4 text-left transition-colors hover:border-[#19140035] dark:border-[#3E3E3A] dark:bg-[#161615] dark:hover:border-[#62605b]"
                                >
                                    <div>
                                        <span className="block font-medium">Administrator</span>
                                        <span className="block text-xs text-[#706f6c] dark:text-[#A1A09A]">Full access to all system features and settings.</span>
                                    </div>
                                    <svg className="h-5 w-5 text-[#706f6c] dark:text-[#A1A09A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                                
                                <button
                                    onClick={() => handleDemoLogin('Manager')}
                                    className="flex w-full items-center justify-between rounded-lg border border-[#e3e3e0] bg-[#FDFDFC] p-4 text-left transition-colors hover:border-[#19140035] dark:border-[#3E3E3A] dark:bg-[#161615] dark:hover:border-[#62605b]"
                                >
                                    <div>
                                        <span className="block font-medium">Sales Manager</span>
                                        <span className="block text-xs text-[#706f6c] dark:text-[#A1A09A]">Team-level access. Can manage team records and reports.</span>
                                    </div>
                                    <svg className="h-5 w-5 text-[#706f6c] dark:text-[#A1A09A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                                
                                <button
                                    onClick={() => handleDemoLogin('Staff')}
                                    className="flex w-full items-center justify-between rounded-lg border border-[#e3e3e0] bg-[#FDFDFC] p-4 text-left transition-colors hover:border-[#19140035] dark:border-[#3E3E3A] dark:bg-[#161615] dark:hover:border-[#62605b]"
                                >
                                    <div>
                                        <span className="block font-medium">Staff / Agent</span>
                                        <span className="block text-xs text-[#706f6c] dark:text-[#A1A09A]">Basic access. Can manage own assigned records.</span>
                                    </div>
                                    <svg className="h-5 w-5 text-[#706f6c] dark:text-[#A1A09A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="relative -mb-px aspect-[335/364] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#f4f4f5] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#18181b]">
                            {/* CRM Logo */}
                            <div className="flex h-full w-full items-center justify-center relative z-10 pt-16 lg:pt-0">
                                <AppLogoIcon className="h-32 w-32 text-[#18181b] opacity-100 transition-all duration-750 dark:text-[#f4f4f5] starting:opacity-0 motion-safe:starting:translate-y-6" />
                            </div>
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.1)]"></div>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
