import React, { useState, useEffect, useCallback } from 'react';
import { getTweets } from '../queries/gettweet';
import { Post } from '../types';
import ErrorBoundary from '../components/ErrorBoundary';
import './Feed/Feed.css'; // fixed path to Feed CSS

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await getTweets();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to load feed. Please refresh.');
      console.error('Feed fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleRefresh = () => fetchPosts();

  if (loading) {
    return (
      <div className="feed-container">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-post"></div>
          <div className="skeleton-post"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <header className="feed-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 className="feed-title">My Socials</h1>
            <div className="feed-subtitle">All my Threads, Reddit & Telegram updates in one timeline</div>
          </div>

          <div>
            <button className="refresh-btn" onClick={handleRefresh} aria-label="Refresh feed" title="Refresh">
              ↻
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button className="retry-btn" onClick={handleRefresh}>Retry</button>
        </div>
      )}

      <main className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <h2>No posts yet</h2>
            <p>Connect your Threads, Reddit, or Telegram to see content here.</p>
            <button className="connect-btn">Connect Accounts</button>
          </div>
        ) : (
          posts.map((post, idx) => {
            // Defensive defaults in case Supabase returns null/undefined fields
            const author = typeof post?.author === 'string' && post.author.trim() !== '' ? post.author : 'Aashutosh';
            const avatar = post?.avatar ?? null;
            const platform = typeof post?.platform === 'string' ? post.platform : 'Unknown';
            const content = post?.content ?? '';
            const created = post?.created_at ?? '';
            const key = post?.post_url ?? `${created || 'no-date'}-${idx}`;
            const authorInitial = author.charAt(0).toUpperCase();

            return (
              <article key={key} className="post">
                <div className="post-avatar">
                  {avatar ? (
                    <div
                      className="avatar-image"
                      style={{ backgroundImage: `url(${avatar})` }}
                      role="img"
                      aria-label={author}
                    />
                  ) : (
                    <span className="avatar-initial">{authorInitial}</span>
                  )}
                </div>

                <div className="post-content">
                  <div className="post-meta">
                    <div className="meta-user">
                      <span className="display-name">{author}</span>
                      <span className="handle">@{author.toLowerCase().replace(/\s+/g, '')}</span>
                    </div>
                    <div className="meta-extra">
                      <span className={`platform-badge ${platform.toLowerCase()}`}>
                        {platform}
                      </span>
                      <span className="dot">·</span>
                      <time className="time">{created ? new Date(created).toLocaleString() : '—'}</time>
                    </div>
                  </div>

                  <div className="post-text">{content}</div>

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
            );
          })
        )}
      </main>

      <div className="feed-footer">
        <p>Synced from Threads, Reddit & Telegram via Supabase ✨</p>
      </div>
    </div>
  );
};

// Inline SVG icons (same as previous)
const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>
);

const RepostIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17 4l-1.41 1.41 4.58 4.59H8c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h10.17l-4.58 4.59L17 20l6-6zM4 4h8c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1zm0 12h8c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1z"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
  </svg>
);

// Wrap Feed with an ErrorBoundary to capture render-time exceptions
export default function TweetsPage() {
  return (
    <ErrorBoundary>
      <Feed />
    </ErrorBoundary>
  );
}
