import Banner from "@/app/components/Banner/banner";
import About from "@/app/components/About/about";
import Contact from "@/app/components/Contact";
import Process from "@/app/components/Process";

export default function DashboardFeature() {
  return (
    <div className="flex flex-col scroll-smooth gap-y-10 min-h-screen items-center p-6 bg-transparent pt-[74px] relative overflow-y-auto scrollbar-none">
      <Banner />
      <About />
      <Process />
      <Contact />
    </div>
  );
}
