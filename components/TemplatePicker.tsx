import { Check, LayoutTemplate } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import type { TemplateId } from "@/types/design";

export function TemplatePicker({
  selected,
  onSelect,
  disabled,
  image,
}: {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
  disabled: boolean;
  image: string;
}) {
  return (
    <section className="template-section no-print" aria-labelledby="templates-heading">
      <div className="template-section-heading">
        <h2 id="templates-heading">
          <LayoutTemplate size={18} />
          Choose your starting design
        </h2>
        <span>Every template is yours to edit</span>
      </div>
      <div className="template-options">
        {TEMPLATES.map((template) => (
          <button
            type="button"
            key={template.id}
            className={`template-option template-${template.id}`}
            aria-pressed={selected === template.id}
            aria-label={`Use ${template.name} template`}
            onClick={() => onSelect(template.id)}
            disabled={disabled}
          >
            <span
              className="template-mini"
              style={{ backgroundColor: template.color }}
              aria-hidden="true"
            >
              <span className="mini-copy">
                <span className="mini-brand">UPAVAN</span>
                <span className="mini-title">
                  {template.id === "forest" ? (
                    <>
                      A gift of
                      <br />
                      stillness.
                    </>
                  ) : template.id === "editorial" ? (
                    <>
                      An invitation
                      <br />
                      to unwind.
                    </>
                  ) : (
                    <>
                      Complimentary
                      <br />
                      Stay Voucher
                    </>
                  )}
                </span>
                <span className="mini-line" />
                <span className="mini-guest">Especially for you</span>
              </span>
              <span
                className="mini-photo"
                style={{ backgroundImage: image ? `url("${image}")` : undefined }}
              />
              <span className="mini-footer" />
            </span>
            <span className="template-option-label">
              <span>
                <strong>{template.name}</strong>
                <small>{template.description}</small>
              </span>
              <span className="template-check">
                {selected === template.id && <Check size={15} />}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
