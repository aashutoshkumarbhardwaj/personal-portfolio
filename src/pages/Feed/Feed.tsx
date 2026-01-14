import React from "react";
import "./Feed.css";

const Feed = () => {
  return (
    <div className="feed-container">
      <header className="feed-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 className="feed-title">My Socials</h1>
            <div className="feed-subtitle">All my Threads, Reddit & Telegram updates in one timeline</div>
          </div>

          <div>
            <button className="refresh-btn" onClick={() => window.location.reload()} title="Refresh">
              ↻
            </button>
          </div>
        </div>
      </header>

      <main className="posts-list">
        <article className="post">
          <div className="post-avatar">
            <span className="avatar-initial">A</span>
          </div>

          <div className="post-content">
            <div className="post-meta">
              <div className="meta-user">
                <span className="display-name">Aashutosh</span>
                <span className="handle">@aashutosh</span>
              </div>
              <div className="meta-extra">
                <span className="platform-badge threads">Threads</span>
                <span className="dot">·</span>
                <time className="time">2h</time>
              </div>
            </div>

            <div className="post-text">
              Building a portfolio that auto-syncs my content from Threads,
              Reddit, and Telegram using Supabase + SQL. No hardcoding.
            </div>

            <div className="post-actions">
              <button className="action like" aria-label="Like">
                <HeartIcon /> <span className="count">120</span>
              </button>
              <button className="action comment" aria-label="Comment">
                <ChatIcon /> <span className="count">14</span>
              </button>
              <button className="action repost" aria-label="Repost">
                <RepostIcon /> <span className="count">6</span>
              </button>
              <button className="action share" aria-label="Share">
                <ShareIcon />
              </button>
            </div>
          </div>
        </article>

        <article className="post">
          <div className="post-avatar">
            <div className="avatar-image" style={{backgroundImage: 'url(/logo192.png)'}}></div>
          </div>

          <div className="post-content">
            <div className="post-meta">
              <div className="meta-user">
                <span className="display-name">Portfolio Bot</span>
                <span className="handle">@portfolio</span>
              </div>
              <div className="meta-extra">
                <span className="platform-badge reddit">Reddit</span>
                <span className="dot">·</span>
                <time className="time">1d</time>
              </div>
            </div>

            <div className="post-text">
              Sync complete — imported latest thread and replies. Displaying in a
              concise timeline view.
            </div>

            <div className="post-actions">
              <button className="action like" aria-label="Like">
                <HeartIcon /> <span className="count">8</span>
              </button>
              <button className="action comment" aria-label="Comment">
                <ChatIcon /> <span className="count">2</span>
              </button>
              <button className="action repost" aria-label="Repost">
                <RepostIcon /> <span className="count">1</span>
              </button>
              <button className="action share" aria-label="Share">
                <ShareIcon />
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

// Simple SVG icons for better scalability and appeal [web:3][web:6]
const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>
);

const RepostIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 4l-1.41 1.41 4.58 4.59H8c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h10.17l-4.58 4.59L17 20l6-6zM4 4h8c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1zm0 12h8c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1z"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
  </svg>
);

export default Feed;
