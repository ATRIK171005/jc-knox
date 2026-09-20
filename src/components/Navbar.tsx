"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";

// Simple SVG icons to replace @tabler/icons-react and resolve the build error
const IconHome = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 0m-2-0v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001 1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconMessage = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.//-4.255-4.255V6a2 2 0 012-2h10a2 2 0 012 2v6z" />
  </svg>
);

const IconBriefcase = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.//-8.255-2.745M16 11V7a4 4 0 00-8 0v4m8 0H8m4 0V5a2 2 0 00-2-2H12a2 2 0 00-2 2v6" />
  </svg>
);

const IconSettings = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.444 3.01.118 3.01 2.07a17.894 17.894 0 01-//-2.25 5.65a17.894 17.894 0 01-2.25 5.65c0 1.952-.467 3.514-2.01 4.06a1.724 1.724 0 00-1.066 2.573c.444 1.543 .118 3.01 2.07 3.01a17.894 17.894 0 01-2.25 2.25 17.894 17.894 0 01-5.65 0 17.894 17.894 0 01-2.25-2.25c-1.952 0-3.514-.467-4.06-2.01a1.724 1.724 0 00-2.573-1.066c-1.543.444-3.01-.118-3.01-2.07a17.894 17.894 0 012.25-5.65 17.894 17.894 0 015.65-2.25" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function Navbar() {
  const navItems = [
    {
      name: "Work",
      link: "#work",
      icon: <IconBriefcase className="h-4 w-4 text-neutral-500 dark:text-white" />,
      magnetic: true,
    },
    {
      name: "Process",
      link: "#process",
      icon: <IconSettings className="h-4 w-4 text-neutral-500 dark:text-white" />,
      magnetic: true,
    },
  ];

  return (
    <FloatingNav navItems={navItems} />
  );
}
