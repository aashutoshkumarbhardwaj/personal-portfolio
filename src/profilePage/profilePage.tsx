import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import './ProfilePage.css';

import ProfileBanner from './ProfileBanner';
import TopPicksRow from './TopPicksRow';
import ContinueWatching from './ContinueWatching';

type ProfileType = 'recruiter' | 'developer' | 'reel' | 'adventure';

const ProfilePage: React.FC = () => {
  const location = useLocation();
  const backgroundGif = location.state?.backgroundGif || "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif"; // Default GIF
  const { profileName } = useParams<{ profileName: string }>();

  const profile = profileName && ['recruiter', 'developer', 'reel', 'adventure'].includes(profileName)
    ? (profileName as ProfileType)
    : 'recruiter';
  return (
    <>
      <div
        className="profile-page"
        style={{ backgroundImage: `url(${backgroundGif})` }}
      >
        <ProfileBanner
        />
      </div>
      <TopPicksRow profile={profile} />
      <ContinueWatching profile={profile} />

      {/* For Adventure profile, provide a button/link to view reels (opens the reels page) */}
      {profile === 'adventure' && (
        <div style={{ padding: '20px 16px' }}>
          <Link to="/reels" className="view-reels-button">
            View Reels
          </Link>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
