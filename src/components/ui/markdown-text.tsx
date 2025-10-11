import React from 'react';

interface MarkdownTextProps {
  text: string;
  className?: string;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ text, className = '' }) => {
  const formatText = (text: string) => {
    // Split by lines to handle different formatting
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Handle numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={index} className="flex items-start gap-2 mb-1">
            <span className="font-semibold text-blue-600 min-w-[20px]">{line.match(/^\d+/)?.[0]}.</span>
            <span className="flex-1">{formatInlineText(line.replace(/^\d+\.\s/, ''))}</span>
          </div>
        );
      }
      
      // Handle bullet points
      if (/^-\s/.test(line.trim())) {
        return (
          <div key={index} className="flex items-start gap-2 mb-1">
            <span className="text-gray-500 mt-1">•</span>
            <span className="flex-1">{formatInlineText(line.replace(/^-\s/, ''))}</span>
          </div>
        );
      }
      
      // Handle markdown headers (###, ##, #)
      if (/^#{1,3}\s/.test(line.trim())) {
        const level = line.match(/^(#{1,3})/)?.[1].length || 1;
        const text = line.replace(/^#{1,3}\s/, '');
        const className = level === 1 ? 'text-xl font-bold text-gray-900 mt-4 mb-3 first:mt-0' :
                         level === 2 ? 'text-lg font-semibold text-gray-800 mt-3 mb-2 first:mt-0' :
                         'text-base font-semibold text-gray-700 mt-2 mb-2 first:mt-0';
        return (
          <div key={index} className={className}>
            {formatInlineText(text)}
          </div>
        );
      }
      
      // Handle section headers (text ending with :)
      if (line.trim().endsWith(':') && line.trim().length < 50) {
        return (
          <div key={index} className="font-semibold text-gray-800 mt-3 mb-2 first:mt-0">
            {formatInlineText(line)}
          </div>
        );
      }
      
      // Handle regular paragraphs
      if (line.trim()) {
        return (
          <div key={index} className="mb-2">
            {formatInlineText(line)}
          </div>
        );
      }
      
      // Empty lines
      return <div key={index} className="h-2" />;
    });
  };

  const formatInlineText = (text: string) => {
    // Handle bold text **text**
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    
    // Handle italic text *text*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');
    
    // Handle code `text`
    formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Handle links [text](url)
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {formatText(text)}
    </div>
  );
};
