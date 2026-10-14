"use client";

import { useNews } from "@/hooks/useNews";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function NewsSection() {
  const { data: posts, isLoading } = useNews();

  if (isLoading || !posts?.length) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
      <SectionHeading
        eyebrow="Our Newsroom"
        title="Today’s News Update"
        align="center"
        intro="What’s happening at Nkem Aeronautics, and across the drone industry."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 6).map((post, index) => (
          <Reveal key={post.id} delay={index * 100}>
            <article className="h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
              {post.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.imageUrl} alt={post.title} className="w-full" />
              )}
              <div className="p-5">
                <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-medium capitalize text-brand-blue">
                  {post.category}
                </span>
                <h3 className="mt-3 font-display text-base font-normal tracking-tight text-brand-black">{post.title}</h3>
                {post.summary && <p className="mt-2 text-sm text-muted-foreground">{post.summary}</p>}
                <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
