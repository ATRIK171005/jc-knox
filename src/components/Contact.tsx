import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { contact, site } from "../content";
import { EASE } from "../lib/motion";
import { Rise, ScrollText, SectionLabel } from "./ui";

/**
 * Endpoint for the enquiry form.
 */
const ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = "2311386c-5fad-4f3c-a01b-06b00972e04f";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [budget, setBudget] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Inject Web3Forms access key
    data.access_key = WEB3FORMS_KEY;

    if (!ENDPOINT) {
      // No backend configured: hand off to the user's mail client.
      const body = [
        `Name: ${data.name}`,
        `Company: ${data.company}`,
        `Budget: ${data.budget}`,
        "",
        String(data.message ?? ""),
      ].join("\n");
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        `New enquiry — ${data.company || data.name}`,
      )}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative z-10 py-[60px]">
      <div className="shell">
        <SectionLabel>{contact.label}</SectionLabel>

        <div className="mt-[46px] grid grid-cols-1 gap-[46px] lg:grid-cols-12 lg:gap-[19px]">
          <div className="lg:col-span-5">
            <h2 className="headline text-ink">
              <ScrollText lines={contact.heading} />
            </h2>
            <Rise delay={0.08}>
              <p className="text-body leading-body tracking-body mb-0 mt-[30px] max-w-md text-ink">
                {contact.body}
              </p>
            </Rise>
            <Rise delay={0.14}>
              <div className="mt-[30px] flex flex-col gap-[5px]">
                <a href={`mailto:${site.email}`} className="ghost-link">
                  <span className="line">{site.email}</span>
                </a>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="ghost-link">
                  <span className="line">{site.phone} &mdash; {site.contactName}</span>
                </a>
              </div>
            </Rise>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Rise delay={0.1}>
              <div className="rounded-cards  p-[30px]">
                <AnimatePresence mode="wait">
                  {status === "sent" ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="flex min-h-[320px] flex-col justify-center"
                    >
                      <p className="label opacity-60">Received</p>
                      <p className="text-subheading leading-subheading tracking-subheading mb-0 mt-[15px] uppercase text-ink">
                        Thanks — we&apos;ll reply within one business day.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStatus("idle")}
                        className="ghost-link mt-[30px]"
                      >
                        <span className="line">Send another</span>
                        <span className="arrow text-[1.15em] leading-none">&rarr;</span>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-[19px]"
                    >
                      <div className="grid grid-cols-1 gap-[19px] sm:grid-cols-2">
                        <Field id="name" label="Your name" required />
                        <Field id="company" label="Company" />
                      </div>
                      <Field id="email" label="Email" type="email" required />

                      <fieldset className="m-0 border-0 p-0">
                        <legend className="label mb-[8px] p-0 opacity-70">Budget</legend>
                        <div className="flex flex-wrap gap-[8px]">
                          {contact.budgets.map((b) => (
                            <label
                              key={b}
                              className={`pill ${
                                budget === b ? "!bg-ink !text-parchment" : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name="budget"
                                value={b}
                                checked={budget === b}
                                onChange={() => setBudget(b)}
                                className="sr-only"
                                required
                              />
                              <span>{b}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>

                      <div className="flex flex-col gap-[8px]">
                        <label htmlFor="message" className="label opacity-70">
                          What are you building?
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          placeholder="A sentence or two is plenty."
                          className="field resize-none"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-[19px] pt-[8px]">
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="pill"
                        >
                          <span>{status === "sending" ? "Sending" : "Send enquiry"}</span>
                          <span className="text-[1.15em] leading-none">&rarr;</span>
                        </button>
                        {status === "error" && (
                          <p className="label m-0 opacity-70">
                            Something broke — email us at {site.email}.
                          </p>
                        )}
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label htmlFor={id} className="label opacity-70">
        {label}
        {required && " *"}
      </label>
      <input id={id} name={id} type={type} required={required} className="field" />
    </div>
  );
}
