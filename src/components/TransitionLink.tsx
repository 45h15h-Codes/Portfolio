"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { animate } from "framer-motion";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export function TransitionLink({ children, href, className, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) onClick(e);
    
    // If it's a new tab, anchor link on same page, or same route, just let it be
    const targetUrl = href.toString();
    const currentUrl = new URL(window.location.href);
    const destinationUrl = new URL(targetUrl, window.location.href);

    if (
      e.currentTarget.target === "_blank" ||
      e.ctrlKey || e.metaKey ||
      targetUrl.startsWith("#") ||
      destinationUrl.pathname === currentUrl.pathname
    ) {
      return;
    }

    e.preventDefault();
    
    // Animate the overlay down (0.4s out)
    await animate(
      "#page-transition-overlay",
      { y: "0%" },
      { duration: 0.4, ease: [0.87, 0, 0.13, 1] }
    );

    // Hold so user can read the easter egg message
    await new Promise((r) => setTimeout(r, 650));

    // Push the new route
    router.push(targetUrl);
  };

  return (
    <Link {...props} href={href} onClick={handleTransition} className={className}>
      {children}
    </Link>
  );
}
