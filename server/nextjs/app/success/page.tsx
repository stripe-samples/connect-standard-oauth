export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-600">
            Onboarding completed
          </h1>
          <p className="text-gray-600">
            Your Stripe account has been successfully connected.
          </p>
        </div>
      </div>
    </main>
  );
}
