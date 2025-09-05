'use client';

import React, { useState, Children } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';

export interface CitationSource {
  title: string;
  url?: string;
  description?: string;
  quote?: string;
}

export interface InlineCitationProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineCitation({ children, className }: InlineCitationProps) {
  return (
    <span className={cn('inline-flex items-baseline gap-0.5', className)}>
      {children}
    </span>
  );
}

export interface InlineCitationTextProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineCitationText({ children, className }: InlineCitationTextProps) {
  return <span className={className}>{children}</span>;
}

export interface InlineCitationCardProps {
  children: React.ReactNode;
}

export function InlineCitationCard({ children }: InlineCitationCardProps) {
  return <>{children}</>;
}

export interface InlineCitationCardTriggerProps {
  sources: string[];
  className?: string;
}

export function InlineCitationCardTrigger({ sources, className }: InlineCitationCardTriggerProps) {
  const citationNumbers = sources.map((_, index) => index + 1).join(',');
  
  return (
    <sup className={cn(
      'inline-flex items-center justify-center px-1 min-w-[1.25rem] h-4 text-[0.625rem] font-medium',
      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'rounded-full cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50',
      'transition-colors duration-200',
      className
    )}>
      [{citationNumbers}]
    </sup>
  );
}

export interface InlineCitationCardBodyProps {
  children: React.ReactNode;
}

export function InlineCitationCardBody({ children }: InlineCitationCardBodyProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span>{children}</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-0">
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}

export interface InlineCitationCarouselProps {
  children: React.ReactNode;
}

export function InlineCitationCarousel({ children }: InlineCitationCarouselProps) {
  return <div className="relative">{children}</div>;
}

export interface InlineCitationCarouselContentProps {
  children: React.ReactNode;
}

export function InlineCitationCarouselContent({ children }: InlineCitationCarouselContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);
  const hasMultiple = items.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="relative">
      {hasMultiple && (
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            className="size-6 p-0"
            aria-label="Previous citation"
          >
            <ChevronLeft className="size-3" />
          </Button>
          <span className="text-xs text-muted-foreground px-1">
            {currentIndex + 1} / {items.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            className="size-6 p-0"
            aria-label="Next citation"
          >
            <ChevronRight className="size-3" />
          </Button>
        </div>
      )}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full shrink-0">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface InlineCitationCarouselItemProps {
  children: React.ReactNode;
}

export function InlineCitationCarouselItem({ children }: InlineCitationCarouselItemProps) {
  return <div className="p-4">{children}</div>;
}

export interface InlineCitationSourceProps extends CitationSource {
  className?: string;
}

export function InlineCitationSource({
  title,
  url,
  description,
  quote,
  className,
}: InlineCitationSourceProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-1">
        <h4 className="font-medium text-sm flex items-center gap-2">
          {title}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center hover:opacity-70 transition-opacity"
              aria-label="Open source"
            >
              <ExternalLink className="size-3" />
            </a>
          )}
        </h4>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      
      {quote && (
        <div className="relative pl-4 border-l-2 border-muted">
          <Quote className="absolute left-[-9px] top-0 size-4 bg-background text-muted-foreground" />
          <p className="text-xs italic text-muted-foreground line-clamp-4">
            {quote}
          </p>
        </div>
      )}
      
      {url && (
        <div className="pt-2 border-t">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate block"
          >
            {url}
          </a>
        </div>
      )}
    </div>
  );
}

// Wrapper component for citations in messages
export interface MessageCitationsProps {
  sources: CitationSource[];
  text: string;
  className?: string;
}

export function MessageCitations({ sources, text, className }: MessageCitationsProps) {
  if (!sources || sources.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return (
    <InlineCitation className={className}>
      <InlineCitationText>{text}</InlineCitationText>
      <InlineCitationCardBody>
        <InlineCitationCardTrigger sources={sources.map(s => s.url || s.title)} />
        <InlineCitationCarousel>
          <InlineCitationCarouselContent>
            {sources.map((source, index) => (
              <InlineCitationCarouselItem key={index}>
                <InlineCitationSource {...source} />
              </InlineCitationCarouselItem>
            ))}
          </InlineCitationCarouselContent>
        </InlineCitationCarousel>
      </InlineCitationCardBody>
    </InlineCitation>
  );
}