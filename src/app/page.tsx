"use client";

import { useState } from "react";
import { z } from "zod";
import axios from "axios";
import { FileText } from "lucide-react";

import { LinkedInProfile } from "@/types/profile";
import { mockProfile } from "@/lib/mock-data";

// Extracted View Components
import { DefaultView } from "@/components/views/DefaultView";
import { ScrapingLoader } from "@/components/views/ScrapingLoader";
import { ScrapingError } from "@/components/views/ScrapingError";
import { DataPreview } from "@/components/views/DataPreview";

const urlSchema = z.string().url().startsWith('https://www.linkedin.com/in/', 'Must be a valid LinkedIn profile URL starting with https://www.linkedin.com/in/');

type AppStatus = 'IDLE' | 'SCRAPING' | 'SUCCESS' | 'ERROR';

export default function Home() {
  const [status, setStatus] = useState<AppStatus>('IDLE');
  const [url, setUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    if (!val) {
      setValidationError(null);
      return;
    }
    const result = urlSchema.safeParse(val);
    if (!result.success) {
      setValidationError(result.error.issues[0].message);
    } else {
      setValidationError(null);
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = urlSchema.safeParse(url);
    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }

    setStatus('SCRAPING');
    setApiError(null);
    setProfile(null);

    try {
      const res = await axios.post('/api/scrape', { url });
      if (res.data?.error) {
        throw new Error(JSON.stringify(res.data.error));
      }
      setProfile(res.data);
      setStatus('SUCCESS');
    } catch (err: any) {
      console.error(err);
      setApiError(err.response?.data?.error || err.message || 'Failed to scrape the profile.');
      setStatus('ERROR');
    }
  };

  const loadDemoData = () => {
    setProfile(mockProfile);
    setStatus('SUCCESS');
    setApiError(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans">
      <main className="mx-auto flex w-full max-w-4xl flex-col px-4 py-16 sm:px-6">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <FileText className="h-8 w-8 text-blue-700" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            LinkedIn to <span className="text-blue-600">Resume</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Instantly convert any LinkedIn profile into a perfectly formatted, professional PDF resume.
          </p>
        </div>

        {/* MODULAR STATUS VIEWS */}
        {status === 'IDLE' && (
          <DefaultView 
            url={url} 
            validationError={validationError} 
            onUrlChange={handleUrlChange} 
            onScrape={handleScrape} 
            onLoadDemo={loadDemoData} 
          />
        )}

        {status === 'SCRAPING' && (
          <ScrapingLoader />
        )}

        {status === 'ERROR' && (
          <ScrapingError 
            apiError={apiError} 
            onRetry={() => setStatus('IDLE')} 
            onLoadDemo={loadDemoData} 
          />
        )}

        {status === 'SUCCESS' && profile && (
          <DataPreview 
            profile={profile} 
            onProfileUpdate={(cleanData) => setProfile(cleanData)}
            onReset={() => {
              setStatus('IDLE');
              setUrl('');
            }}
          />
        )}

      </main>
    </div>
  );
}
