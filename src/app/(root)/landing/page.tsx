"use client"
import { motion } from "framer-motion";
import Banner from "@/app/components/Banner/banner";
import About from "@/app/components/About/about";
import Contact from "@/app/components/Contact";
import Process from "@/app/components/Process";

export default function Landing() {
  // Animation variants for the container and children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger children animations by 0.2 seconds
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="flex flex-col scroll-smooth gap-y-10 min-h-screen items-center p-6 bg-transparent pt-[74px] relative overflow-y-auto scrollbar-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={childVariants} className="w-full">
        <Banner />
      </motion.div>
      <motion.div variants={childVariants} className="w-full">
        <About />
      </motion.div>
      <motion.div variants={childVariants} className="w-full">
        <Process />
      </motion.div>
      <motion.div variants={childVariants} className="w-full">
        <Contact />
      </motion.div>
    </motion.div>
  );
}
