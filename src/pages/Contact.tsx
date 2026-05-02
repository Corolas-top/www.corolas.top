import { useState, useEffect, useRef } from 'react';
import { Mail, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/lib/supabase';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setIsSubmitting(true);
    setError('');

    const { error: supabaseError } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, subject, message }]);

    setIsSubmitting(false);

    if (supabaseError) {
      setError('Something went wrong. Please try again.');
      console.error(supabaseError);
    } else {
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const formEl = section.querySelector('.contact-form');
      const infoEl = section.querySelector('.contact-info');

      if (formEl) {
        gsap.from(formEl, {
          x: -40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        });
      }
      if (infoEl) {
        gsap.from(infoEl, {
          x: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '48px',
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0,0,0,0.12)',
    borderRadius: '4px',
    padding: '0 16px',
    fontSize: '15px',
    color: '#0a0a0a',
    outline: 'none',
    transition: 'border-color 0.25s ease',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.5)',
    display: 'block',
    marginBottom: '8px',
  };

  return (
    <main>
      {/* Page Header */}
      <section
        style={{
          backgroundColor: '#070708',
          paddingTop: '140px',
          paddingBottom: '60px',
          paddingLeft: 'clamp(24px, 5vw, 72px)',
          paddingRight: 'clamp(24px, 5vw, 72px)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
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
            Get in Touch
          </span>
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            Contact Us
          </h1>
          <p
            style={{
              fontSize: 'clamp(14px, 1.1vw, 17px)',
              color: 'rgba(255,255,255,0.6)',
              marginTop: '12px',
              maxWidth: '480px',
            }}
          >
            Have a question or want to collaborate? Reach out.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        ref={sectionRef}
        style={{
          backgroundColor: '#f4f4f5',
          padding: 'clamp(60px, 8vh, 100px) clamp(24px, 5vw, 72px)',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: '64px',
            alignItems: 'start',
          }}
        >
          {/* Form */}
          <div className="contact-form">
            {submitted ? (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '8px',
                  padding: '48px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(74,222,128,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 500, color: '#0a0a0a' }}>Message Sent</h3>
                <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.6)', marginTop: '8px' }}>
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: '24px',
                    fontSize: '13px',
                    color: '#c8a45c',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,164,92,0.6)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,164,92,0.6)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,164,92,0.6)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    style={{
                      ...inputStyle,
                      height: 'auto',
                      padding: '16px',
                      resize: 'vertical',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,164,92,0.6)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    height: '52px',
                    backgroundColor: '#0a0a0a',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isSubmitting ? 'wait' : 'pointer',
                    transition: 'background-color 0.25s ease',
                    marginTop: '4px',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a'; }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {error && (
                  <p style={{ fontSize: '13px', color: '#ef4444', marginTop: '4px' }}>
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="contact-info" style={{ paddingTop: '8px' }}>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#0a0a0a',
                marginBottom: '32px',
              }}
            >
              Contact Information
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '20px' }}>
              <Mail size={18} style={{ color: 'rgba(0,0,0,0.4)', flexShrink: 0 }} />
              <span style={{ fontSize: '15px', color: 'rgba(0,0,0,0.7)' }}>
                hello@corolas.top
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '20px' }}>
              <MapPin size={18} style={{ color: 'rgba(0,0,0,0.4)', flexShrink: 0 }} />
              <span style={{ fontSize: '15px', color: 'rgba(0,0,0,0.7)' }}>
                Global &middot; Remote-first
              </span>
            </div>

            <p
              style={{
                fontSize: '13px',
                fontStyle: 'italic',
                color: 'rgba(0,0,0,0.4)',
                marginTop: '40px',
              }}
            >
              We typically respond within 24–48 hours.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
