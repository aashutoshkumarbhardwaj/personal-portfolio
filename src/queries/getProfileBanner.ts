// queries/getProfileBanner.ts
import datoCMSClient from './datoCMSClient';
import { ProfileBanner } from '../types';

const GET_PROFILE_BANNER = `
{
  profileBanner {
    headline
    backgroundImage {
      url
    }
    resumeLink 
    linkedinLink
    profileSummary
  }
}
`;

 

export async function getProfileBanner(): Promise<ProfileBanner> {
  const data = await datoCMSClient.request<{ profileBanner: ProfileBanner }>(GET_PROFILE_BANNER);
  console.log("🚀 ~ getProfileBanner ~ data:", data)
  return data.profileBanner;
}
