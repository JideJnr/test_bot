import { fetchTodayMatches } from '../../runners/sportybet';
import { saveToDB } from '../../db/save';

import { RawMatch, CleanedMatch } from '../../type/types';
import { BasicMatchCleaner } from '../../cleaners';



export async function today() {
  // 1. Scrape
  const rawMatches: RawMatch[] = await fetchTodayMatches();

  // 2. Clean
  const cleaner = new BasicMatchCleaner();
  const cleanedMatches: CleanedMatch[] = rawMatches.map((match: RawMatch) =>
    cleaner.clean(match)
  );

  await saveToDB(cleanedMatches);

  console.log('Pipeline complete.');
}

