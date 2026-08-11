import React from 'react';

import { TypographyControls } from './TypographyControls';

export default function SectionControls({ 
  title, 
  configData, 
  onChange 
}: { 
  title: string, 
  configData: any, 
  onChange: (field: string, val: any) => void 
}) {
  return (
    <div className="space-y-4 mb-6">
      <div className="bg-black/40 p-4 border border-bone/10 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={configData?.isVisible !== false} 
              onChange={e => onChange("isVisible", e.target.checked)}
              className="w-4 h-4 accent-gold"
            />
            <span className="text-sm font-bold text-bone">Show {title} Section</span>
          </label>
        </div>
        <div className="flex gap-4 flex-1">
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-widest text-bone/50 mb-1">Text Color Override</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={configData?.textColor || "#000000"} 
                onChange={e => onChange("textColor", e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent"
              />
              <input 
                type="text" 
                placeholder="inherit"
                value={configData?.textColor || ""} 
                onChange={e => onChange("textColor", e.target.value)}
                className="flex-1 bg-transparent border-b border-bone/20 text-bone text-xs py-1 outline-none"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-widest text-bone/50 mb-1">Background Color Override</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={configData?.bgColor || "#000000"} 
                onChange={e => onChange("bgColor", e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent"
              />
              <input 
                type="text" 
                placeholder="inherit"
                value={configData?.bgColor || ""} 
                onChange={e => onChange("bgColor", e.target.value)}
                className="flex-1 bg-transparent border-b border-bone/20 text-bone text-xs py-1 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <TypographyControls 
        typographyData={configData?.typography || {}}
        onChange={(field, val) => onChange("typography", { ...(configData?.typography || {}), [field]: val })}
        showEyebrowToggle={true}
      />
    </div>
  );
}
