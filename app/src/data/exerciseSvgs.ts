// Inline SVG diagrams for each exercise. currentColor inherits from container for dark-mode support.
// Ground: #F3F4F6 / #E5E7EB. Props (bench/step): #D1D5DB / #9CA3AF. Alignment hint: #22C55E.

export const EXERCISE_SVGS: Record<string, string> = {

  'bulgarian-split-squat': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <rect x="135" y="90" width="55" height="20" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="60" y1="114" x2="68" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="68" y1="88" x2="88" y2="62" stroke="currentColor" stroke-width="2.5"/>
    <line x1="88" y1="62" x2="88" y2="20" stroke="currentColor" stroke-width="2.5"/>
    <line x1="88" y1="40" x2="72" y2="58" stroke="currentColor" stroke-width="2"/>
    <line x1="88" y1="40" x2="104" y2="56" stroke="currentColor" stroke-width="2"/>
    <line x1="135" y1="90" x2="128" y2="80" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="80" x2="118" y2="62" stroke="currentColor" stroke-width="2.5"/>
    <line x1="118" y1="62" x2="88" y2="62" stroke="currentColor" stroke-width="2.5"/>
    <line x1="80" y1="62" x2="68" y2="88" stroke="currentColor" stroke-width="1" stroke-dasharray="3,2" opacity="0.3"/>
    <circle cx="88" cy="11" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="68" cy="88" r="3" fill="currentColor"/>
    <circle cx="88" cy="62" r="3" fill="currentColor"/>
    <circle cx="118" cy="62" r="3" fill="currentColor"/>
    <circle cx="128" cy="80" r="3" fill="currentColor"/>
    <circle cx="60" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Rear foot on bench · Front knee over ankle · Torso tall</text>
  </svg>`,

  'plank': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="30" y1="88" x2="175" y2="88" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>
    <line x1="30" y1="114" x2="55" y2="114" stroke="currentColor" stroke-width="2.5"/>
    <line x1="55" y1="114" x2="62" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="62" y1="88" x2="148" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="148" y1="88" x2="175" y2="114" stroke="currentColor" stroke-width="2.5"/>
    <line x1="50" y1="88" x2="40" y2="84" stroke="currentColor" stroke-width="2"/>
    <circle cx="32" cy="77" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="62" cy="88" r="3" fill="currentColor"/>
    <circle cx="148" cy="88" r="3" fill="currentColor"/>
    <circle cx="55" cy="114" r="3" fill="currentColor"/>
    <circle cx="175" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Hips level · Squeeze glutes and core throughout</text>
  </svg>`,

  'bird-dog': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="18" y1="82" x2="182" y2="82" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>
    <line x1="72" y1="82" x2="128" y2="82" stroke="currentColor" stroke-width="2.5"/>
    <line x1="72" y1="82" x2="18" y2="80" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="82" x2="182" y2="80" stroke="currentColor" stroke-width="2.5"/>
    <line x1="88" y1="82" x2="84" y2="114" stroke="currentColor" stroke-width="2"/>
    <line x1="112" y1="82" x2="116" y2="114" stroke="currentColor" stroke-width="2"/>
    <line x1="66" y1="82" x2="52" y2="76" stroke="currentColor" stroke-width="2"/>
    <circle cx="43" cy="68" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="72" cy="82" r="3" fill="currentColor"/>
    <circle cx="128" cy="82" r="3" fill="currentColor"/>
    <circle cx="18" cy="80" r="3" fill="currentColor"/>
    <circle cx="182" cy="80" r="3" fill="currentColor"/>
    <circle cx="84" cy="114" r="3" fill="currentColor"/>
    <circle cx="116" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Arm &amp; leg parallel to floor · Back flat</text>
  </svg>`,

  'copenhagen-plank': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <rect x="145" y="68" width="50" height="12" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="10" y1="114" x2="32" y2="114" stroke="currentColor" stroke-width="2.5"/>
    <line x1="32" y1="114" x2="38" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="38" y1="88" x2="128" y2="80" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="80" x2="145" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="80" x2="132" y2="108" stroke="currentColor" stroke-width="2" stroke-dasharray="5,3"/>
    <line x1="30" y1="88" x2="20" y2="82" stroke="currentColor" stroke-width="2"/>
    <circle cx="12" cy="74" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="38" cy="88" r="3" fill="currentColor"/>
    <circle cx="128" cy="80" r="3" fill="currentColor"/>
    <circle cx="32" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Top foot on bench · Bottom leg free-hanging (dashed)</text>
  </svg>`,

  'dead-bug': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <rect x="0" y="96" width="200" height="4" fill="#E5E7EB" opacity="0.6"/>
    <line x1="85" y1="96" x2="115" y2="96" stroke="currentColor" stroke-width="2.5"/>
    <line x1="85" y1="96" x2="68" y2="96" stroke="currentColor" stroke-width="2"/>
    <line x1="115" y1="96" x2="132" y2="96" stroke="currentColor" stroke-width="2"/>
    <line x1="85" y1="84" x2="68" y2="96" stroke="currentColor" stroke-width="2.5"/>
    <line x1="85" y1="84" x2="88" y2="58" stroke="currentColor" stroke-width="2.5"/>
    <line x1="88" y1="58" x2="80" y2="34" stroke="currentColor" stroke-width="2"/>
    <line x1="115" y1="84" x2="112" y2="58" stroke="currentColor" stroke-width="2.5"/>
    <line x1="112" y1="58" x2="136" y2="42" stroke="currentColor" stroke-width="2"/>
    <line x1="115" y1="84" x2="132" y2="96" stroke="currentColor" stroke-width="2.5"/>
    <line x1="132" y1="96" x2="158" y2="96" stroke="currentColor" stroke-width="2"/>
    <circle cx="100" cy="90" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="85" cy="84" r="3" fill="currentColor"/>
    <circle cx="115" cy="84" r="3" fill="currentColor"/>
    <circle cx="88" cy="58" r="3" fill="currentColor"/>
    <circle cx="112" cy="58" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Back pressed flat · Lower slowly · One side at a time</text>
  </svg>`,

  'single-leg-rdl': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="92" y1="114" x2="88" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="88" y1="88" x2="80" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="80" y1="68" x2="45" y2="45" stroke="currentColor" stroke-width="2.5"/>
    <line x1="80" y1="68" x2="130" y2="52" stroke="currentColor" stroke-width="2.5"/>
    <line x1="80" y1="68" x2="92" y2="114" stroke="currentColor" stroke-width="1" stroke-dasharray="4,2" opacity="0.3"/>
    <line x1="60" y1="55" x2="62" y2="80" stroke="currentColor" stroke-width="2"/>
    <rect x="56" y="80" width="12" height="7" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="45" y1="45" x2="38" y2="38" stroke="currentColor" stroke-width="2"/>
    <circle cx="30" cy="29" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="88" cy="88" r="3" fill="currentColor"/>
    <circle cx="80" cy="68" r="3" fill="currentColor"/>
    <circle cx="130" cy="52" r="3" fill="currentColor"/>
    <circle cx="92" cy="114" r="3" fill="currentColor"/>
    <line x1="45" y1="45" x2="130" y2="52" stroke="#22C55E" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Hip hinge · Free leg rises as counterbalance · Back flat</text>
  </svg>`,

  'goblet-squat': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="65" y1="114" x2="68" y2="85" stroke="currentColor" stroke-width="2.5"/>
    <line x1="135" y1="114" x2="132" y2="85" stroke="currentColor" stroke-width="2.5"/>
    <line x1="68" y1="85" x2="100" y2="70" stroke="currentColor" stroke-width="2.5"/>
    <line x1="132" y1="85" x2="100" y2="70" stroke="currentColor" stroke-width="2.5"/>
    <line x1="100" y1="70" x2="100" y2="28" stroke="currentColor" stroke-width="2.5"/>
    <rect x="88" y="38" width="24" height="18" rx="3" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="100" y1="52" x2="88" y2="49" stroke="currentColor" stroke-width="2"/>
    <line x1="100" y1="52" x2="112" y2="49" stroke="currentColor" stroke-width="2"/>
    <circle cx="100" cy="19" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="68" cy="85" r="3" fill="currentColor"/>
    <circle cx="132" cy="85" r="3" fill="currentColor"/>
    <circle cx="100" cy="70" r="3" fill="currentColor"/>
    <circle cx="65" cy="114" r="3" fill="currentColor"/>
    <circle cx="135" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Heels flat · Knees out · Chest tall</text>
  </svg>`,

  'calf-raise': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <rect x="52" y="96" width="96" height="14" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="52" y1="96" x2="52" y2="114" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="78" y1="96" x2="68" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="68" y1="88" x2="66" y2="62" stroke="currentColor" stroke-width="2.5"/>
    <line x1="66" y1="62" x2="68" y2="38" stroke="currentColor" stroke-width="2.5"/>
    <line x1="68" y1="38" x2="68" y2="14" stroke="currentColor" stroke-width="2.5"/>
    <line x1="85" y1="38" x2="98" y2="58" stroke="currentColor" stroke-width="2" stroke-dasharray="4,2"/>
    <circle cx="68" cy="6" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="68" cy="88" r="3" fill="currentColor"/>
    <circle cx="66" cy="62" r="3" fill="currentColor"/>
    <circle cx="68" cy="38" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Heel OFF edge · Full range up and down · Slow eccentric</text>
  </svg>`,

  'glute-bridge': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <rect x="0" y="104" width="200" height="4" fill="#E5E7EB" opacity="0.6"/>
    <line x1="60" y1="104" x2="80" y2="104" stroke="currentColor" stroke-width="2.5"/>
    <line x1="80" y1="104" x2="80" y2="104" stroke="currentColor" stroke-width="1"/>
    <line x1="60" y1="80" x2="80" y2="104" stroke="currentColor" stroke-width="2.5"/>
    <line x1="140" y1="80" x2="120" y2="104" stroke="currentColor" stroke-width="2.5"/>
    <line x1="60" y1="80" x2="140" y2="80" stroke="currentColor" stroke-width="2.5"/>
    <line x1="60" y1="80" x2="40" y2="104" stroke="currentColor" stroke-width="2.5"/>
    <line x1="140" y1="80" x2="160" y2="104" stroke="currentColor" stroke-width="2.5"/>
    <line x1="60" y1="90" x2="45" y2="96" stroke="currentColor" stroke-width="2"/>
    <line x1="140" y1="90" x2="155" y2="96" stroke="currentColor" stroke-width="2"/>
    <circle cx="100" cy="104" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="60" cy="80" r="3" fill="currentColor"/>
    <circle cx="140" cy="80" r="3" fill="currentColor"/>
    <circle cx="80" cy="104" r="3" fill="currentColor"/>
    <circle cx="120" cy="104" r="3" fill="currentColor"/>
    <circle cx="40" cy="104" r="3" fill="currentColor"/>
    <circle cx="160" cy="104" r="3" fill="currentColor"/>
    <line x1="60" y1="80" x2="140" y2="80" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Drive through heels · Hips, knees &amp; shoulders in line</text>
  </svg>`,

  'hip-thrust': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <rect x="135" y="68" width="55" height="20" rx="3" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="50" y1="114" x2="68" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="68" y1="88" x2="110" y2="80" stroke="currentColor" stroke-width="2.5"/>
    <line x1="110" y1="80" x2="135" y2="80" stroke="currentColor" stroke-width="2.5"/>
    <line x1="135" y1="80" x2="150" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="110" y1="80" x2="118" y2="114" stroke="currentColor" stroke-width="2.5"/>
    <line x1="135" y1="80" x2="135" y2="68" stroke="currentColor" stroke-width="1" opacity="0.4"/>
    <line x1="50" y1="92" x2="35" y2="90" stroke="currentColor" stroke-width="2"/>
    <line x1="68" y1="88" x2="110" y2="80" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>
    <circle cx="38" cy="80" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="68" cy="88" r="3" fill="currentColor"/>
    <circle cx="110" cy="80" r="3" fill="currentColor"/>
    <circle cx="50" cy="114" r="3" fill="currentColor"/>
    <circle cx="118" cy="114" r="3" fill="currentColor"/>
    <text x="88" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Upper back on bench · Squeeze glutes at top</text>
  </svg>`,

  'press-up': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="25" y1="88" x2="175" y2="88" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>
    <line x1="50" y1="114" x2="62" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="62" y1="88" x2="145" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="145" y1="88" x2="175" y2="114" stroke="currentColor" stroke-width="2.5"/>
    <line x1="80" y1="88" x2="70" y2="114" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="88" x2="118" y2="114" stroke="currentColor" stroke-width="2"/>
    <line x1="50" y1="88" x2="38" y2="84" stroke="currentColor" stroke-width="2"/>
    <circle cx="30" cy="77" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="62" cy="88" r="3" fill="currentColor"/>
    <circle cx="145" cy="88" r="3" fill="currentColor"/>
    <circle cx="50" cy="114" r="3" fill="currentColor"/>
    <circle cx="175" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Body rigid · Elbows at 45° · Chest to floor</text>
  </svg>`,

  'bent-over-row': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="85" y1="114" x2="82" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="115" y1="114" x2="118" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="82" y1="88" x2="100" y2="78" stroke="currentColor" stroke-width="2.5"/>
    <line x1="118" y1="88" x2="100" y2="78" stroke="currentColor" stroke-width="2.5"/>
    <line x1="100" y1="78" x2="68" y2="45" stroke="currentColor" stroke-width="2.5"/>
    <line x1="80" y1="62" x2="82" y2="85" stroke="currentColor" stroke-width="2.5"/>
    <line x1="82" y1="85" x2="78" y2="104" stroke="currentColor" stroke-width="2"/>
    <rect x="70" y="104" width="16" height="6" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="80" y1="62" x2="88" y2="45" stroke="currentColor" stroke-width="2"/>
    <line x1="68" y1="45" x2="60" y2="38" stroke="currentColor" stroke-width="2"/>
    <circle cx="52" cy="29" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="100" cy="78" r="3" fill="currentColor"/>
    <circle cx="82" cy="88" r="3" fill="currentColor"/>
    <circle cx="118" cy="88" r="3" fill="currentColor"/>
    <circle cx="85" cy="114" r="3" fill="currentColor"/>
    <circle cx="115" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Hinge at hip · Squeeze shoulder blades at top</text>
  </svg>`,

  'overhead-press': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="88" y1="114" x2="88" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="112" y1="114" x2="112" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="88" y1="88" x2="100" y2="78" stroke="currentColor" stroke-width="2.5"/>
    <line x1="112" y1="88" x2="100" y2="78" stroke="currentColor" stroke-width="2.5"/>
    <line x1="100" y1="78" x2="100" y2="40" stroke="currentColor" stroke-width="2.5"/>
    <line x1="100" y1="58" x2="72" y2="42" stroke="currentColor" stroke-width="2.5"/>
    <line x1="72" y1="42" x2="68" y2="22" stroke="currentColor" stroke-width="2"/>
    <rect x="60" y="16" width="16" height="6" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="100" y1="58" x2="128" y2="42" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="42" x2="132" y2="22" stroke="currentColor" stroke-width="2"/>
    <rect x="124" y="16" width="16" height="6" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <circle cx="100" cy="31" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="100" cy="78" r="3" fill="currentColor"/>
    <circle cx="72" cy="42" r="3" fill="currentColor"/>
    <circle cx="128" cy="42" r="3" fill="currentColor"/>
    <circle cx="88" cy="114" r="3" fill="currentColor"/>
    <circle cx="112" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Core braced · No leg drive · Press straight up</text>
  </svg>`,

  'step-up': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <rect x="80" y="96" width="100" height="18" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="80" y1="96" x2="80" y2="114" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="96" y1="96" x2="94" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="94" y1="68" x2="90" y2="45" stroke="currentColor" stroke-width="2.5"/>
    <line x1="90" y1="45" x2="90" y2="20" stroke="currentColor" stroke-width="2.5"/>
    <line x1="90" y1="58" x2="72" y2="72" stroke="currentColor" stroke-width="2"/>
    <line x1="90" y1="58" x2="108" y2="70" stroke="currentColor" stroke-width="2"/>
    <line x1="60" y1="114" x2="68" y2="90" stroke="currentColor" stroke-width="2.5" stroke-dasharray="5,3"/>
    <line x1="68" y1="90" x2="84" y2="78" stroke="currentColor" stroke-width="2" stroke-dasharray="5,3"/>
    <circle cx="90" cy="11" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="94" cy="68" r="3" fill="currentColor"/>
    <circle cx="90" cy="45" r="3" fill="currentColor"/>
    <circle cx="96" cy="96" r="3" fill="currentColor"/>
    <circle cx="60" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Drive through box leg only · Full extension at top</text>
  </svg>`,

  'lateral-lunge': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="50" y1="114" x2="66" y2="85" stroke="currentColor" stroke-width="2.5"/>
    <line x1="66" y1="85" x2="90" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="150" y1="114" x2="150" y2="85" stroke="currentColor" stroke-width="2.5"/>
    <line x1="150" y1="85" x2="90" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="90" y1="68" x2="90" y2="25" stroke="currentColor" stroke-width="2.5"/>
    <line x1="90" y1="45" x2="75" y2="62" stroke="currentColor" stroke-width="2"/>
    <line x1="90" y1="45" x2="105" y2="60" stroke="currentColor" stroke-width="2"/>
    <circle cx="90" cy="16" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="66" cy="85" r="3" fill="currentColor"/>
    <circle cx="150" cy="85" r="3" fill="currentColor"/>
    <circle cx="90" cy="68" r="3" fill="currentColor"/>
    <circle cx="50" cy="114" r="3" fill="currentColor"/>
    <circle cx="150" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Step wide · Bent knee over toes · Straight leg stays straight</text>
  </svg>`,

  'walking-lunge': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="60" y1="114" x2="62" y2="85" stroke="currentColor" stroke-width="2.5"/>
    <line x1="62" y1="85" x2="90" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="135" y1="108" x2="128" y2="82" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="82" x2="90" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="90" y1="68" x2="90" y2="24" stroke="currentColor" stroke-width="2.5"/>
    <line x1="90" y1="44" x2="75" y2="60" stroke="currentColor" stroke-width="2"/>
    <line x1="90" y1="44" x2="105" y2="58" stroke="currentColor" stroke-width="2"/>
    <circle cx="90" cy="15" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="62" cy="85" r="3" fill="currentColor"/>
    <circle cx="128" cy="82" r="3" fill="currentColor"/>
    <circle cx="90" cy="68" r="3" fill="currentColor"/>
    <circle cx="60" cy="114" r="3" fill="currentColor"/>
    <circle cx="135" cy="108" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Front shin vertical · Torso upright · Step long enough</text>
  </svg>`,

  'reverse-lunge': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="80" y1="114" x2="80" y2="85" stroke="currentColor" stroke-width="2.5"/>
    <line x1="80" y1="85" x2="100" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="145" y1="108" x2="128" y2="82" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="82" x2="100" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="100" y1="68" x2="100" y2="24" stroke="currentColor" stroke-width="2.5"/>
    <line x1="100" y1="44" x2="85" y2="60" stroke="currentColor" stroke-width="2"/>
    <line x1="100" y1="44" x2="115" y2="58" stroke="currentColor" stroke-width="2"/>
    <circle cx="100" cy="15" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="80" cy="85" r="3" fill="currentColor"/>
    <circle cx="128" cy="82" r="3" fill="currentColor"/>
    <circle cx="100" cy="68" r="3" fill="currentColor"/>
    <circle cx="80" cy="114" r="3" fill="currentColor"/>
    <circle cx="145" cy="108" r="3" fill="currentColor"/>
    <line x1="80" y1="85" x2="80" y2="114" stroke="#22C55E" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Step back · Front shin vertical · Power from front heel</text>
  </svg>`,

  'curtsy-lunge': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="78" y1="114" x2="78" y2="85" stroke="currentColor" stroke-width="2.5"/>
    <line x1="78" y1="85" x2="100" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="130" y1="106" x2="118" y2="80" stroke="currentColor" stroke-width="2.5"/>
    <line x1="118" y1="80" x2="100" y2="68" stroke="currentColor" stroke-width="2.5"/>
    <line x1="100" y1="68" x2="100" y2="24" stroke="currentColor" stroke-width="2.5"/>
    <line x1="100" y1="44" x2="86" y2="60" stroke="currentColor" stroke-width="2"/>
    <line x1="100" y1="44" x2="114" y2="58" stroke="currentColor" stroke-width="2"/>
    <line x1="100" y1="24" x2="100" y2="68" stroke="#22C55E" stroke-width="1" stroke-dasharray="3,2" opacity="0.4"/>
    <circle cx="100" cy="15" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="78" cy="85" r="3" fill="currentColor"/>
    <circle cx="118" cy="80" r="3" fill="currentColor"/>
    <circle cx="100" cy="68" r="3" fill="currentColor"/>
    <circle cx="78" cy="114" r="3" fill="currentColor"/>
    <circle cx="130" cy="106" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Hips square · Step behind &amp; across · Front knee over toes</text>
  </svg>`,

  'dumbbell-floor-press': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <rect x="0" y="102" width="200" height="4" fill="#E5E7EB" opacity="0.6"/>
    <line x1="72" y1="102" x2="92" y2="102" stroke="currentColor" stroke-width="2.5"/>
    <line x1="92" y1="102" x2="104" y2="102" stroke="currentColor" stroke-width="2"/>
    <line x1="108" y1="102" x2="128" y2="102" stroke="currentColor" stroke-width="2.5"/>
    <line x1="78" y1="92" x2="92" y2="102" stroke="currentColor" stroke-width="2.5"/>
    <line x1="78" y1="92" x2="72" y2="62" stroke="currentColor" stroke-width="2.5"/>
    <line x1="72" y1="62" x2="68" y2="38" stroke="currentColor" stroke-width="2"/>
    <rect x="60" y="30" width="16" height="8" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="122" y1="92" x2="108" y2="102" stroke="currentColor" stroke-width="2.5"/>
    <line x1="122" y1="92" x2="128" y2="62" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="62" x2="132" y2="38" stroke="currentColor" stroke-width="2"/>
    <rect x="124" y="30" width="16" height="8" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <circle cx="100" cy="102" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="78" cy="92" r="3" fill="currentColor"/>
    <circle cx="122" cy="92" r="3" fill="currentColor"/>
    <circle cx="72" cy="62" r="3" fill="currentColor"/>
    <circle cx="128" cy="62" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Elbows at 45° · Pause on floor · Press from dead stop</text>
  </svg>`,

  'arnold-press': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="88" y1="114" x2="88" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="112" y1="114" x2="112" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="88" y1="88" x2="100" y2="78" stroke="currentColor" stroke-width="2.5"/>
    <line x1="112" y1="88" x2="100" y2="78" stroke="currentColor" stroke-width="2.5"/>
    <line x1="100" y1="78" x2="100" y2="40" stroke="currentColor" stroke-width="2.5"/>
    <line x1="100" y1="58" x2="72" y2="52" stroke="currentColor" stroke-width="2.5"/>
    <line x1="72" y1="52" x2="68" y2="30" stroke="currentColor" stroke-width="2"/>
    <rect x="60" y="22" width="16" height="8" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="100" y1="58" x2="128" y2="52" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="52" x2="132" y2="30" stroke="currentColor" stroke-width="2"/>
    <rect x="124" y="22" width="16" height="8" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <path d="M 72 52 Q 68 42 68 30" stroke="#22C55E" stroke-width="1.5" fill="none" stroke-dasharray="3,2" opacity="0.6"/>
    <path d="M 128 52 Q 132 42 132 30" stroke="#22C55E" stroke-width="1.5" fill="none" stroke-dasharray="3,2" opacity="0.6"/>
    <circle cx="100" cy="31" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="100" cy="78" r="3" fill="currentColor"/>
    <circle cx="72" cy="52" r="3" fill="currentColor"/>
    <circle cx="128" cy="52" r="3" fill="currentColor"/>
    <circle cx="88" cy="114" r="3" fill="currentColor"/>
    <circle cx="112" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Palms rotate outward as you press · Smooth continuous movement</text>
  </svg>`,

  'renegade-row': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="25" y1="88" x2="175" y2="88" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>
    <line x1="50" y1="114" x2="62" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="62" y1="88" x2="145" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="145" y1="88" x2="175" y2="114" stroke="currentColor" stroke-width="2.5"/>
    <line x1="80" y1="88" x2="70" y2="114" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="88" x2="118" y2="114" stroke="currentColor" stroke-width="2"/>
    <line x1="128" y1="88" x2="128" y2="66" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="66" x2="130" y2="50" stroke="currentColor" stroke-width="2"/>
    <rect x="122" y="44" width="16" height="6" rx="2" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1.5"/>
    <line x1="50" y1="88" x2="38" y2="84" stroke="currentColor" stroke-width="2"/>
    <circle cx="30" cy="77" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="62" cy="88" r="3" fill="currentColor"/>
    <circle cx="145" cy="88" r="3" fill="currentColor"/>
    <circle cx="128" cy="66" r="3" fill="currentColor"/>
    <circle cx="50" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Hips level throughout · Wide feet for base · Pull to hip</text>
  </svg>`,

  'side-plank': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <line x1="18" y1="80" x2="168" y2="80" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>
    <line x1="10" y1="114" x2="30" y2="114" stroke="currentColor" stroke-width="2.5"/>
    <line x1="30" y1="114" x2="36" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="36" y1="88" x2="128" y2="80" stroke="currentColor" stroke-width="2.5"/>
    <line x1="128" y1="80" x2="168" y2="114" stroke="currentColor" stroke-width="2.5"/>
    <line x1="80" y1="82" x2="80" y2="62" stroke="currentColor" stroke-width="2"/>
    <line x1="30" y1="88" x2="20" y2="82" stroke="currentColor" stroke-width="2"/>
    <circle cx="12" cy="74" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="36" cy="88" r="3" fill="currentColor"/>
    <circle cx="128" cy="80" r="3" fill="currentColor"/>
    <circle cx="30" cy="114" r="3" fill="currentColor"/>
    <circle cx="168" cy="114" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Hips up · Body straight · Don't let hips sag</text>
  </svg>`,

  'superman-hold': `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="114" width="200" height="16" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <rect x="0" y="96" width="200" height="4" fill="#E5E7EB" opacity="0.6"/>
    <line x1="25" y1="80" x2="175" y2="80" stroke="#22C55E" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>
    <line x1="25" y1="80" x2="58" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="58" y1="88" x2="145" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <line x1="145" y1="88" x2="175" y2="80" stroke="currentColor" stroke-width="2.5"/>
    <line x1="85" y1="88" x2="82" y2="96" stroke="currentColor" stroke-width="2"/>
    <line x1="115" y1="88" x2="118" y2="96" stroke="currentColor" stroke-width="2"/>
    <line x1="58" y1="88" x2="45" y2="84" stroke="currentColor" stroke-width="2"/>
    <circle cx="37" cy="78" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="58" cy="88" r="3" fill="currentColor"/>
    <circle cx="145" cy="88" r="3" fill="currentColor"/>
    <circle cx="25" cy="80" r="3" fill="currentColor"/>
    <circle cx="175" cy="80" r="3" fill="currentColor"/>
    <text x="100" y="128" text-anchor="middle" font-size="9" fill="#9CA3AF">Face down · Squeeze glutes · Arms, chest &amp; legs all raised</text>
  </svg>`,

}
