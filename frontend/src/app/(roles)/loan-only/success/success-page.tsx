// Loan Application Success Confirmation
import Link from "next/link";

const LoanFirstSuccessPage = () => (
  <div className="max-w-md mx-auto py-20 flex flex-col items-center">
    <svg width="64" height="64" className="mb-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7z"/></svg>
    <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
    <p className="text-neutral-700 mb-4">Our team will review your loan application. You’ll receive an email with updates.</p>
    <Link href="/loan-first/status" className="underline text-blue-700">Check Your Application Status</Link>
    <Link href="/" className="block mt-10 text-sm text-gray-500 underline">Return to Home</Link>
  </div>
);

export default LoanFirstSuccessPage;
