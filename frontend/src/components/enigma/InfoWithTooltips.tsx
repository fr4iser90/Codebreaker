import React, { ReactNode } from 'react';

// Mapping von Domain zu Source-Key
const domainToKey: Record<string, string> = {
  'dpma.de': 'dpma',
  '101computing.net': '101computing',
  'nordvpn.com': 'nordvpn',
  'britannica.com': 'britannica',
  'historyofinformation.com': 'historyofinfo',
  'timeshighereducation.com': 'the',
  'jstor.org': 'jstor',
  'drenigma.org': 'drenigma',
  // ... weitere Mappings nach Bedarf
};

interface Source {
  name: string;
  url: string;
  description: string;
}

interface InfoWithTooltipsProps {
  info: string;
  sources?: Record<string, any>;
}

export const InfoWithTooltips: React.FC<InfoWithTooltipsProps> = ({ info, sources }) => {
  const regex = /\(([^)]+)\)/g;
  const parts: (string | ReactNode)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(info)) !== null) {
    const [full, domain] = match;
    const key = domainToKey[domain];
    let source: Source | null = null;
    if (sources) {
      for (const cat of Object.keys(sources)) {
        if (cat === 'description') continue;
        const arr = sources[cat];
        if (Array.isArray(arr)) {
          source = arr.find((s: any) => s && s.url && s.url.includes(domain));
          if (source) break;
        }
      }
    }
    // Text vor der Quelle
    if (match.index > lastIndex) {
      parts.push(info.slice(lastIndex, match.index));
    }
    if (source) {
      parts.push(
        <span key={match.index} className="relative group cursor-help text-yellow-300">
          ({domain})
          <span className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 w-64 p-2 bg-gray-900 text-xs text-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
            <b>{source.name}</b>
            <br />
            {source.description}
          </span>
        </span>
      );
    } else {
      parts.push(full);
    }
    lastIndex = regex.lastIndex;
  }
  // Restlicher Text
  if (lastIndex < info.length) {
    parts.push(info.slice(lastIndex));
  }

  return <span>{parts}</span>;
}; 