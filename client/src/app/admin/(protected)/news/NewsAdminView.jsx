"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAdminNews, useCreateNews, useDeleteNews, useUpdateNews } from "@/hooks/useNews";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/portal/FileUpload";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

const EMPTY_FORM = { title: "", category: "company", summary: "", body: "", imageUrl: "" };

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function NewsAdminView() {
  const { data: posts, isLoading, isError, error } = useAdminNews();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  function removePost(post) {
    if (!window.confirm(`Delete "${post.title}"? This removes it from the website permanently.`)) return;
    deleteNews.mutate(post.id);
  }
  const [form, setForm] = useState(EMPTY_FORM);

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createNews.mutate(form, { onSuccess: () => setForm(EMPTY_FORM) });
        }}
        className="space-y-4 rounded-2xl border border-border bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <input className={fieldClass} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <select className={fieldClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="company">Company</option>
              <option value="industry">Industry</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Image <span className="font-normal text-muted-foreground">(shown on the homepage card)</span></Label>
          <FileUpload
            admin
            purpose="news"
            accept="image/*"
            maxFiles={1}
            value={form.imageUrl ? [{ id: "current", url: form.imageUrl, mimeType: "image/*", originalName: "image" }] : []}
            onChange={(files) => setForm({ ...form, imageUrl: files[0]?.url || "" })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Summary <span className="font-normal text-muted-foreground">(shown on the homepage card)</span></Label>
          <input className={fieldClass} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Body</Label>
          <textarea rows={4} className={fieldClass} required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        </div>
        {createNews.isError && <p className="text-sm text-destructive">{createNews.error.message}</p>}
        <Button type="submit" disabled={createNews.isPending} className="bg-brand-navy text-white hover:bg-brand-navy/90">
          {createNews.isPending ? "Publishing…" : "Publish post"}
        </Button>
      </form>

      {isLoading && <p className="text-sm text-muted-foreground">Loading posts…</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {!isLoading && !isError && (
        <div className="space-y-2">
          {deleteNews.isError && <p className="text-sm text-destructive">{deleteNews.error.message}</p>}
          {posts?.length === 0 && <p className="text-sm text-muted-foreground">No posts yet — publish one above.</p>}
          {posts?.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white px-5 py-4 shadow-sm">
              <div>
                <p className="font-medium text-brand-navy-dark">{post.title}</p>
                <p className="text-xs text-muted-foreground">{post.category} · {formatDate(post.publishedAt)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateNews.mutate({ id: post.id, isPublished: !post.isPublished })}
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    post.isPublished
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  {post.isPublished ? "Published" : "Hidden"}
                </button>
                <button
                  type="button"
                  onClick={() => removePost(post)}
                  disabled={deleteNews.isPending}
                  aria-label={`Delete ${post.title}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive disabled:opacity-50"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
