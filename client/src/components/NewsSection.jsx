"use client";

import { useNews } from "@/hooks/useNews";
import { Reveal } from "@/components/Reveal";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function NewsSection() {
  const { data: posts, isLoading } = useNews();

  if (isLoading || !posts?.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <h2 className="text-2xl font-bold text-brand-navy-dark sm:text-3xl">News &amp; Updates</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          What&rsquo;s happening at Nkem Aeronautics, and across the drone industry.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 6).map((post, index) => (
          <Reveal key={post.id} delay={index * 100}>
            <article className="h-full overflow-hidden rounded-xl border border-border bg-background">
              {post.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.imageUrl} alt={post.title} className="w-full" />
              )}
              <div className="p-5">
                <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-medium capitalize text-brand-blue">
                  {post.category}
                </span>
                <h3 className="mt-3 font-semibold text-brand-navy-dark">{post.title}</h3>
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
