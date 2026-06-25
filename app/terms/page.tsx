import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Psyche',
  description: 'Terms of Service for the Psyche Mission Control dashboard.',
};

const LAST_UPDATED = 'June 24, 2026';

export default function TermsOfService() {
  return (
    <div>
      <div className="section-title" style={{ marginBottom: '24px' }}>
        Terms of Service
      </div>

      <div className="panel" style={{ padding: '32px', maxWidth: '860px', lineHeight: 1.7 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>
          Last updated: {LAST_UPDATED}
        </p>

        <p style={{ marginBottom: '24px' }}>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
          Psyche Mission Control dashboard and related services (the &ldquo;Service&rdquo;). By
          accessing or using the Service, you agree to be bound by these Terms. If you do not
          agree, do not use the Service.
        </p>

        <Section title="1. Use of the Service">
          You may use the Service only in compliance with these Terms and all applicable laws.
          You are responsible for any activity that occurs through your access, and for keeping
          your credentials secure. You agree not to misuse the Service, interfere with its normal
          operation, or attempt to access it using a method other than the interfaces we provide.
        </Section>

        <Section title="2. Accounts and Access">
          Access to the Service may require authentication. You are responsible for maintaining
          the confidentiality of any access tokens or credentials and for all activities that
          occur under your account. Notify us promptly of any unauthorized use.
        </Section>

        <Section title="3. Acceptable Use">
          You agree not to: (a) reverse engineer, decompile, or attempt to extract source code,
          except where permitted by law; (b) use the Service to store or transmit unlawful,
          infringing, or harmful content; (c) attempt to gain unauthorized access to any systems
          or data; or (d) use automated means to overload or disrupt the Service.
        </Section>

        <Section title="4. Intellectual Property">
          The Service and its original content, features, and functionality are and will remain
          the exclusive property of the operators of Psyche and their licensors. Nothing in these
          Terms grants you any right, title, or interest in the Service other than the limited
          right to use it as described here.
        </Section>

        <Section title="5. Third-Party Services">
          The Service may integrate with or display data from third-party services. We are not
          responsible for the content, policies, or practices of any third-party services, and
          your use of those services is governed by their respective terms.
        </Section>

        <Section title="6. Disclaimer of Warranties">
          The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis
          without warranties of any kind, whether express or implied, including but not limited to
          warranties of merchantability, fitness for a particular purpose, and non-infringement.
          We do not warrant that the Service will be uninterrupted, secure, or error-free.
        </Section>

        <Section title="7. Limitation of Liability">
          To the maximum extent permitted by law, in no event shall the operators of Psyche be
          liable for any indirect, incidental, special, consequential, or punitive damages, or any
          loss of profits or data, arising out of or related to your use of the Service.
        </Section>

        <Section title="8. Changes to These Terms">
          We may revise these Terms from time to time. When we do, we will update the &ldquo;Last
          updated&rdquo; date above. Your continued use of the Service after changes take effect
          constitutes acceptance of the revised Terms.
        </Section>

        <Section title="9. Contact">
          If you have any questions about these Terms, please contact the operators of the Psyche
          Mission Control dashboard.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2
        style={{
          fontSize: '15px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}
      >
        {title}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>{children}</p>
    </div>
  );
}
