export default function Terms() {
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
            Terms of Service
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
              These terms of service outline the rules and regulations for the use of Corolas's website
              and all associated project websites (platonic.corolas.top, yhea.corolas.top,
              thea.corolas.top, and edith.corolas.top).
            </p>
            <p>
              By accessing these websites we assume you accept these terms of service. Do not continue
              to use Corolas services if you do not agree to take all of the terms and conditions stated
              on this page.
            </p>
            <p>
              The following terminology applies to these Terms of Service, Privacy Policy and any
              or all agreements: "Client", "You" and "Your" refers to you, the person accessing
              this website and accepting the Company's terms of service. "The Company",
              "Ourselves", "We", "Our" and "Us", refers to Corolas. "Party", "Parties", or "Us",
              refers to both the Client and ourselves, or either the Client or ourselves.
            </p>
            <p>
              This is a placeholder terms of service document. Please customize this content
              as needed for your specific services and legal requirements.
            </p>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#ffffff',
                marginTop: '16px',
              }}
            >
              License
            </h3>
            <p>
              Unless otherwise stated, Corolas and/or its licensors own the intellectual property
              rights for all material on the website. All intellectual property rights are reserved.
              You may view and/or print pages from the website for your own personal use subject
              to restrictions set in these terms of service.
            </p>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#ffffff',
                marginTop: '16px',
              }}
            >
              Disclaimer
            </h3>
            <p>
              The materials on Corolas's website are provided on an 'as is' basis. Corolas makes no
              warranties, expressed or implied, and hereby disclaims and negates all other warranties
              including, without limitation, implied warranties or conditions of merchantability,
              fitness for a particular purpose, or non-infringement of intellectual property or other
              violation of rights.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
