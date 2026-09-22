import { services } from "../content";
import { Hairline, Rise, SectionLabel } from "./ui";

/**
 * Services read as an editorial index: number, title, body, tags —
 * rows divided by hairlines rather than boxed into cards.
 */
export default function Services() {
  return (
    <section id="services" className="relative z-10 py-[60px]">
      <div className="shell">
        <SectionLabel>What we do</SectionLabel>

        <div className="mt-[46px]">
          <Hairline />
          {services.map((service, i) => (
            <div key={service.title}>
              <Rise delay={i * 0.05}>
                <div className="group grid grid-cols-1 gap-[19px] py-[60px] md:grid-cols-12">
                  <div className="md:col-span-1">
                    <span className="label opacity-60">{service.index}</span>
                  </div>

                  <div className="md:col-span-4">
                    <h3 className="text-subheading leading-subheading tracking-subheading m-0 uppercase text-ink">
                      {service.title}
                    </h3>
                  </div>

                  <div className="md:col-span-5">
                    <p className="text-body leading-body tracking-body m-0 text-ink">
                      {service.body}
                    </p>
                  </div>

                  <div className="flex flex-wrap content-start gap-[8px] md:col-span-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="label rounded-links border border-ash px-[8px] py-[5px] opacity-75"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Rise>
              <Hairline />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
