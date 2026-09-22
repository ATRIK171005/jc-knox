import { process } from "../content";
import { Rise, SectionLabel } from "./ui";

/**
 * Four-step process. On the reference site every section is transparent so
 * the fixed orb shows through — the stone panel is applied as a translucent
 * wash rather than an opaque block for the same reason.
 */
export default function Process() {
  return (
    <section id="process" className="relative z-10  py-[60px]">
      <div className="shell">
        <SectionLabel>How it works</SectionLabel>

        <div className="mt-[46px] grid grid-cols-1 gap-[46px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[19px]">
          {process.map((step, i) => (
            <Rise key={step.step} delay={i * 0.07} className="flex flex-col h-full">
              <div className="flex h-full flex-col gap-[15px] rounded-[20px] border border-ink/15 bg-paper/20 p-[30px] backdrop-blur-sm transition-colors duration-500 hover:bg-paper/40">
                <span className="text-heading-sm leading-heading-sm tracking-heading-sm text-ink opacity-30">
                  {step.step}
                </span>
                <h3 className="text-body leading-body tracking-[0.05em] m-0 uppercase text-ink">
                  {step.title}
                </h3>
                <p className="text-body-sm leading-body-sm tracking-body-sm m-0 text-ink opacity-85">
                  {step.body}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
