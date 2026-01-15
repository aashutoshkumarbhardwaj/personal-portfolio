import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";

/* =======================
   ENV VALIDATION
======================= */
if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL missing");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* =======================
   THREADS (BEST EFFORT – MAY BE EMPTY IN CI)
======================= */
async function fetchThreads() {
  try {
    const res = await fetch("https://www.threads.net/@aashutoshpandeyy", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!res.ok) return [];

    const html = await res.text();
    const match = html.match(/"thread_items":(\[.*?\])/s);
    if (!match) return [];

    const items = JSON.parse(match[1]);

    return items
      .map(item => ({
        platform: "threads",
        content: item?.post?.caption?.text || "",
        post_url: `https://www.threads.net/@aashutoshpandeyy/post/${item?.post?.code}`,
        created_at: new Date(item?.post?.taken_at * 1000).toISOString(),
        media_urls: [],
        likes: 0,
        comments: 0,
        shares: 0
      }))
      .filter(p => p.content && p.post_url);
  } catch (e) {
    console.warn("Threads skipped:", e.message);
    return [];
  }
}


/* =======================
   TELEGRAM (PUBLIC RSS ONLY)
======================= */
const parser = new Parser();

async function fetchTelegram() {
  try {
    // MUST be public channel
    const feed = await parser.parseURL(
      "https://t.me/twitterering"
    );

    return feed.items
      .map(item => ({
        platform: "telegram",
        content: item.contentSnippet || item.title || "",
        post_url: item.link,
        created_at: item.pubDate
          ? new Date(item.pubDate).toISOString()
          : new Date().toISOString(),
        media_urls: [],
        likes: 0,
        comments: 0,
        shares: 0
      }))
      .filter(p => p.content && p.post_url);
  } catch (e) {
    console.warn("Telegram skipped:", e.message);
    return [];
  }
}

/* =======================
   SAVE TO SUPABASE (HARD FAIL ON ZERO INSERT)
======================= */
async function savePosts(posts) {
  if (!posts.length) {
    throw new Error("savePosts called with empty array");
  }

  const { data, error } = await supabase
    .from("posts")
    .upsert(posts, {
      onConflict: "platform,post_url",
      returning: "representation"
    });

  if (error) {
    throw new Error("Supabase insert failed: " + error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("Upsert ran but inserted ZERO rows");
  }

  console.log(`Inserted/updated ${data.length} rows`);
}

/* =======================
   RUN JOB (FAIL-FAST, CI-SAFE)
======================= */
async function run() {
  console.log("Starting fetch job");

  const results = await Promise.allSettled([
    fetchThreads(),
    fetchTelegram()
  ]);

  console.log(
    "Fetched breakdown:",
    results.map(r =>
      r.status === "fulfilled" ? r.value.length : "failed"
    )
  );

  const posts = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value);

  if (posts.length === 0) {
    console.warn("No posts fetched from any source — skipping insert");
    return;
  }

  console.log("Payload sample:", posts[0]);
  console.log("Total fetched:", posts.length);

  await savePosts(posts);

  console.log("Job finished successfully");
}
