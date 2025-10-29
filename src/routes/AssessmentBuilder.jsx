import React, { useState } from "react";
import AssessmentPreview from "../components/AssessmentPreview";
import { assessmentsApi } from "../services/api";

/**
 * AssessmentBuilder - improved, non-mutating, colorful UI
 * Props:
 *  - jobId
 *  - initial (assessment object)
 */
export default function AssessmentBuilder({ jobId, initial }) {
  // defensive clone so we don't mutate the incoming object
  const [data, setData] = useState(() =>
    initial ? JSON.parse(JSON.stringify(initial)) : {
      id: "local",
      title: "Untitled Assessment",
      description: "",
      sections: [],
    }
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await assessmentsApi.put(jobId, data);
      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Save failed: " + (err?.message ?? "unknown"));
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    const newSec = {
      id: crypto?.randomUUID?.() ?? `sec-${Date.now()}`,
      title: "New Section",
      subtitle: "",
      questions: [],
    };
    setData((d) => ({ ...d, sections: [...d.sections, newSec] }));
  };

  const addQuestion = (sectionIndex) => {
    const newQ = {
      id: crypto?.randomUUID?.() ?? `q-${Date.now()}`,
      type: "short",
      label: "New question",
      placeholder: "",
      options: [],
    };
    setData((d) => {
      const sections = d.sections.map((s, idx) =>
        idx === sectionIndex ? { ...s, questions: [...s.questions, newQ] } : s
      );
      return { ...d, sections };
    });
  };

  const updateSectionTitle = (idx, title) =>
    setData((d) => {
      const sections = d.sections.map((s, i) => (i === idx ? { ...s, title } : s));
      return { ...d, sections };
    });

  const updateQuestionLabel = (sIdx, qIdx, label) =>
    setData((d) => {
      const sections = d.sections.map((s, i) => {
        if (i !== sIdx) return s;
        const questions = s.questions.map((q, j) => (j === qIdx ? { ...q, label } : q));
        return { ...s, questions };
      });
      return { ...d, sections };
    });

  const removeQuestion = (sIdx, qIdx) =>
    setData((d) => {
      const sections = d.sections.map((s, i) => {
        if (i !== sIdx) return s;
        const questions = s.questions.filter((_, j) => j !== qIdx);
        return { ...s, questions };
      });
      return { ...d, sections };
    });

  const removeSection = (sIdx) =>
    setData((d) => ({ ...d, sections: d.sections.filter((_, i) => i !== sIdx) }));

  return (
    <div className="assessment-builder grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Editor Column */}
      <div>
        <div className="card builder-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="small muted">Assessment title</label>
              <input
                className="input mt-1"
                value={data.title}
                onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))}
              />
              <label className="small muted mt-1">Description</label>
              <input
                className="input mt-1"
                value={data.description ?? ""}
                onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
                placeholder="Optional description"
              />
              <div className="small muted mt-1">Sections: {data.sections.length}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="button accent" onClick={addSection}>+ Section</button>
              <button className="button" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>

        <div className="list mt-2">
          {data.sections.length === 0 && (
            <div className="card empty">
              <div className="h2">No sections</div>
              <div className="small muted">Use "Add Section" to create your first section.</div>
            </div>
          )}

          {data.sections.map((sec, sIdx) => (
            <div key={sec.id ?? sIdx} className="card section-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label className="small muted">Section title</label>
                  <input
                    className="input mt-1"
                    value={sec.title}
                    onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                  />
                  <label className="small muted mt-1">Subtitle (optional)</label>
                  <input
                    className="input mt-1"
                    value={sec.subtitle ?? ""}
                    onChange={(e) =>
                      setData((d) => {
                        const sections = d.sections.map((s, i) => (i === sIdx ? { ...s, subtitle: e.target.value } : s));
                        return { ...d, sections };
                      })
                    }
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button className="button" onClick={() => addQuestion(sIdx)}>+ Q</button>
                  <button className="button secondary" onClick={() => removeSection(sIdx)}>Remove</button>
                </div>
              </div>

              <div className="list mt-2">
                {sec.questions.length === 0 && <div className="empty">No questions yet</div>}

                {sec.questions.map((q, qIdx) => (
                  <div key={q.id ?? qIdx} className="card-compact question-row">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                      <div style={{ flex: 1 }}>
                        <label className="small muted">Question</label>
                        <input
                          className="input mt-1"
                          value={q.label}
                          onChange={(e) => updateQuestionLabel(sIdx, qIdx, e.target.value)}
                        />
                        <div className="small muted mt-1">Type: {q.type}</div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <button className="button secondary" onClick={() => removeQuestion(sIdx, qIdx)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Column */}
      <div>
        <div className="card preview-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="h1">{data.title}</div>
              <div className="small muted">{data.description}</div>
            </div>
            <div className="small muted">Live Preview</div>
          </div>
        </div>

        <div className="mt-2">
          <AssessmentPreview data={data} />
        </div>
      </div>
    </div>
  );
}
