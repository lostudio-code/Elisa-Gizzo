// Couples Intake Form — multi-step
const { useState, useMemo } = React;

const STEPS = [
  { id: "you", label: "About you" },
  { id: "partner", label: "Your partner" },
  { id: "relationship", label: "Your relationship" },
  { id: "focus", label: "What brings you in" },
  { id: "history", label: "Health & history" },
  { id: "logistics", label: "Logistics" },
];

const COMM_CHALLENGES = [
  "Frequent arguments",
  "Difficulty communicating",
  "Lack of intimacy",
  "Trust / infidelity",
  "Parenting differences",
  "Financial stress",
  "In-law / family stress",
  "Major life transition",
  "Considering separation",
];

const STRESSORS = [
  "Work / career",
  "Health concerns",
  "Loss or grief",
  "Recent move",
  "New baby",
  "Blended family",
  "Cultural differences",
];

const REFERRAL = [
  "Google search",
  "Psychology Today",
  "Instagram",
  "Friend or family",
  "Doctor / therapist referral",
  "Insurance directory",
  "Other",
];

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Field({ label, required, full, hint, children }) {
  return (
    <div className={"field" + (full ? " full" : "")}>
      <label>{label}{required && <span className="req">*</span>}</label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function RadioGroup({ name, value, options, onChange }) {
  return (
    <div className="radio-row">
      {options.map(opt => (
        <label key={opt} className={value === opt ? "checked" : ""}>
          <input type="radio" name={name} checked={value === opt} onChange={() => onChange(opt)} />
          {opt}
        </label>
      ))}
    </div>
  );
}

function CheckGroup({ values, options, onChange }) {
  const set = new Set(values || []);
  const toggle = (opt) => {
    if (set.has(opt)) set.delete(opt); else set.add(opt);
    onChange([...set]);
  };
  return (
    <div className="check-row">
      {options.map(opt => (
        <label key={opt} className={set.has(opt) ? "checked" : ""}>
          <input type="checkbox" checked={set.has(opt)} onChange={() => toggle(opt)} />
          <span className="box"><CheckIcon /></span>
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function ChipGroup({ values, options, onChange }) {
  const set = new Set(values || []);
  const toggle = (opt) => {
    if (set.has(opt)) set.delete(opt); else set.add(opt);
    onChange([...set]);
  };
  return (
    <div className="chip-group">
      {options.map(opt => (
        <button type="button" key={opt} className={"chip" + (set.has(opt) ? " selected" : "")} onClick={() => toggle(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function StepYou({ data, set }) {
  return (
    <div className="intake-step">
      <h2>Let's start with you.</h2>
      <p className="step-desc">Just the basics — so I know how to reach you and a little about who's joining the conversation.</p>

      <div className="section-label">Your information</div>
      <div className="field-grid">
        <Field label="First name" required>
          <input type="text" value={data.firstName||""} onChange={e=>set("firstName", e.target.value)} placeholder="Alex" />
        </Field>
        <Field label="Last name" required>
          <input type="text" value={data.lastName||""} onChange={e=>set("lastName", e.target.value)} placeholder="Rivera" />
        </Field>
        <Field label="Preferred pronouns">
          <select value={data.pronouns||""} onChange={e=>set("pronouns", e.target.value)}>
            <option value="">Select…</option>
            <option>She / Her</option>
            <option>He / Him</option>
            <option>They / Them</option>
            <option>Other / Prefer not to say</option>
          </select>
        </Field>
        <Field label="Date of birth">
          <input type="date" value={data.dob||""} onChange={e=>set("dob", e.target.value)} />
        </Field>
        <Field label="Email" required>
          <input type="email" value={data.email||""} onChange={e=>set("email", e.target.value)} placeholder="you@example.com" />
        </Field>
        <Field label="Phone" required hint="Best number for a confidential message">
          <input type="tel" value={data.phone||""} onChange={e=>set("phone", e.target.value)} placeholder="(212) 555-0142" />
        </Field>
        <Field label="Address" full>
          <input type="text" value={data.address||""} onChange={e=>set("address", e.target.value)} placeholder="Street, City, State, ZIP" />
        </Field>
      </div>

      <div className="section-label">Emergency contact</div>
      <div className="field-grid">
        <Field label="Name">
          <input type="text" value={data.emergencyName||""} onChange={e=>set("emergencyName", e.target.value)} />
        </Field>
        <Field label="Phone">
          <input type="tel" value={data.emergencyPhone||""} onChange={e=>set("emergencyPhone", e.target.value)} />
        </Field>
        <Field label="Relationship">
          <input type="text" value={data.emergencyRel||""} onChange={e=>set("emergencyRel", e.target.value)} placeholder="Sibling, parent, friend…" />
        </Field>
      </div>
    </div>
  );
}

function StepPartner({ data, set }) {
  return (
    <div className="intake-step">
      <h2>Your partner.</h2>
      <p className="step-desc">A little about the person you'll be coming to sessions with. They'll fill out their own short form before our first meeting.</p>

      <div className="field-grid">
        <Field label="Partner's first name" required>
          <input type="text" value={data.partnerFirst||""} onChange={e=>set("partnerFirst", e.target.value)} />
        </Field>
        <Field label="Partner's last name">
          <input type="text" value={data.partnerLast||""} onChange={e=>set("partnerLast", e.target.value)} />
        </Field>
        <Field label="Pronouns">
          <select value={data.partnerPronouns||""} onChange={e=>set("partnerPronouns", e.target.value)}>
            <option value="">Select…</option>
            <option>She / Her</option>
            <option>He / Him</option>
            <option>They / Them</option>
            <option>Other / Prefer not to say</option>
          </select>
        </Field>
        <Field label="Date of birth">
          <input type="date" value={data.partnerDob||""} onChange={e=>set("partnerDob", e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" value={data.partnerEmail||""} onChange={e=>set("partnerEmail", e.target.value)} />
        </Field>
        <Field label="Phone">
          <input type="tel" value={data.partnerPhone||""} onChange={e=>set("partnerPhone", e.target.value)} />
        </Field>
        <Field label="Does your partner know you're filling this out?" full>
          <RadioGroup name="partnerKnows" value={data.partnerKnows} options={["Yes", "Not yet", "We're filling it out together"]} onChange={v=>set("partnerKnows", v)} />
        </Field>
      </div>
    </div>
  );
}

function StepRelationship({ data, set }) {
  return (
    <div className="intake-step">
      <h2>About your relationship.</h2>
      <p className="step-desc">A snapshot of where you are together — there's no right or wrong answer.</p>

      <div className="field-grid">
        <Field label="How long have you been together?">
          <select value={data.lengthTogether||""} onChange={e=>set("lengthTogether", e.target.value)}>
            <option value="">Select…</option>
            <option>Less than 6 months</option>
            <option>6 months – 1 year</option>
            <option>1 – 3 years</option>
            <option>3 – 7 years</option>
            <option>7 – 15 years</option>
            <option>15+ years</option>
          </select>
        </Field>
        <Field label="Relationship status">
          <select value={data.status||""} onChange={e=>set("status", e.target.value)}>
            <option value="">Select…</option>
            <option>Dating</option>
            <option>Engaged</option>
            <option>Married</option>
            <option>Partnered / domestic partnership</option>
            <option>Separated</option>
            <option>It's complicated</option>
          </select>
        </Field>
        <Field label="Are you living together?">
          <RadioGroup name="cohab" value={data.cohab} options={["Yes", "No", "Sometimes"]} onChange={v=>set("cohab", v)} />
        </Field>
        <Field label="Do you have children together?">
          <RadioGroup name="kids" value={data.kids} options={["Yes", "No", "From previous relationships"]} onChange={v=>set("kids", v)} />
        </Field>
        <Field label="Have you done couples therapy before?" full>
          <RadioGroup name="prior" value={data.prior} options={["Never", "Yes — current/recent", "Yes — in the past"]} onChange={v=>set("prior", v)} />
        </Field>
        <Field label="If yes, briefly — what was helpful or what wasn't?" full>
          <textarea value={data.priorNotes||""} onChange={e=>set("priorNotes", e.target.value)} placeholder="Optional"></textarea>
        </Field>
      </div>
    </div>
  );
}

function StepFocus({ data, set }) {
  return (
    <div className="intake-step">
      <h2>What brings you in?</h2>
      <p className="step-desc">As much or as little as feels right. Anything you share helps me prepare for our first session.</p>

      <div className="field-grid cols-1">
        <Field label="What's bringing you to therapy now?" required>
          <textarea rows="5" value={data.bringingIn||""} onChange={e=>set("bringingIn", e.target.value)} placeholder="In your own words…"></textarea>
        </Field>

        <Field label="What you'd like to focus on (select any that apply)">
          <CheckGroup values={data.challenges} options={COMM_CHALLENGES} onChange={v=>set("challenges", v)} />
        </Field>

        <Field label="Current life stressors">
          <ChipGroup values={data.stressors} options={STRESSORS} onChange={v=>set("stressors", v)} />
        </Field>

        <Field label="What would 'success' look like for the two of you?">
          <textarea rows="4" value={data.goals||""} onChange={e=>set("goals", e.target.value)} placeholder="Even something small — what would feel different at home?"></textarea>
        </Field>
      </div>
    </div>
  );
}

function StepHistory({ data, set }) {
  return (
    <div className="intake-step">
      <h2>Health & history.</h2>
      <p className="step-desc">A few quick questions so I have the full picture. Everything stays confidential.</p>

      <div className="section-label">Mental health</div>
      <div className="field-grid">
        <Field label="Currently in individual therapy?">
          <RadioGroup name="indivTherapy" value={data.indivTherapy} options={["Yes", "No", "Not currently, but in the past"]} onChange={v=>set("indivTherapy", v)} />
        </Field>
        <Field label="Is your partner in individual therapy?">
          <RadioGroup name="partnerTherapy" value={data.partnerTherapy} options={["Yes", "No", "Not sure"]} onChange={v=>set("partnerTherapy", v)} />
        </Field>
        <Field label="Are either of you on psychiatric medication?" full>
          <RadioGroup name="meds" value={data.meds} options={["No", "Yes — me", "Yes — partner", "Yes — both"]} onChange={v=>set("meds", v)} />
        </Field>
        <Field label="Past diagnoses (you or your partner)" full>
          <input type="text" value={data.diagnoses||""} onChange={e=>set("diagnoses", e.target.value)} placeholder="Optional — e.g. anxiety, depression…" />
        </Field>
      </div>

      <div className="section-label">Safety screen</div>
      <div className="field-grid">
        <Field label="Substance use a concern in the relationship?">
          <RadioGroup name="substance" value={data.substance} options={["No", "Sometimes", "Yes"]} onChange={v=>set("substance", v)} />
        </Field>
        <Field label="Is there any physical violence or fear for safety?" hint="This helps me make sure couples work is the right fit right now.">
          <RadioGroup name="safety" value={data.safety} options={["No", "Prefer not to answer", "Yes — please call me"]} onChange={v=>set("safety", v)} />
        </Field>
      </div>
    </div>
  );
}

function StepLogistics({ data, set }) {
  return (
    <div className="intake-step">
      <h2>A few last details.</h2>
      <p className="step-desc">Scheduling preferences and how you found me. You're almost done.</p>

      <div className="field-grid">
        <Field label="Preferred session format">
          <RadioGroup name="format" value={data.format} options={["In-person", "Online (telehealth)", "No preference"]} onChange={v=>set("format", v)} />
        </Field>
        <Field label="Will you be using insurance?">
          <RadioGroup name="insurance" value={data.insurance} options={["Yes", "No — private pay", "Not sure"]} onChange={v=>set("insurance", v)} />
        </Field>
        <Field label="Insurance carrier (if applicable)" full>
          <input type="text" value={data.carrier||""} onChange={e=>set("carrier", e.target.value)} placeholder="e.g. Aetna, BCBS, Cigna, OON…" />
        </Field>
        <Field label="Best days for sessions" full>
          <ChipGroup values={data.days} options={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]} onChange={v=>set("days", v)} />
        </Field>
        <Field label="Best times" full>
          <ChipGroup values={data.times} options={["Early morning", "Mid-morning", "Lunch", "Afternoon", "Evening (after 6pm)"]} onChange={v=>set("times", v)} />
        </Field>
        <Field label="How did you hear about me?">
          <select value={data.referral||""} onChange={e=>set("referral", e.target.value)}>
            <option value="">Select…</option>
            {REFERRAL.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Referrer name (if applicable)">
          <input type="text" value={data.referralName||""} onChange={e=>set("referralName", e.target.value)} />
        </Field>
        <Field label="Anything else you'd like me to know?" full>
          <textarea rows="4" value={data.notes||""} onChange={e=>set("notes", e.target.value)} placeholder="Optional"></textarea>
        </Field>

        <Field full>
          <div className="check-row">
            <label className={data.consent ? "checked" : ""} onClick={()=>set("consent", !data.consent)}>
              <span className="box"><CheckIcon /></span>
              <span>I understand this form is confidential and that Elisa will reach out within 1–2 business days to schedule.</span>
            </label>
          </div>
        </Field>
      </div>
    </div>
  );
}

function IntakeForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({});
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const Steps = [StepYou, StepPartner, StepRelationship, StepFocus, StepHistory, StepLogistics];
  const Current = Steps[step];
  const isLast = step === Steps.length - 1;

  const next = (e) => {
    e?.preventDefault();
    if (isLast) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep(s => s + 1);
      window.scrollTo({ top: 80, behavior: "smooth" });
    }
  };
  const back = () => { setStep(s => Math.max(0, s - 1)); window.scrollTo({ top: 80, behavior: "smooth" }); };

  if (done) {
    return (
      <div className="intake-wrap">
        <div className="intake-sidebar">
          <span className="eyebrow">Couples Intake</span>
          <h1>Thank you,<br/>{data.firstName || "friend"}.</h1>
          <p style={{color:"var(--muted)", fontSize:15, lineHeight:1.6}}>
            Your responses have been sent. I'll reach out within 1–2 business days at the email and phone you provided to schedule our first session.
          </p>
        </div>
        <div className="intake-card">
          <div className="intake-success">
            <div style={{width:64, height:64, borderRadius:"50%", background:"var(--sage-700)", color:"#fff", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:24}}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14L12 20L22 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="h-display">Form received.</h2>
            <p>In the meantime, you might find <a href="index.html#process" style={{color:"var(--sage-700)", textDecoration:"underline"}}>how we'll work together</a> helpful, or revisit the <a href="index.html#faq" style={{color:"var(--sage-700)", textDecoration:"underline"}}>FAQ</a>.</p>
            <a href="index.html" className="btn btn-sage" style={{marginTop:12}}>Back to home <span className="dot"></span></a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="intake-wrap">
      <aside className="intake-sidebar">
        <span className="eyebrow">Couples Intake</span>
        <h1>Tell me a little about you.</h1>
        <p style={{color:"var(--muted)", fontSize:15, lineHeight:1.6, margin:0}}>
          This intake takes about 8 minutes. Everything you share is confidential — and you can pause at any step.
        </p>
        <div className="intake-progress">
          {STEPS.map((s, i) => (
            <div key={s.id}
              className={"step-pill" + (i === step ? " current" : "") + (i < step ? " done" : "")}
              onClick={() => i < step && setStep(i)}
            >
              <span className="num">{i < step ? "✓" : i + 1}</span>
              {s.label}
            </div>
          ))}
        </div>
      </aside>

      <form className="intake-card" onSubmit={next}>
        <Current data={data} set={set} />

        <div className="intake-actions">
          <button type="button" className="back" onClick={back} disabled={step === 0}>← Back</button>
          <button type="submit" className="btn btn-sage">
            {isLast ? "Submit" : "Continue"}
            <span className="dot"></span>
          </button>
        </div>
      </form>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("intakeRoot"));
root.render(<IntakeForm />);
