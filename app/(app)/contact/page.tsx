import Link from "next/link";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact | GOLD FINGER Tailor",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black px-6 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="space-y-3">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.24em] text-amber-200 hover:text-amber-100"
          >
            ← Home
          </Link>
          <p className="text-sm uppercase tracking-[0.24em] text-amber-200">
            Private Appointment
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl font-semibold tracking-wide text-white sm:text-5xl">
            컨시어지에게 문의하세요
          </h1>
          <p className="max-w-2xl text-base text-white/70">
            일정, 맞춤 목적, 원하는 원단/스타일을 남겨주시면 24시간 내로 연락
            드립니다. 파일 업로드로 레퍼런스를 공유해주셔도 됩니다.
          </p>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
