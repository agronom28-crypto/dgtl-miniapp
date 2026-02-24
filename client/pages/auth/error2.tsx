import Link from 'next/link';

export default function Error2Page() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)' }}
    >
      <div className="max-w-md w-full bg-neutral rounded-lg shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Telegram Not Available
        </h2>
        <p className="text-gray-300 mb-6">
          Telegram WebApp is not available in this browser. Please open the app through Telegram.
        </p>
        <Link href="/game">
          <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer">
            Continue to Game (Dev Mode)
          </span>
        </Link>
      </div>
    </div>
  );
}
