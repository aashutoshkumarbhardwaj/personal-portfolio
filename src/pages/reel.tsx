// pages/reel.tsx
import React, { useEffect, useState } from 'react';
import MuxPlayer from "@mux/mux-player-react";
import { getReels } from '../queries/getreels';
import { Reel } from '../types';
import './reel.css';

const ReelsPage: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeReelId, setActiveReelId] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const reelsData = await getReels();
        setReels(reelsData);
      } catch (err) {
        setError('Error fetching reels.');
        console.error(err);
      }
    };

    fetchReels();
  }, []);

  // refs to the MuxPlayer DOM nodes keyed by reel id
  const playersRef = React.useRef<Record<string, HTMLElement | null>>({});
  const sectionsRef = React.useRef<Record<string, HTMLElement | null>>({});

  React.useEffect(() => {
    const playElement = async (el: HTMLElement | null) => {
      if (!el) return;
      const anyEl = el as any;
      try {
        if (typeof anyEl.play === 'function') {
          await anyEl.play();
        } else {
          const vid: HTMLVideoElement | null = el.querySelector('video');
          if (vid) await vid.play();
        }
      } catch (e) {
        // autoplay might be blocked; Mux player will still be present muted
      }
    };

    const pauseElement = (el: HTMLElement | null) => {
      if (!el) return;
      const anyEl = el as any;
      if (typeof anyEl.pause === 'function') {
        try { anyEl.pause(); } catch (e) {}
      } else {
        const vid: HTMLVideoElement | null = el.querySelector('video');
        if (vid) try { vid.pause(); } catch (e) {}
      }
    };

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        // Play the element that is mostly in view and pause others
        // Also pick the entry with the largest intersectionRatio to be the active reel
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.id;
          if (!id) return;
          const playerEl = playersRef.current[id];
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            playElement(playerEl);
          } else {
            pauseElement(playerEl);
          }
        });

        // Choose the most visible intersecting entry as active
        const visible = entries
          .filter((e) => e.isIntersecting && !!(e.target as HTMLElement).dataset.id)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const bestEntry = visible[0];
        const bestId = bestEntry ? ((bestEntry.target as HTMLElement).dataset.id ?? null) : null;
        setActiveReelId(bestId);
      },
      { threshold: [0.0, 0.25, 0.5, 0.75, 1.0] }
    );

    // Observe all section elements
    Object.values(sectionsRef.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [reels]);

  return (
    <div className="reel-feed reels-container">
      {error && <p className="error">{error}</p>}

      {reels.map((reel) => {
        const playbackId = reel.reel?.playbackId;
        if (!playbackId) return null;

        return (
          <section
            key={reel.id}
            className="reel h-screen snap-start relative"
            data-id={reel.id}
            ref={(el: HTMLElement | null) => (sectionsRef.current[reel.id] = el)}
          >
            <MuxPlayer
              ref={(el: HTMLElement | null) => (playersRef.current[reel.id] = el)}
              playbackId={playbackId}
              startTime={(reel as any).coverTimestamp ?? 0}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </section>
        );
      })}

      {/* Global fixed overlay that updates based on the active reel */}
      {activeReelId && (
        (() => {
          const active = reels.find((r) => r.id === activeReelId);
          if (!active) return null;
          return (
            <div className="global-reel-overlay">
              <div className="reel-overlay-inner">
                <h3 className="reel-title">{active.title}</h3>
                {active.caption && <p className="reel-caption">{active.caption}</p>}
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
};

export default ReelsPage;
