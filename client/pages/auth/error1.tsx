import { signIn } from 'next-auth/react';

export default function Error1Page() {
  const handleDevLogin = async () => {
    await signIn('credentials', { redirect: true, callbackUrl: '/' });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)' }}
    >
      <div className="max-w-md w-full bg-neutral rounded-lg shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Telegram Required
        </h2>
        <p className="text-gray-300 mb-6">
          This app must be opened inside Telegram. No Telegram WebApp data was detected.
        </p>
        <p className="text-gray-400 text-sm mb-6">
          Please open this mini-app through the Telegram bot.
        </p>
        <button
          onClick={handleDevLogin}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer"
        >
          Continue to Game (Dev Mode)
        </button>
      </div>
    </div>
  );
}
