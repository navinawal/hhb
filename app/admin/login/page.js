import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/cms/LoginForm";
import { getSession } from "@/lib/cms/auth";

export const metadata = {
  title: "Editor sign in | Holiday Home Bhaktapur",
  robots: { index: false, follow: false },
};

export default async function CmsLoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <main className="cms-login-page">
      <div className="cms-login-pattern" aria-hidden="true" />
      <section className="cms-login-card">
        <Image src="/images/logo.png" alt="Holiday Home Bhaktapur" width={82} height={84} priority />
        <p className="cms-login-kicker">Private content editor</p>
        <h1>Welcome back</h1>
        <p>Sign in to update the website. Nothing becomes public until you press Publish.</p>
        <LoginForm />
        <Link href="/">Return to the website</Link>
      </section>
    </main>
  );
}
