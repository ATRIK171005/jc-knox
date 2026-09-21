import { intro } from "../content";
import { GhostLink, Rise } from "./ui";

/**
 * Founder intro: label + ghost link on the left, body copy on the right.
 */
export default function About() {
  return (
    <section id="studio" className="relative z-10 py-[119px]">
      <div className="shell">
        <div className="grid grid-cols-1 gap-[46px] md:grid-cols-12 md:gap-[19px]">
          <div className="flex flex-col gap-[19px] md:col-span-5 lg:col-span-4">
            <Rise>
              <p className="text-body-sm leading-body-sm tracking-body-sm uppercase text-ink">
                {intro.label}
              </p>
            </Rise>
            <Rise delay={0.08}>
              <GhostLink href={intro.link.href}>{intro.link.label}</GhostLink>
            </Rise>
          </div>

          <div className="md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
            <Rise delay={0.12}>
              <p className="text-body leading-body tracking-body m-0 text-ink">
                {intro.body}
              </p>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}
