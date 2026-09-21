import { approach } from "../content";
import { Rise, SectionLabel } from "./ui";

export default function Approach() {
  return (
    <section id="approach" className="relative z-10 py-[119px]">
      <div className="shell">
        <div className="flex flex-col gap-[15px]">
          <SectionLabel>Our Approach</SectionLabel>
          <Rise delay={0.05}>
            <p className="text-body-sm leading-body-sm tracking-body-sm max-w-xl text-ink m-0">
              Discover how we tailor our services to meet your unique needs.
            </p>
          </Rise>
        </div>
        
        <div className="mt-[46px] grid grid-cols-1 gap-[19px] md:grid-cols-3">
          {approach.map((item, i) => (
            <Rise key={item.title} delay={i * 0.07}>
              <article className="m-0 flex h-full flex-col p-[30px] rounded-cards border border-ash/40">
                <h3 className="text-body-sm leading-body-sm tracking-body-sm text-ink m-0 font-bold uppercase">
                  {item.title}
                </h3>
                <p className="text-body leading-body tracking-body text-ink opacity-80 mt-[19px] mb-0">
                  {item.body}
                </p>
              </article>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
