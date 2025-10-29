import React from "react";
import { useForm } from "react-hook-form";

export default function AssessmentPreview({ data }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (vals) => {
    // pretty alert for demo; replace with real submit if needed
    alert("Submit (local only)\n\n" + JSON.stringify(vals, null, 2));
  };

  if (!data) {
    return (
      <div className="card empty" style={{ textAlign: "center", padding: 24 }}>
        <div className="h2">No assessment selected</div>
        <div className="small muted">Choose an assessment to preview its questions.</div>
      </div>
    );
  }

  return (
    <div className="assessment-preview">
      <div className="card preview-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="h1" style={{ marginBottom: 6 }}>{data.title}</div>
            {data.description && <div className="small muted">{data.description}</div>}
          </div>
          <div className="tag">Preview</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="list mt-2">
        {Array.isArray(data.sections) && data.sections.length > 0 ? (
          data.sections.map((sec, sIdx) => (
            <section key={sec.id ?? sIdx} className="card section-preview">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="h2">{sec.title}</div>
                  {sec.subtitle && <div className="small muted mt-1">{sec.subtitle}</div>}
                </div>
                <div className="small muted">Section {sIdx + 1}</div>
              </div>

              <div className="list mt-2">
                {Array.isArray(sec.questions) && sec.questions.length > 0 ? (
                  sec.questions.map((q, qIdx) => {
                    const name = String(q.id ?? `s${sIdx}q${qIdx}`);
                    return (
                      <div key={name} className="card-compact question-preview">
                        <label className="h2 question-label" htmlFor={name} style={{ display: "block", marginBottom: 8 }}>
                          {q.label}
                        </label>

                        {/* short answer */}
                        {q.type === "short" && (
                          <input
                            id={name}
                            {...register(name)}
                            className="input"
                            placeholder={q.placeholder ?? "Type your answer here"}
                            aria-label={q.label}
                          />
                        )}

                        {/* single choice */}
                        {q.type === "single" && Array.isArray(q.options) && (
                          <fieldset className="choices" aria-labelledby={`legend-${name}`} style={{ border: "none", padding: 0, margin: 0 }}>
                            <legend id={`legend-${name}`} className="small muted" style={{ marginBottom: 8 }}>
                              {q.hint ?? ""}
                            </legend>
                            <div className="choices-list">
                              {q.options.map((opt, oIdx) => (
                                <label key={oIdx} className="choice">
                                  <input
                                    type="radio"
                                    {...register(name)}
                                    value={opt}
                                    name={name}
                                    aria-label={`${q.label} — ${opt}`}
                                  />
                                  <span className="choice-text">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </fieldset>
                        )}

                        {/* unsupported */}
                        {q.type !== "short" && q.type !== "single" && (
                          <div className="small muted">Unsupported question type: {q.type}</div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="empty">No questions in this section.</div>
                )}
              </div>
            </section>
          ))
        ) : (
          <div className="empty">No sections found.</div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
          <button type="button" className="button secondary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back
          </button>
          <button type="submit" className="button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
