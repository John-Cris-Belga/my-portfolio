import { SiHubspot } from "react-icons/si";
import { TbAutomation, TbDeviceDesktopCode, TbWorldWww } from "react-icons/tb";

const services = [
  { icon: TbDeviceDesktopCode, title: "Custom Systems", text: "Booking, inventory, and other systems that run your business.", color: "text-cyan-400" },
  { icon: SiHubspot, title: "HubSpot", text: "CRM setup, workflows, and admin.", color: "text-[#FF7A59]" },
  { icon: TbAutomation, title: "Automations", text: "Connect your tools. Cut the busywork.", color: "text-green-400" },
  { icon: TbWorldWww, title: "Business Websites", text: "Websites that make your business look credible and bring in clients.", color: "text-violet-400" },
];

const Services = () => (
  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {services.map(({ icon: Icon, title, text, color }) => (
      <li
        key={title}
        className="rounded-lg border border-[#1b2c68a0] bg-linear-to-br from-black/40 to-[#0a0d37]/40 p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-500/60"
      >
        <Icon className={`h-7 w-7 ${color}`} aria-hidden="true" />
        <h3 className="mt-4 font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">{text}</p>
      </li>
    ))}
  </ul>
);

export default Services;
