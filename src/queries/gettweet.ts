import { supabase } from '../lib/supabaseClient';
import { Post } from '../types';

export const getTweets = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
};