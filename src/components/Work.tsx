import { work } from "../content";
import { Hairline, Rise, SectionLabel, SplitText } from "./ui";

/**
 * Selected work as an editorial index — category/year, oversized title,
 * one line of outcome. Rows divided by hairlines, no cards, no shadows,
 * so the fixed orb behind the page stays visible through the section.
 */
export default function Work() {
  return (
    <section id="work" className="relative z-10 py-[119px]">
      <div className="shell">
        <SectionLabel>Selected work</SectionLabel>

        <div className="mt-[46px]">
          <Hairline />
          {work.map((project, i) => (
            <div key={project.title}>
              <Rise delay={i * 0.05}>
                <div className="grid grid-cols-1 gap-[19px] py-[46px] md:grid-cols-12">
                  <div className="flex items-baseline gap-[15px] md:col-span-3 md:flex-col md:gap-[6px]">
                    <span className="label opacity-60">{project.category}</span>
                    <span className="label opacity-60">{project.year}</span>
                  </div>

                  <div className="md:col-span-5">
                    <h3 className="text-heading-sm leading-heading-sm tracking-heading-sm m-0 uppercase text-ink">
                      <SplitText lines={[project.title]} />
                    </h3>
                  </div>

                  <div className="md:col-span-4">
                    <p className="text-body leading-body tracking-body m-0 text-ink">
                      {project.body}
                    </p>
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
