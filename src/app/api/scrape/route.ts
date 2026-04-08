import { NextResponse } from 'next/server';
import { z } from 'zod';
import axios from 'axios';
import { mockProfile } from '@/lib/mock-data';
import { getCachedProfile, setCachedProfile } from '@/lib/cache';
import { parseApifyProfile } from '@/lib/apify-parser';

const RequestSchema = z.object({
  url: z.string().url().startsWith('https://www.linkedin.com/in/', { 
    message: 'Must be a valid LinkedIn profile URL starting with https://www.linkedin.com/in/' 
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = RequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues }, { status: 400 });
    }

    const { url } = validationResult.data;

    // Secure bypassing organically driving local mock setups transparently!
    if (process.env.USE_MOCK_DATA === 'true') {
      return NextResponse.json(mockProfile);
    }

    const cached = getCachedProfile(url);
    if (cached) {
      console.log(`[Cache Hit] Serving ${url} from 1-hour memory bounds.`);
      return NextResponse.json(cached);
    }

    if (!process.env.APIFY_API_TOKEN) {
      return NextResponse.json({ error: 'Apify API Key missing. Please set APIFY_API_TOKEN in .env.local' }, { status: 500 });
    }

    let person: any = null;

    try {
      // Execute REST proxy seamlessly trapping failures 
      const apifyUrl = `https://api.apify.com/v2/acts/harvestapi~linkedin-profile-scraper/run-sync-get-dataset-items`;
      const response = await axios.post(apifyUrl, { urls: [url] }, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.APIFY_API_TOKEN}`,
        }
      });
      
      const items = response.data;
      if (Array.isArray(items) && items.length > 0) person = items[0];
    } catch (apiError: any) {
      console.warn('Apify REST API Error:', apiError?.message || apiError?.response?.data);
      return NextResponse.json({ error: `Apify SDK Error: ${apiError.message}` }, { status: 502 });
    }

    if (!person || (!person.name && !person.fullName && !person.firstName)) {
      return NextResponse.json({ error: 'No profile found. The URL might be invalid or the profile is deeply private.' }, { status: 404 });
    }

    // Execute standard parsing utilizing the isolated map engine (SoC inherently achieved) natively!
    const parsedData = parseApifyProfile(person);

    let profilePictureBase64: string | undefined = undefined;
    const rawPic = person.profilePictureUrl || person.profilePicUrl || person.profilePicture || person.profile_pic_url || person.photoUrl;
    
    let profilePicUrl: string | undefined = undefined;
    if (typeof rawPic === 'string') profilePicUrl = rawPic;
    else if (rawPic && typeof rawPic === 'object' && typeof rawPic.url === 'string') profilePicUrl = rawPic.url;

    if (profilePicUrl && profilePicUrl.startsWith('https://')) {
      // Retry block logic for the profile picture extraction resolving arbitrary networking faults organically over 2 loops natively!
      let retries = 2;
      while (retries >= 0) {
        try {
          const picRes = await axios.get(profilePicUrl, { responseType: 'arraybuffer', timeout: 5000 });
          const mimeType = picRes.headers['content-type'] || 'image/jpeg';
          profilePictureBase64 = `data:${mimeType};base64,${Buffer.from(picRes.data).toString('base64')}`;
          break; // Fetch success cleanly traps and ends the retry loop seamlessly!
        } catch (err: any) {
          retries--;
          if (retries < 0) {
            console.warn('Silent skip: Failed to fetch the profile picture safely avoiding build crashes natively.', err.message);
          }
        }
      }
    }

    const finalData = { 
      id: `apify-record-${Date.now()}`,
      ...parsedData,
      profilePictureBase64
    };
    
    setCachedProfile(url, finalData);

    return NextResponse.json(finalData);
  } catch (error: any) {
    console.error('Apify Scrape Error:', error?.stack || error?.message || error);
    return NextResponse.json({ error: 'An internal server error occurred. Please try again later.' }, { status: 500 });
  }
}
