"use client";

import { AnimatePresence, motion } from "framer-motion";

import { formatPostDate } from "app/utils/dates";
import { Post } from "app/types";
import { FadeIn } from "app/ui/fade-in";
import Link from "next/link";
import { useState } from "react";

export function BlogPostItem({
  post,
  disableLinks,
  index,
}: {
  post: Post;
  disableLinks?: boolean;
  index: number;
}) {
  const date = formatPostDate(post.published_at);
  const [rightText, setRightText] = useState(date);

  return (
    <motion.div
      onMouseEnter={() => setRightText("Read more →")}
      onMouseLeave={() => setRightText(date)}
    >
      <FadeIn delay={index * 0.05} key={post.slug}>
        <Link
          className="group grid p-2 transition-all hover:bg-zinc-50 sm:rounded-lg"
          key={post.slug}
          href={disableLinks ? "#" : `/${post.slug}`}
        >
          <div className="grid flex-wrap items-center justify-between sm:flex">
            <span className="text-zinc-700 group-hover:text-zinc-950">
              {post.title}
            </span>
            {/* <AnimatePresence mode="popLayout"> */}
            <motion.div
              key={rightText}
              animate={{
                opacity: 1,
                y: 0,
              }}
              initial={{
                opacity: 0,
                y: 20,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="flex gap-2 overflow-hidden text-right font-mono text-xs tracking-tight text-zinc-400"
            >
              {rightText}
            </motion.div>
            {/* </AnimatePresence> */}
          </div>
          {post.abstract && (
            <p className="font-mono text-xs text-zinc-500">{post.abstract}</p>
          )}
        </Link>
      </FadeIn>
    </motion.div>
  );
}
