import { useState } from 'react';

interface WageInput {
    state: string;
    wageType: 'overtime' | 'minimum-wage' | 'commissions' | 'final-pay';
    payFrequency: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
    timeSinceOwed: 'less-30' | '30-90' | '90-180' | '180-365' | 'over-365';
}

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const WAGE_CATEGORIES: Record<string, string[]> = {
    'overtime': ['Hours over 40/week', 'OT rate calculations', 'Exempt classification', 'Comp time policies'],
    'minimum-wage': ['Federal minimum compliance', 'State wage requirements', 'Tip credit provisions', 'Youth wage rules'],
    'commissions': ['Agreement terms', 'Earned vs paid timing', 'Chargebacks', 'Termination policies'],
    'final-pay': ['Timing requirements', 'PTO payout', 'Expense reimbursement', 'Severance terms']
};

const LEGAL_FACTORS: Record<string, string[]> = {
    'overtime': ['FLSA provisions', 'State OT laws', 'Classification status', 'Workweek definitions', 'Regular rate calc'],
    'minimum-wage': ['Federal vs state floor', 'Industry exemptions', 'Piece rate rules', 'Training wages', 'COLA adjustments'],
    'commissions': ['Written agreements', 'Calculation methods', 'Payment timing', 'Post-term commissions', 'Clawbacks'],
    'final-pay': ['State timing laws', 'Separation type', 'PTO policies', 'Deduction limits', 'Filing deadlines']
};

const TIME_NOTES: Record<string, string> = {
    'less-30': 'Recent issues may be within normal payroll correction windows.',
    '30-90': 'Claims often fall within standard dispute resolution periods.',
    '90-180': 'May warrant formal documentation; administrative filing windows apply.',
    '180-365': 'Extended disputes may involve statute of limitations considerations.',
    'over-365': 'FLSA has 2-year statute (3 for willful); state laws vary significantly.'
};

const URGENCY: Record<string, { label: string; color: string; bg: string }> = {
    'less-30': { label: 'Recent Issue', color: '#166534', bg: '#F0FDF4' },
    '30-90': { label: 'Active Concern', color: '#0369A1', bg: '#F0F9FF' },
    '90-180': { label: 'Extended Duration', color: '#92400E', bg: '#FFFBEB' },
    '180-365': { label: 'Review Needed', color: '#991B1B', bg: '#FEF2F2' },
    'over-365': { label: 'Time-Sensitive', color: '#991B1B', bg: '#FEF2F2' }
};

function App() {
    const [values, setValues] = useState<WageInput>({ state: 'CA', wageType: 'overtime', payFrequency: 'bi-weekly', timeSinceOwed: '30-90' });
    const handleChange = (field: keyof WageInput, value: string) => setValues(prev => ({ ...prev, [field]: value }));
    const urgency = URGENCY[values.timeSinceOwed];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Unpaid Wages Estimator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Estimate your unpaid wages situation</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="state">State of Employment</label>
                            <select id="state" value={values.state} onChange={(e) => handleChange('state', e.target.value)}>
                                {STATES.map(st => <option key={st} value={st}>{st}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="wageType">Type of Unpaid Wages</label>
                            <select id="wageType" value={values.wageType} onChange={(e) => handleChange('wageType', e.target.value)}>
                                <option value="overtime">Overtime</option>
                                <option value="minimum-wage">Minimum Wage</option>
                                <option value="commissions">Commissions</option>
                                <option value="final-pay">Final Pay</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="payFrequency">Pay Frequency</label>
                            <select id="payFrequency" value={values.payFrequency} onChange={(e) => handleChange('payFrequency', e.target.value)}>
                                <option value="weekly">Weekly</option>
                                <option value="bi-weekly">Bi-Weekly</option>
                                <option value="semi-monthly">Semi-Monthly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="timeSinceOwed">Time Since Owed</label>
                            <select id="timeSinceOwed" value={values.timeSinceOwed} onChange={(e) => handleChange('timeSinceOwed', e.target.value)}>
                                <option value="less-30">Less than 30 days</option>
                                <option value="30-90">30–90 days</option>
                                <option value="90-180">90–180 days</option>
                                <option value="180-365">180 days–1 year</option>
                                <option value="over-365">Over 1 year</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn-primary" type="button">Estimate</button>
                </div>
            </div>

            <div className="card" style={{ background: urgency.bg, borderColor: urgency.color }}>
                <div className="text-center">
                    <h2 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Status Summary</h2>
                    <div style={{ display: 'inline-block', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)', backgroundColor: urgency.color, color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>{urgency.label}</div>
                </div>
                <hr style={{ margin: 'var(--space-4) 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}><strong>Time Consideration:</strong> {TIME_NOTES[values.timeSinceOwed]}</p>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Key Legal Factors</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {LEGAL_FACTORS[values.wageType].map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{f}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Wage Categories Affected</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {WAGE_CATEGORIES[values.wageType].map((cat, i) => (
                            <tr key={i} style={{ borderBottom: i === 3 ? 'none' : '1px solid var(--color-border)', backgroundColor: i % 2 ? '#F8FAFC' : 'transparent' }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)' }}>{cat}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This tool provides an informational estimate of unpaid wage situations based on common labor-law factors including overtime rules, minimum wage, commissions, and final pay. Results are estimates only and not legal advice. Laws vary by state. Consult a qualified employment attorney for guidance specific to your situation.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Not legal advice</li><li>• Laws vary by state</li>
                </ul>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Unpaid Wages Estimator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
