
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

// ─── Formatter ─────────────────────────────
const formatINR = (amount) =>
  `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;

// ─── Components ────────────────────────────
const Header = ({ badge }) => (
  <Section style={s.header}>
    <table width="100%">
      <tbody>
        <tr>
          <td>
            <Text style={s.wordmark}>Fintel</Text>
          </td>
          <td style={{ textAlign: "right" }}>
            <Text style={s.badge}>{badge}</Text>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
);

const Footer = () => (
  <Section style={s.footer}>
    <Text style={s.footerText}>
      © {new Date().getFullYear()} Fintel • Begin Today • Build Tomorrow
    </Text>
  </Section>
);

// ─── Main ─────────────────────────────────
export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  // ───── MONTHLY REPORT ─────
  if (type === "monthly-report") {
    const income = data?.stats?.totalIncome || 0;
    const expense = data?.stats?.totalExpenses || 0;
    const net = income - expense;
    const isPositive = net >= 0;

    return (
      <Html>
        <Head />
        <Preview>Monthly Report – {data?.month}</Preview>

        <Body style={s.body}>
          <Container style={s.container}>

            <Header badge="Monthly Report" />

            <Section style={s.section}>
              <Text style={s.greeting}>Hello, {userName} </Text>
              <Text style={s.subText}>
                Here’s your financial summary for <strong>{data?.month}</strong>.
              </Text>
            </Section>

         
            <Section style={s.heroWrap}>
              <table width="100%" style={s.heroCard}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center", padding: "24px" }}>
                      <Text style={s.heroLabel}>FINANCIAL SUMMARY</Text>

                      <Text
                        style={{
                          ...s.heroAmount,
                          color: isPositive ? "#059669" : "#dc2626",
                        }}
                      >
                        {formatINR(net)}
                      </Text>

                      <Text
                        style={{
                          ...s.heroSub,
                          color: isPositive ? "#059669" : "#dc2626",
                        }}
                      >
                        {isPositive ? "▲ Surplus this month" : "▼ Deficit this month"}
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Income / Expense */}
            <Section style={s.statsWrap}>
              <table width="100%" style={s.statsCard}>
                <tbody>
                  <tr>
                    <td style={s.statLabel}>Income</td>
                    <td style={{ ...s.statValue, color: "#059669" }}>
                      {formatINR(income)}
                    </td>
                  </tr>

                  <tr><td colSpan={2} style={s.divider} /></tr>

                  <tr>
                    <td style={s.statLabel}>Expenses</td>
                    <td style={{ ...s.statValue, color: "#dc2626" }}>
                      {formatINR(expense)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Category */}
            {data?.stats?.byCategory && (
              <Section style={s.section}>
                <Text style={s.sectionTitle}>Expense Breakdown</Text>

                <table width="100%" style={s.card}>
                  <tbody>
                    {Object.entries(data.stats.byCategory).map(([cat, amt]) => (
                      <tr key={cat}>
                        <td style={s.catLabel}>{cat}</td>
                        <td style={s.catAmount}>{formatINR(amt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}

            {/* Insights */}
            {data?.insights && (
              <Section style={s.section}>
                <Text style={s.sectionTitle}>Insights</Text>

                <table width="100%" style={s.card}>
                  <tbody>
                    {data.insights.map((t, i) => (
                      <tr key={i}>
                        <td style={s.insightDot}>◆</td>
                        <td style={s.insightText}>{t}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}

            <Footer />
          </Container>
        </Body>
      </Html>
    );
  }

  // ───── BUDGET ALERT ─────
  if (type === "budget-alert") {
    const pct = data?.percentageUsed || 0;
    const remaining =
      (data?.budgetAmount || 0) - (data?.totalExpenses || 0);

    return (
      <Html>
        <Head />
        <Preview>Budget Alert – {pct.toFixed(1)}% used</Preview>

        <Body style={s.body}>
          <Container style={s.container}>

            <Header badge="Budget Alert" />

            <Section style={s.section}>
              <Text style={s.greeting}>Hello, {userName} 👋</Text>
              <Text style={s.subText}>
                You've used <strong>{pct.toFixed(1)}%</strong> of your monthly budget.
              </Text>
            </Section>

            {/* HERO + PROGRESS */}
            <Section style={s.heroWrap}>
              <table width="100%" style={s.heroCard}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center", padding: "24px" }}>
                      <Text style={s.heroLabel}>BUDGET USED</Text>

                      <Text style={s.heroAmount}>{pct.toFixed(1)}%</Text>

                      {/* PROGRESS BAR */}
                      <table width="100%" style={{ marginTop: "12px" }}>
                        <tbody>
                          <tr>
                            <td style={{
                              background: "#e5e7eb",
                              borderRadius: "6px",
                              height: "6px"
                            }}>
                              <table
                                width={`${Math.min(pct, 100)}%`}
                                style={{
                                  background: pct > 80 ? "#ef4444" : "#10b981",
                                  height: "6px",
                                  borderRadius: "6px"
                                }}
                              >
                                <tbody><tr><td></td></tr></tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* STATUS */}
                      <Text style={{
                        fontSize: "12px",
                        marginTop: "6px",
                        color: pct > 80 ? "#dc2626" : "#059669",
                      }}>
                        {pct > 80 ? "⚠ High spending" : "✓ On track"}
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Stats */}
            <Section style={s.statsWrap}>
              <table width="100%" style={s.statsCard}>
                <tbody>
                  <tr>
                    <td style={s.statLabel}>Budget</td>
                    <td style={s.statValue}>
                      {formatINR(data?.budgetAmount)}
                    </td>
                  </tr>

                  <tr><td colSpan={2} style={s.divider} /></tr>

                  <tr>
                    <td style={s.statLabel}>Spent</td>
                    <td style={s.statValue}>
                      {formatINR(data?.totalExpenses)}
                    </td>
                  </tr>

                  <tr><td colSpan={2} style={s.divider} /></tr>

                  <tr>
                    <td style={s.statLabel}>Remaining</td>
                    <td style={s.statValue}>
                      {formatINR(remaining)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Footer />
          </Container>
        </Body>
      </Html>
    );
  }

  return null;
}

// ─── Styles ───────────────────────────────
const s = {
  body: {
    backgroundColor: "#f0fdf4",
    padding: "32px 16px",
    fontFamily: "system-ui",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    maxWidth: "520px",
    margin: "0 auto",
  },
  header: {
    padding: "16px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  wordmark: {
    fontSize: "16px",
    fontWeight: "600",
  },
  badge: {
    fontSize: "11px",
    padding: "4px 12px",
    borderRadius: "999px",
    backgroundColor: "#ecfdf5",
  },
  section: {
    padding: "20px 24px 0",
  },
  greeting: {
    fontSize: "17px",
    fontWeight: "600",
  },
  subText: {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.6",
  },
  heroWrap: {
    padding: "16px 24px 0",
  },
  heroCard: {
    backgroundColor: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(16,185,129,0.08)",
  },
  heroLabel: {
    fontSize: "10px",
    letterSpacing: "3px",
    color: "#9ca3af",
    marginBottom: "8px",
  },
  heroAmount: {
    fontSize: "36px",
    fontWeight: "800",
  },
  heroSub: {
    fontSize: "12px",
    marginTop: "6px",
  },
  statsWrap: {
    padding: "16px 24px 0",
  },
  statsCard: {
    backgroundColor: "#f9fafb",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  statLabel: {
    padding: "12px 16px",
    color: "#6b7280",
  },
  statValue: {
    padding: "12px 16px",
    textAlign: "right",
    fontWeight: "500",
  },
  divider: {
    borderTop: "1px solid #e5e7eb",
  },
  sectionTitle: {
    fontSize: "11px",
    letterSpacing: "2px",
    color: "#9ca3af",
  },
  card: {
    backgroundColor: "#f9fafb",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
  },
  catLabel: {
    padding: "10px 16px",
  },
  catAmount: {
    padding: "10px 16px",
    textAlign: "right",
  },
  insightDot: {
    padding: "10px",
    color: "#10b981",
  },
  insightText: {
    padding: "10px",
    color: "#6b7280",
  },
  footer: {
    marginTop: "20px",
    padding: "16px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "11px",
    color: "#9ca3af",
  },
};