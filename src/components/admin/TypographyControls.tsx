"use client";

import React from "react";

export interface TypographyConfig {
  titleFont?: "h-display" | "font-sans" | "font-script";
  subtitleFont?: "h-display" | "font-sans" | "font-script";
  eyebrowFont?: "h-display" | "font-sans" | "font-script";
  hideEyebrowOnMobile?: boolean;
}

interface TypographyControlsProps {
  typographyData?: TypographyConfig;
  onChange: (field: keyof TypographyConfig, val: any) => void;
  showEyebrowToggle?: boolean;
}

export function TypographyControls({ typographyData, onChange, showEyebrowToggle = true }: TypographyControlsProps) {
  const fonts = [
    { label: "Default Display (h-display)", value: "h-display" },
    { label: "Sans Serif (font-sans)", value: "font-sans" },
    { label: "Script (font-script)", value: "font-script" },
  ];

  return (
    <div className="bg-black/30 p-4 border border-bone/10 mb-6 space-y-4">
      <h3 className="text-xs uppercase tracking-widest text-bone/50 border-b border-bone/10 pb-2">Typography Customization</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-bone mb-2">Title Font</label>
          <select 
            value={typographyData?.titleFont || ""}
            onChange={e => onChange("titleFont", e.target.value)}
            className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none text-sm"
          >
            <option value="">Inherit Theme</option>
            {fonts.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-bone mb-2">Subtitle / Content Font</label>
          <select 
            value={typographyData?.subtitleFont || ""}
            onChange={e => onChange("subtitleFont", e.target.value)}
            className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none text-sm"
          >
            <option value="">Inherit Theme</option>
            {fonts.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-bone mb-2">Eyebrow / Label Font</label>
          <select 
            value={typographyData?.eyebrowFont || ""}
            onChange={e => onChange("eyebrowFont", e.target.value)}
            className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none text-sm"
          >
            <option value="">Inherit Theme</option>
            {fonts.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {showEyebrowToggle && (
        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={typographyData?.hideEyebrowOnMobile !== false} 
              onChange={e => onChange("hideEyebrowOnMobile", e.target.checked)}
              className="w-4 h-4 accent-gold"
            />
            <span className="text-xs uppercase tracking-widest text-bone">Hide Eyebrow Text on Mobile</span>
          </label>
        </div>
      )}
    </div>
  );
}
