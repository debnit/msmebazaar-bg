// Loan-First CTA Landing Page ("/loan-first")
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for a Business Loan – MSMEBazaar",
  description: "Fast, simple loan application for MSMEs without registration or role selection.",
};

const LoanFirstLandingPage = () => (
  <section className="max-w-lg mx-auto py-10">
    <h1 className="text-3xl font-bold mb-4">Business Loan for You</h1>
    <p className="mb-6 text-neutral-700">
      Get instant access to MSME loan application. No lengthy registration, no role required—just start!
    </p>
    <Link
      href="/loan-first/apply"
      className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold transition"
    >
      Apply for Loan
    </Link>
    <p className="mt-6 text-xs text-gray-500">
      Already applied? <Link href="/loan-first/status" className="underline">Check status here</Link>
    </p>
  </section>
);

export default LoanFirstLandingPage;
