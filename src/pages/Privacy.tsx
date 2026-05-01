export default function Privacy() {
  return (
    <main style={{ backgroundColor: '#070708', minHeight: '100vh' }}>
      <section
        style={{
          paddingTop: '140px',
          paddingBottom: '80px',
          paddingLeft: 'clamp(24px, 5vw, 72px)',
          paddingRight: 'clamp(24px, 5vw, 72px)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Legal
          </span>
          <h1
            style={{
              fontSize: 'clamp(32px, 4vw, 56px)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            Privacy Policy
          </h1>

          <div
            style={{
              marginTop: '48px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
            }}
          >
            <p>
              This privacy policy describes how Corolas and its associated projects
              (Platonic, Yhea, Thea, and Edith) collect, use, and protect your personal
              information.
            </p>
            <p>
              Your privacy is important to us. It is Corolas's policy to respect your privacy
              regarding any information we may collect while operating our websites.
            </p>

            <h3
              style={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#ffffff',
                marginTop: '16px',
              }}
            >
              Information We Collect
            </h3>
            <p>
              We only collect information about you if we have a reason to do so — for example,
              to provide our services, to communicate with you, or to make our services better.
              We collect information in the following ways:
            </p>
            <p>
              <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Information you provide to us directly:</strong>{' '}
              This includes your name, email address, and any messages you send us through our
              contact form.
            </p>
            <p>
              <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Information collected automatically:</strong>{' '}
              We may collect certain information automatically when you visit our websites,
              including your IP address, browser type, and usage data.
            </p>

            <h3
              style={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#ffffff',
                marginTop: '16px',
              }}
            >
              How We Use Information
            </h3>
            <p>
              We use the information we collect to operate and improve our websites, products,
              and services; to respond to your comments and questions; and to send you
              communications about our work.
            </p>

            <h3
              style={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#ffffff',
                marginTop: '16px',
              }}
            >
              Data Protection
            </h3>
            <p>
              We take reasonable measures to help protect information about you from loss, theft,
              misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
            <p>
              This is a placeholder privacy policy. Please customize this content to reflect
              your actual data practices and comply with applicable privacy laws.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
