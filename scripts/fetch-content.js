import fetch from "node-fetch";
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
   THREADS (BEST EFFORT)
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

    return items.map(item => ({
      platform: "threads",
      content: item?.post?.caption?.text || "",
      post_url: `https://www.threads.net/@aashutoshpandeyy/post/${item?.post?.code}`,
      created_at: new Date(item?.post?.taken_at * 1000),
      media_urls: [],
      likes: 0,
      comments: 0,
      shares: 0
    })).filter(p => p.content && p.post_url);
  } catch (e) {
    console.warn("Threads skipped:", e.message);
    return [];
  }
}

/* =======================
   REDDIT (STABLE)
======================= */
async function fetchReddit() {
  try {
    const res = await fetch(
      "https://www.reddit.com/user/iinaayate.json",
      {
        headers: {
          "User-Agent": "personal-portfolio-fetcher by u/iinaayate"
        }
      }
    );

    if (!res.ok) return [];

    const json = await res.json();

    return json.data.children.map(p => ({
      platform: "reddit",
      content: p.data.title,
      post_url: "https://reddit.com" + p.data.permalink,
      created_at: new Date(p.data.created_utc * 1000),
      media_urls: [],
      likes: p.data.ups || 0,
      comments: p.data.num_comments || 0,
      shares: 0
    }));
  } catch (e) {
    console.error("Reddit failed:", e.message);
    return [];
  }
}

/* =======================
   TELEGRAM (RSS)
======================= */
const parser = new Parser();

async function fetchTelegram() {
  try {
    const feed = await parser.parseURL(
      "https://t.me/+g98jinaZsVk3ODll"
    );

    return feed.items.map(item => ({
      platform: "telegram",
      content: item.contentSnippet || item.title || "",
      post_url: item.link,
      created_at: item.pubDate
        ? new Date(item.pubDate)
        : new Date(),
      media_urls: [],
      likes: 0,
      comments: 0,
      shares: 0
    })).filter(p => p.content && p.post_url);
  } catch (e) {
    console.warn("Telegram skipped:", e.message);
    return [];
  }
}

/* =======================
   SAVE TO SUPABASE
======================= */
async function savePosts(posts) {
  if (!posts.length) {
    console.log("No posts to save");
    return;
  }

  const { error } = await supabase
    .from("posts")
    .upsert(posts, {
      onConflict: "platform,post_url"
    });

  if (error) {
    throw new Error("Supabase insert failed: " + error.message);
  }

  console.log(`Saved ${posts.length} posts`);
}

/* =======================
   RUN JOB (CI SAFE)
======================= */
async function run() {
  console.log("Starting fetch job");

  const results = await Promise.allSettled([
    fetchThreads(),
    fetchReddit(),
    fetchTelegram()
  ]);

  const posts = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value);

  console.log("Total fetched:", posts.length);

  await savePosts(posts);

  console.log("Job finished successfully");
}

run();
