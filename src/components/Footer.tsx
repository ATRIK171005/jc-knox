import { footerLinks, site } from "../content";
import { Hairline, SplitText } from "./ui";

export default function Footer() {
  return (
    <footer className="relative z-10 pb-[46px]">
      <div className="shell">
        <Hairline />

        {/* Oversized wordmark as the closing mark, clipped to the gutter. */}
        <p
          className="m-0 select-none py-[46px] uppercase leading-[0.8] tracking-display text-ink"
          style={{ fontSize: "clamp(56px, 16vw, 220px)" }}
        >
          <SplitText lines={[site.name]} />
        </p>

        <Hairline />

        <div className="flex flex-col gap-[30px] pt-[30px] md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-[5px]">
            <a href={`mailto:${site.email}`} className="ghost-link">
              <span className="line">{site.email}</span>
            </a>
          </div>

          <nav className="flex flex-wrap gap-[19px]">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="ghost-link"
              >
                <span className="line">{s.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-[8px] md:items-end">
            <div className="flex gap-[19px]">
              {footerLinks.map((l) => (
                <a key={l.label} href={l.href} className="ghost-link">
                  <span className="line">{l.label}</span>
                </a>
              ))}
            </div>
            <p className="label m-0 opacity-65">
              &copy; {new Date().getFullYear()} {site.nameShort}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
