import React from 'react';
import './PostCard.css';

interface PostCardProps {
  platform?: string;
  content?: string;
  author?: string;
  avatar?: string | null;
}

const PostCard: React.FC<PostCardProps> = ({ platform = 'Unknown', content = '', author = 'Unknown', avatar = null }) => {
  const platformClass = typeof platform === 'string' ? platform.toLowerCase().replace(/[^a-z0-9\-]/g, '') : 'unknown';
  const avatarSrc = avatar || '/logo192.png';

  return (
    <div className={`post-card ${platformClass}`}>
      <div className="post-card-header">
        <img src={avatarSrc} alt={`${author}'s avatar`} className="post-card-avatar" />
        <span className="post-card-author">{author}</span>
        <span className="post-card-platform">{platform}</span>
      </div>
      <div className="post-card-content">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default PostCard;
