"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  // Track timestamp of last route visits (10 second cooldown)
  const routeLastVisited = useRef<Map<string, number>>(new Map());
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  const clearAnimation = () => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
  };

  const startProgress = () => {
    clearAnimation();
    setVisible(true);
    setProgress(0);
    isNavigatingRef.current = true;

    // Smooth continuous increment from 0% towards 85%
    let current = 0;
    animationIntervalRef.current = setInterval(() => {
      current += Math.max(1, Math.floor((85 - current) * 0.25));
      if (current >= 85) {
        current = 85;
        clearAnimation();
      }
      setProgress(current);
    }, 40);
  };

  const finishProgress = () => {
    clearAnimation();
    if (isNavigatingRef.current || visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
        isNavigatingRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  };

  // Intercept anchor clicks on internal links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.target
      ) {
        const targetUrl = new URL(anchor.href);
        const targetRouteKey = `${targetUrl.pathname}${targetUrl.search}`;
        const lastVisited = routeLastVisited.current.get(targetRouteKey) || 0;
        const now = Date.now();

        // If clicked within 30s -> suppress loader completely
        if (now - lastVisited < 30000) {
          clearAnimation();
          setVisible(false);
          setProgress(0);
          isNavigatingRef.current = false;
          return;
        }

        // Record visit timestamp and start continuous loader from 0%
        routeLastVisited.current.set(targetRouteKey, now);
        startProgress();
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      clearAnimation();
    };
  }, []);

  // When pathname or searchParams change (navigation completes)
  useEffect(() => {
    const currentRouteKey = `${pathname}${searchParams ? `?${searchParams.toString()}` : ""}`;
    const lastVisited = routeLastVisited.current.get(currentRouteKey) || 0;
    const now = Date.now();

    if (isNavigatingRef.current) {
      // Complete the progress smoothly from current level straight to 100%
      finishProgress();
    } else {
      // Direct / programmatic route change
      if (now - lastVisited >= 30000) {
        routeLastVisited.current.set(currentRouteKey, now);
        startProgress();
        const finishTimer = setTimeout(() => {
          finishProgress();
        }, 150);
        return () => clearTimeout(finishTimer);
      } else {
        clearAnimation();
        setVisible(false);
        setProgress(0);
      }
    }
  }, [pathname, searchParams]);

  // Safety fallback: auto-hide loader if visible for > 1200ms
  useEffect(() => {
    if (visible) {
      const safetyTimeout = setTimeout(() => {
        clearAnimation();
        setVisible(false);
        setProgress(0);
        isNavigatingRef.current = false;
      }, 1200);
      return () => clearTimeout(safetyTimeout);
    }
  }, [visible]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none transition-opacity duration-200 ease-out"
      style={{
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="h-[3px] bg-gradient-to-r from-brand-500 via-purple-600 to-indigo-500 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(99,102,241,0.7)]"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}
