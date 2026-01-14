async function fetchThreads() {
  try {
    const res = await fetch("https://www.threads.net/@aashutoshpandeyy", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!res.ok) return [];

    const html = await res.text();

    // safer regex (non-greedy + dotAll)
    const match = html.match(/"thread_items":(\[.*?\])/s);
    if (!match) return [];

    const items = JSON.parse(match[1]);

    return items.map(item => ({
      platform: "threads",
      content: item.post?.caption?.text || "",
      post_url: `https://www.threads.net/@aashutoshpandeyy/post/${item.post.code}`,
      created_at: new Date(item.post.taken_at * 1000),
      media_urls: [],
      likes: 0,
      comments: 0,
      shares: 0
    }));
  } catch (e) {
    console.error("Threads fetch failed:", e.message);
    return [];
  }
}

async function fetchReddit() {
  try {
    const res = await fetch(
      "https://www.reddit.com/user/iinaayate.json",
      { headers: { "User-Agent": "portfolio-bot/1.0" } }
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
    console.error("Reddit fetch failed:", e.message);
    return [];
  }
}


import Parser from "rss-parser";
const parser = new Parser();

async function fetchTelegram() {
  try {
    const feed = await parser.parseURL(
      "https://t.me/s/YOUR_CHANNEL_NAME"
    );

    return feed.items.map(item => ({
      platform: "telegram",
      content: item.contentSnippet || item.title || "",
      post_url: item.link,
      created_at: item.pubDate ? new Date(item.pubDate) : null,
      media_urls: [],
      likes: 0,
      comments: 0,
      shares: 0
    }));
  } catch (e) {
    console.error("Telegram fetch failed:", e.message);
    return [];
  }
}


import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function savePosts(posts) {
  if (!posts.length) {
    console.log("No posts to save");
    return;
  }

  const { error } = await supabase
    .from("posts")
    .upsert(posts, { onConflict: "platform,post_url" });

  if (error) {
    console.error("Supabase error:", error.message);
  } else {
    console.log(`Saved ${posts.length} posts`);
  }
}

async function run() {
  console.log("Starting fetch job...");

  const threads = await fetchThreads();
  console.log("Threads:", threads.length);

  const reddit = await fetchReddit();
  console.log("Reddit:", reddit.length);

  const telegram = await fetchTelegram();
  console.log("Telegram:", telegram.length);

  const all = [...threads, ...reddit, ...telegram];
  console.log("Total posts:", all.length);

  await savePosts(all);

  console.log("Fetch job completed");
}

run();
