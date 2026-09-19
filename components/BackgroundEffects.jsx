"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useAfterIdle } from "@/lib/useAfterIdle";
import { startPerfGovernor } from "@/lib/perfMode";

// Purely decorative, so none of this is server-rendered or in the initial JavaScript:
// each piece (and the libraries it needs) is fetched once the page is idle.
const DarkVeil = dynamic(() => import("./DarkVeil"), { ssr: false });
const TechStackBackground = dynamic(() => import("./TechStackBackground"), { ssr: false });
const TargetCursor = dynamic(() => import("./TargetCursor"), { ssr: false });

export default function BackgroundEffects() {
  const idle = useAfterIdle();
  const later = useAfterIdle(600);

  useEffect(() => {
    if (later) return startPerfGovernor();
  }, [later]);

  return (
    <>
      <div className="w-full h-150 fixed inset-0">
        {idle && (
          <DarkVeil
            hueShift={0}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={1.5}
            scanlineFrequency={0}
            warpAmount={0}
            resolutionScale={0.5}
          />
        )}
      </div>
      <div className="pointer-events-none fixed right-0 top-[5vh] h-[90vh] w-full sm:w-1/2">
        {idle && <TechStackBackground />}
      </div>
      {later && <TargetCursor />}
    </>
  );
}
