// Shown until the 3D chunk loads, and when WebGL is unavailable.
export default function BoardFallback() {
  return (<svg viewBox="0 0 300 200" role="img" aria-label="Circuit board with a status LED" className="w-full h-full">
    <rect x="20" y="40" width="260" height="120" fill="#0F5B3F" stroke="#F2F0E4" strokeWidth="2" />
    <rect x="120" y="80" width="60" height="40" fill="#08281D" />
    <path d="M40 70H120M40 100H120M180 90H260M180 110H260" stroke="#D0853A" strokeWidth="3" fill="none" />
    <circle cx="255" cy="55" r="6" fill="#FFC933" />
  </svg>)
}