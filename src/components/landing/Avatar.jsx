
import { motion } from "framer-motion";

export default function Avatar({ person }) {
  const {
    x,
    y,
    src,
    alt = "",
    delay = 0,
  } = person;

  return (
    <motion.div
      className="
        absolute
        z-10
        aspect-square
        overflow-hidden
        rounded-full
        border-2
        border-[#fbf8ef]
        shadow-xl
        dark:border-[#17140d]
      "
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: "clamp(48px, 6vw, 100px)",
      }}
      animate={{
        y: [0, -12, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </motion.div>
  )
}