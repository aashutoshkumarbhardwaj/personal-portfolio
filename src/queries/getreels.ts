import datoCMSClient from './datoCMSClient';
import { Reel } from '../types';

const GET_REELS = `query Reels {
  allReels(orderBy: order_ASC) {
    id
    title
    caption
    muxplaybackid
    covertimestamp
    tags
  }
}

`;

type RawReel = {
  id?: string;
  title?: string;
  caption?: string;
  muxplaybackid?: string;
  covertimestamp?: string;
  tags?: string[];
};

export async function getReels(): Promise<Reel[]> {
  // Don't force the GraphQL response into our UI type; map it explicitly.
  const data = await datoCMSClient.request<{ allReels: RawReel[] }>(GET_REELS);

  return (data.allReels || []).map((r) => ({
    id: r.id ?? '',
    title: r.title ?? '',
    caption: r.caption ?? '',
    // DatoCMS returns snake_case like `muxplaybackid` — map it to the UI's camelCase shape
    reel: {
      playbackId: r.muxplaybackid ?? '',
    },
    // Map covertimestamp (string) to a numeric coverTimestamp on the returned object
    coverTimestamp: r.covertimestamp ? Number(r.covertimestamp) : 0,
  }));
}

