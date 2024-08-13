import React from "react";

export default function Summary() {
  return (
    <section id="about-me" className="mb-16 md:mb-24 lg:mb-36">
      <p className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-inherit px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:hidden">
        ABOUT
      </p>
      <p className="text-slate-400 mb-4">
        In 2020, I made a significant transition from
        <span className="font-medium text-white">
          {" "}
          Mechanical Engineering
        </span>{" "}
        to
        <span className="font-medium text-white"> web development</span>, driven
        by a deep-seated <span className="font-medium text-white">passion</span>{" "}
        for transforming ideas into impactful digital experiences. Since then I
        have fully immersed myself in
        <span className="font-medium text-white"> coding</span>, tackling
        projects that <span className="font-medium text-white">challenge</span>{" "}
        and <span className="font-medium text-white">inspire</span> me.
      </p>
      <p className="text-slate-400 mb-4">
        Currently, I am thriving as a
        <span className="font-medium text-white"> freelancer</span> on Upwork,
        where I continuously seek new opportunities and push the boundaries of
        web development. My journey into this field was fueled by a desire to
        create solutions that seamlessly integrate
        <span className="font-medium text-white"> creativity</span> with
        technology.
      </p>
      <p className="text-slate-400">
        Beyond my professional pursuits, I enjoy{" "}
        <span className="font-medium text-white"> playing chess</span>, going to
        the gym, and indulging in video and mobile games—activities that keep my
        mind sharp, my body active, and my creativity flowing.
      </p>
    </section>
  );
}
