import Image from "next/image";

export default function ComingSoonPage() {
  return (
    <main className="coming-soon-page">
      <div className="coming-soon-pattern" aria-hidden="true" />
      <div className="coming-soon-arch" aria-hidden="true" />
      <section className="coming-soon-content" aria-labelledby="coming-soon-title">
        <div className="coming-soon-logo-frame">
          <Image
            className="coming-soon-logo"
            src="/images/logo.png"
            alt="Holiday Home Bhaktapur"
            fill
            sizes="220px"
            priority
          />
        </div>
        <p className="coming-soon-place">Bhaktapur, Nepal</p>
        <h1 id="coming-soon-title">Our new website is coming soon.</h1>
        <p className="coming-soon-copy">
          A peaceful and comfortable stay in the heart of Bhaktapur.
        </p>
        <div className="coming-soon-mark" aria-hidden="true"><span /><span /><span /></div>
      </section>
    </main>
  );
}
