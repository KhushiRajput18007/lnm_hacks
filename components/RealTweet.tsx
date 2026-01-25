"use client";

import React, { Suspense } from 'react';
import { Tweet } from 'react-tweet';

interface RealTweetProps {
    tweetId: string;
    className?: string;
}

// Loading skeleton for tweet
const TweetSkeleton = () => (
    <div className="animate-pulse bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/10 rounded-full" />
            <div className="space-y-2">
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-2 w-16 bg-white/10 rounded" />
            </div>
        </div>
        <div className="space-y-2">
            <div className="h-3 w-full bg-white/10 rounded" />
            <div className="h-3 w-4/5 bg-white/10 rounded" />
            <div className="h-3 w-3/5 bg-white/10 rounded" />
        </div>
        <div className="mt-4 h-40 bg-white/10 rounded-xl" />
    </div>
);

// Error fallback for tweet loading
const TweetError = ({ tweetId }: { tweetId: string }) => (
    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
        <p className="text-red-400 text-sm">Failed to load tweet</p>
        <a
            href={`https://twitter.com/i/status/${tweetId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-xs hover:underline mt-2 inline-block"
        >
            View on Twitter →
        </a>
    </div>
);

export const RealTweet: React.FC<RealTweetProps> = ({ tweetId, className = '' }) => {
    return (
        <div className={`real-tweet-container ${className}`}>
            <Suspense fallback={<TweetSkeleton />}>
                <div className="tweet-wrapper" data-theme="dark">
                    <Tweet id={tweetId} />
                </div>
            </Suspense>
        </div>
    );
};

// Compact version for cards
export const CompactTweet: React.FC<RealTweetProps> = ({ tweetId, className = '' }) => {
    return (
        <div className={`compact-tweet overflow-hidden rounded-xl ${className}`}>
            <Suspense fallback={<TweetSkeleton />}>
                <div className="tweet-wrapper scale-[0.85] origin-top-left" data-theme="dark">
                    <Tweet id={tweetId} />
                </div>
            </Suspense>
        </div>
    );
};

// Link to view tweet (lightweight alternative)
export const TweetLink: React.FC<{ tweetId: string; label?: string }> = ({
    tweetId,
    label = "View Tweet"
}) => {
    return (
        <a
            href={`https://twitter.com/i/status/${tweetId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 rounded-xl text-[#1DA1F2] text-sm font-medium transition-all hover:scale-105"
        >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {label}
        </a>
    );
};

export default RealTweet;
