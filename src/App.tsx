import { useState } from 'react';

interface InsuranceInput {
    driverAge: number;
    state: string;
    vehicleType: 'sedan' | 'suv' | 'truck' | 'sports' | 'luxury' | 'electric';
    coverageLevel: 'minimum' | 'standard' | 'full';
}

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const BASE_RATES = { minimum: 840, standard: 1440, full: 2160 };
const STATE_MULT: Record<string, number> = { MI: 1.45, LA: 1.40, FL: 1.35, NY: 1.30, CA: 1.25, NJ: 1.28, TX: 1.20, DEFAULT: 1.00 };
const VEHICLE_MULT = { sedan: 1.00, suv: 1.10, truck: 1.08, sports: 1.45, luxury: 1.55, electric: 1.15 };

const getAgeMult = (age: number) => age < 20 ? 1.85 : age < 25 ? 1.55 : age < 30 ? 1.20 : age < 65 ? 1.00 : age < 75 ? 1.15 : 1.35;

const COVERAGE_SUMMARY: Record<string, string[]> = {
    minimum: ['State-required liability only', 'Covers damage to others', 'No vehicle coverage', 'Lowest premium'],
    standard: ['Liability + collision', 'Vehicle accident coverage', 'Uninsured motorist', 'Balanced cost'],
    full: ['Comprehensive coverage', 'Theft/vandalism/weather', 'Lower deductibles', 'Maximum protection']
};

const COVERAGE_DETAILS: Record<string, { label: string; included: boolean }[]> = {
    minimum: [{ label: 'Bodily Injury Liability', included: true }, { label: 'Property Damage', included: true }, { label: 'Collision', included: false }, { label: 'Comprehensive', included: false }, { label: 'Uninsured Motorist', included: false }, { label: 'Medical Payments', included: false }],
    standard: [{ label: 'Bodily Injury Liability', included: true }, { label: 'Property Damage', included: true }, { label: 'Collision', included: true }, { label: 'Comprehensive', included: false }, { label: 'Uninsured Motorist', included: true }, { label: 'Medical Payments', included: true }],
    full: [{ label: 'Bodily Injury Liability', included: true }, { label: 'Property Damage', included: true }, { label: 'Collision', included: true }, { label: 'Comprehensive', included: true }, { label: 'Uninsured Motorist', included: true }, { label: 'Medical Payments', included: true }]
};

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function App() {
    const [values, setValues] = useState<InsuranceInput>({ driverAge: 35, state: 'CA', vehicleType: 'sedan', coverageLevel: 'standard' });
    const handleChange = (field: keyof InsuranceInput, value: string | number) => setValues(prev => ({ ...prev, [field]: value }));

    const annual = Math.round(BASE_RATES[values.coverageLevel] * getAgeMult(values.driverAge) * (STATE_MULT[values.state] || STATE_MULT.DEFAULT) * VEHICLE_MULT[values.vehicleType]);
    const monthly = Math.round(annual / 12);
    const details = COVERAGE_DETAILS[values.coverageLevel];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Car Insurance Cost Estimator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Get an instant estimate of your car insurance premium</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="driverAge">Driver Age</label>
                            <input id="driverAge" type="number" min="16" max="99" value={values.driverAge || ''} onChange={(e) => handleChange('driverAge', parseInt(e.target.value) || 0)} placeholder="35" />
                        </div>
                        <div>
                            <label htmlFor="state">State</label>
                            <select id="state" value={values.state} onChange={(e) => handleChange('state', e.target.value)}>
                                {STATES.map(st => <option key={st} value={st}>{st}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="vehicleType">Vehicle Type</label>
                        <select id="vehicleType" value={values.vehicleType} onChange={(e) => handleChange('vehicleType', e.target.value)}>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="truck">Truck</option>
                            <option value="sports">Sports Car</option>
                            <option value="luxury">Luxury Vehicle</option>
                            <option value="electric">Electric Vehicle</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="coverageLevel">Coverage Level</label>
                        <select id="coverageLevel" value={values.coverageLevel} onChange={(e) => handleChange('coverageLevel', e.target.value)}>
                            <option value="minimum">Minimum (Liability Only)</option>
                            <option value="standard">Standard (Liability + Collision)</option>
                            <option value="full">Full (Comprehensive)</option>
                        </select>
                    </div>
                    <button className="btn-primary" type="button">Get Estimate</button>
                </div>
            </div>

            <div className="card" style={{ background: '#F0F9FF', borderColor: '#BAE6FD' }}>
                <div className="text-center">
                    <h2 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>Estimated Monthly Cost</h2>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{fmt(monthly)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>per month</div>
                </div>
                <hr style={{ margin: 'var(--space-6) 0', border: 'none', borderTop: '1px solid #BAE6FD' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>ANNUAL COST</div>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{fmt(annual)}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>COVERAGE</div>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-accent)' }}>{details.filter(d => d.included).length} of {details.length}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Coverage Level Summary</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {COVERAGE_SUMMARY[values.coverageLevel].map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Coverage Details</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {details.map((d, i) => (
                            <tr key={i} style={{ borderBottom: i === details.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: i % 2 ? '#F8FAFC' : 'transparent' }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)' }}>{d.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: d.included ? '#10B981' : '#94A3B8' }}>{d.included ? 'Included' : 'Not Included'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This tool provides an informational estimate of car insurance costs based on common rating factors such as driver age, location, vehicle type, and coverage level. The figures shown are estimates only. Actual insurance premiums vary based on driving history, credit score, and insurer criteria. Contact licensed providers for accurate quotes.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Actual premiums vary</li><li>• Free to use</li>
                </ul>
                <nav style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                    <a href="https://scenariocalculators.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Privacy Policy</a>
                    <span style={{ color: '#64748B' }}>|</span>
                    <a href="https://scenariocalculators.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Terms of Service</a>
                </nav>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Car Insurance Cost Estimator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
