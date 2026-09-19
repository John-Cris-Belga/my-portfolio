import BackgroundEffects from "@/components/BackgroundEffects";
import ProfileCard from "@/components/ProfileCard";
import ElectricBorder from "@/components/ElectricBorder";
import GradualBlur from "@/components/GradualBlur";
import CoderProfileCard from "@/components/CoderProfileCard";
import VentureGrid from "@/components/VentureGrid";
import BorderGlow from "@/components/BorderGlow";
import ProjectCard from "@/components/ProjectCard";
import Services from "@/components/Services";
import ContactFooter from "@/components/ContactFooter";
import { projects } from "@/lib/projects";

// Type scale used across the page (largest to smallest):
//   h2 section headline · lead text · h3 card title · body · small labels (never dimmer than gray-400).
// A server component: the static sections ship as HTML with no JavaScript to download or hydrate.
// Only the interactive pieces (marked "use client") run in the browser.

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance text-white">{title}</h2>
      <p className="mt-3 text-base sm:text-lg text-gray-400">{subtitle}</p>
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
      <BackgroundEffects />
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
              avatarUrl="/profile/chris-portrait.webp"
              avatarUrls={[
                { src: "/profile/chris-portrait.webp", position: "50% 50%" },
                { src: "/profile/chris-hoodie.webp", position: "25% 50%" },
              ]}
              slideInterval={10000}
              showUserInfo={false}
              showName={false}
              enableTilt={true}
              enableMobileTilt={true}
              behindGlowColor="rgba(125, 190, 255, 0.67)"
              iconUrl="/iconpattern.webp"
              behindGlowEnabled
              innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
            />
          </div>
        </ElectricBorder>
        <div className="w-full min-w-0 lg:flex-1">
          <CoderProfileCard />
        </div>
      </div>
      <section id="services" className="[content-visibility:auto] relative mt-24 sm:mt-32 w-full max-w-300 [contain-intrinsic-size:auto_740px] sm:[contain-intrinsic-size:auto_480px] lg:[contain-intrinsic-size:auto_300px]">
        <SectionHeading title="Services" subtitle="What I can build for you." />
        <div className="mt-10">
          <Services />
        </div>
      </section>
      {/* data-cursor="native": the custom target cursor steps aside here; the tile hover effects stay. */}
      <section id="ventures" data-cursor="native" className="relative mt-24 sm:mt-32 w-full max-w-300">
        <SectionHeading title="Ventures" subtitle="Companies and products I've co-founded and built." />
        {/* Extra room around the grid so the skipped-render clip doesn't cut off the card glows. */}
        <div className="[content-visibility:auto] -mx-12 -mb-12 -mt-2 p-12 [contain-intrinsic-size:auto_1610px] md:[contain-intrinsic-size:auto_1100px] lg:[contain-intrinsic-size:auto_590px]">
          <VentureGrid>
            {projects.map((project) => (
              <BorderGlow
                key={project.url}
                className="venture-card"
                backgroundColor="#07081a"
                borderRadius={14}
                glowRadius={32}
                glowColor={project.glow}
                colors={[project.accent, "#c084fc", "#38bdf8"]}
                style={{ "--accent": project.accent }}
              >
                <ProjectCard project={project} />
              </BorderGlow>
            ))}
          </VentureGrid>
        </div>
      </section>
      <div className="[content-visibility:auto] mt-24 sm:mt-32 w-full flex justify-center [contain-intrinsic-size:auto_420px]">
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
    </main>
  );
}
