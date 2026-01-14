declare module '*.mp3' {
  const src: string;
  export default src;
}

// Allow importing @mux/mux-player-react when type definitions are not available
declare module '@mux/mux-player-react';