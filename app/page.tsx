"use client";

import DarkVeil from "@/components/DarkVeil";
import ProfileCard from "@/components/ProfileCard";
import ElectricBorder from "@/components/ElectricBorder";
import GradualBlur from "@/components/GradualBlur";
import CoderProfileCard from "@/components/CoderProfileCard";
import TechStackSpiral from '@/components/TechStackSpiral';
import { techStack } from '@/lib/techStack';
import Shuffle from '@/components/Shuffle';
import VentureGrid from '@/components/VentureGrid';
import { projects } from '@/lib/projects';

import Services from '@/components/Services';
import ContactFooter from '@/components/ContactFooter';
import TargetCursor from '@/components/TargetCursor';

const headingStyle = { fontSize: 'clamp(1.75rem, 8vw, 3.5rem)' };

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <Shuffle
        text={title}
        tag="h2"
        style={headingStyle}
        shuffleDirection="right"
        duration={0.35}
        animationMode="evenodd"
        shuffleTimes={1}
        ease="power3.out"
        stagger={0.03}
        threshold={0.1}
        triggerOnce={true}
        triggerOnHover
        respectReducedMotion={true}
      />
      <p className="mt-4 text-sm sm:text-base text-gray-400">{subtitle}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen relative overflow-hidden flex-1 items-center justify-center font-sans bg-black px-4 sm:px-6">
      <div className="sr-only">
        <h1>Chris Belga — Web Developer &amp; HubSpot Admin</h1>
        <p>
          Full-stack web developer and HubSpot admin from Bicol, Philippines, building web apps
          with React, Next.js, and Node.js. Available for projects — email inquiry@chrisbelga.dev.
        </p>
      </div>
      <GradualBlur
        target="page"
        position="top"
        height="7rem"
        strength={2}
        divCount={2}
        curve="bezier"
        exponential
        opacity={1}
      />
      <div className="w-full h-150 fixed inset-0">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={1.5}
          scanlineFrequency={0}
          warpAmount={0}
          resolutionScale={0.5}
        />
      </div>
      <div className="pointer-events-none fixed right-0 top-[5vh] h-[90vh] w-full sm:w-1/2">
        <TechStackSpiral items={techStack} />
      </div>
      <div className="relative flex flex-col items-center justify-center lg:flex-row mt-32 sm:mt-36 lg:mt-40 gap-10 lg:gap-12 w-full max-w-300">
        <ElectricBorder
          color="#7df9ff"
          speed={1}
          chaos={0.12}
          borderRadius={30}
          className="rounded-[30px] w-full max-w-80 sm:max-w-95 lg:w-95 shrink-0"
        >
          <div className="w-full">
            <ProfileCard
              name="CHRIS BELGA"
              title=""
              handle="javicodes"
              status="Online"
              contactText="Contact Me"
              avatarUrl="/my_picture.png"
              avatarUrls={[
                { src: "/my_picture.png", position: "50% 50%" },
                { src: "/profile/chris-hoodie.jpg", position: "25% 50%" },
              ]}
              slideInterval={10000}
              showUserInfo={false}
              showName={false}
              enableTilt={true}
              enableMobileTilt={true}
              onContactClick={() => console.log("Contact clicked")}
              behindGlowColor="rgba(125, 190, 255, 0.67)"
              iconUrl="/iconpattern.png"
              behindGlowEnabled
              innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
            />
          </div>
        </ElectricBorder>
        <div className="w-full min-w-0 lg:flex-1">
          <CoderProfileCard />
        </div>
      </div>
      <section id="services" className="relative mt-24 sm:mt-32 w-full max-w-300">
        <SectionHeading title="SERVICES" subtitle="What I can build for you." />
        <div className="mt-10">
          <Services />
        </div>
      </section>
      <section id="ventures" className="relative mt-24 sm:mt-32 w-full max-w-300">
        <SectionHeading title="VENTURES" subtitle="Companies and products I've co-founded and built." />
        <div className="mt-10">
          <VentureGrid projects={projects} />
        </div>
      </section>
      <div className="mt-24 sm:mt-32 w-full flex justify-center">
        <ContactFooter />
      </div>
      <GradualBlur
        target="page"
        position="bottom"
        height="7rem"
        strength={2}
        divCount={2}
        curve="bezier"
        exponential
        opacity={1}
      />
      <TargetCursor />
    </main>
  );
}
