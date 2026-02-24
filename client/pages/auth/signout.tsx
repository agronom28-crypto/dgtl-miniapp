import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function SignOut() {
    const router = useRouter();

    useEffect(() => {
        const handleSignOut = async () => {
            try {
                // Close Telegram WebApp if available
                const tg = (window as any).Telegram?.WebApp;
                if (tg && typeof tg.close === 'function') {
                    tg.close();
                }

                // Sign out from NextAuth
                await signOut({ redirect: false });

                // Redirect to auth page
                router.push('/authpage');
            } catch (error) {
                console.error('Sign out error:', error);
                router.push('/authpage');
            }
        };

        handleSignOut();
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen bg-base-100">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
}
