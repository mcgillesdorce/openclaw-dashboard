import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Psyche',
  description: 'Privacy Policy for the Psyche Mission Control dashboard.',
};

const LAST_UPDATED = 'June 24, 2026';

export default function PrivacyPolicy() {
  return (
    <div>
      <div className="section-title" style={{ marginBottom: '24px' }}>
        Privacy Policy
      </div>

      <div className="panel" style={{ padding: '32px', maxWidth: '860px', lineHeight: 1.7 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>
          Last updated: {LAST_UPDATED}
        </p>

        <p style={{ marginBottom: '24px' }}>
          This Privacy Policy describes how the Psyche Mission Control dashboard (the
          &ldquo;Service&rdquo;) collects, uses, and protects information when you use it. By using
          the Service, you agree to the practices described in this policy.
        </p>

        <Section title="1. Information We Collect">
          We may collect information you provide directly, such as account credentials or
          configuration data, as well as information generated through your use of the Service,
          including operational metrics, logs, and usage analytics. We may also collect technical
          information such as browser type, device information, and access timestamps.
        </Section>

        <Section title="2. How We Use Information">
          We use the information we collect to operate, maintain, and improve the Service; to
          display dashboards and analytics; to monitor performance and security; and to diagnose
          and resolve technical issues. We do not sell your personal information.
        </Section>

        <Section title="3. Third-Party Services">
          The Service may integrate with third-party providers (for example, analytics,
          messaging, or AI services) to deliver its functionality. These providers may process
          data on our behalf and are subject to their own privacy policies. We encourage you to
          review the privacy practices of any third-party services you interact with.
        </Section>

        <Section title="4. Data Retention">
          We retain information for as long as necessary to provide the Service and for legitimate
          business or legal purposes. When information is no longer needed, we take reasonable
          steps to delete or anonymize it.
        </Section>

        <Section title="5. Data Security">
          We implement reasonable technical and organizational measures designed to protect your
          information against unauthorized access, alteration, disclosure, or destruction. However,
          no method of transmission or storage is completely secure, and we cannot guarantee
          absolute security.
        </Section>

        <Section title="6. Cookies and Local Storage">
          The Service may use cookies or browser local storage to maintain session state and
          preferences. You can control or disable these through your browser settings, though some
          features of the Service may not function properly as a result.
        </Section>

        <Section title="7. Your Rights">
          Depending on your jurisdiction, you may have rights to access, correct, or delete your
          personal information, or to object to or restrict certain processing. To exercise these
          rights, please contact the operators of the Service.
        </Section>

        <Section title="8. Children's Privacy">
          The Service is not directed to individuals under the age of 13 (or the minimum age
          required in your jurisdiction), and we do not knowingly collect personal information from
          children.
        </Section>

        <Section title="9. Changes to This Policy">
          We may update this Privacy Policy from time to time. When we do, we will revise the
          &ldquo;Last updated&rdquo; date above. Your continued use of the Service after changes
          take effect constitutes acceptance of the updated policy.
        </Section>

        <Section title="10. Contact">
          If you have any questions about this Privacy Policy, please contact the operators of the
          Psyche Mission Control dashboard.
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
