import React from 'react';

interface MsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'header';
  variant?: 'light' | 'dark' | 'rust' | 'monochrome';
  iconOnly?: boolean;
  showWear?: boolean;
  hideWearOnMobile?: boolean;
}

export const MsLogo: React.FC<MsLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
  iconOnly = false,
  showWear = true,
  hideWearOnMobile = false,
}) => {
  // Dimensions for prominent, bold logo emblem (matching official 540x440 viewBox)
  const sizeMap = {
    sm: { width: 56, height: 46 },
    md: { width: 88, height: 72 },
    lg: { width: 140, height: 114 },
    xl: { width: 200, height: 163 },
    hero: { width: 380, height: 310 },
    header: { width: 75, height: 61 },
  };

  const current = sizeMap[size];

  // Exact Brand Color Palette from user's provided logo:
  // - Black calligraphic serif 'M': #141414
  // - Rose-copper script '&' intertwined: #A0645A
  // - Terracotta rust-red 'S': #8B2E0B
  // - Clean geometric sans 'WEAR' under 'S': #141414
  // On dark background (Header & Footer):
  // - M: Tan #C4AD8A
  // - &: Elegant Rose-Brown #B5786E
  // - S: Rich Rust-red #C2481A
  // - WEAR: Tan #C4AD8A or Rose-Brown #A0645A
  const colors = {
    light: {
      mColor: '#141414',       // Deep black calligraphic M
      ampersand: '#A0645A',    // Rose-copper intertwined &
      sColor: '#8B2E0B',       // Terracotta rust S
      wearText: '#141414',     // Black WEAR text
    },
    dark: {
      mColor: '#C4AD8A',       // Tan / warm luxury camel
      ampersand: '#B5786E',    // Rose-brown
      sColor: '#C2481A',       // Rich vibrant rust-red
      wearText: '#C4AD8A',     // Tan WEAR
    },
    rust: {
      mColor: '#8B2E0B',
      ampersand: '#A0645A',
      sColor: '#141414',
      wearText: '#8B2E0B',
    },
    monochrome: {
      mColor: 'currentColor',
      ampersand: 'currentColor',
      sColor: 'currentColor',
      wearText: 'currentColor',
    },
  }[variant];

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none group bg-transparent ${className}`}>
      {/* 
        M&S WEAR Official Master Logo:
        - Deep black calligraphic 'M' with elegant sweeping top wing and bottom tail underline flourish
        - Warm rose-copper script ampersand '&' intertwined between letters
        - Terracotta rust-red classical serif Roman 'S'
        - Uppercase geometric tracked 'WEAR' positioned under 'S'
      */}
      <svg
        width={current.width}
        height={current.height}
        viewBox="0 0 540 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-full h-auto transition-transform duration-300 group-hover:scale-[1.02] overflow-visible"
        aria-label="MUSHAY"
        role="img"
      >
        {/* ================= LETTER 'M' (Solid Black with Elegant Calligraphic Flourishes) ================= */}
        <g id="letter-m">
          {/* Base Serif Foot on left & sweeping wing flourish at top left */}
          <path
            d="M 52 368 L 114 368 C 114 364 108 362 102 360 C 96 357 95 352 95 344 L 95 212 C 95 198 90 182 82 170 C 72 154 52 142 24 135 C 38 138 56 145 68 155 C 80 166 86 179 88 196 L 90 236 L 148 368 L 168 368 L 244 165 L 244 260 C 244 295 248 335 264 368 C 278 395 304 415 342 418 C 314 414 290 398 278 375 C 265 350 262 315 262 275 L 262 145 L 235 145 L 158 330 L 105 208 L 105 344 C 105 352 104 357 98 360 C 92 362 86 364 86 368 Z"
            fill={colors.mColor}
          />
          {/* Left Stem Column Solid Body */}
          <path
            d="M 68 368 L 95 368 L 95 220 L 72 205 L 68 368 Z"
            fill={colors.mColor}
          />
        </g>

        {/* ================= AMPERSAND '&' (Rose-Copper / Terracotta Intertwined Flourish) ================= */}
        <g id="ampersand">
          <path
            d="M 235 195 C 242 162 262 140 284 148 C 302 155 308 178 296 208 C 282 242 254 274 228 305 C 205 332 178 360 178 382 C 178 406 206 418 238 412 C 268 405 298 384 324 356 C 342 336 352 312 352 288 C 352 280 348 276 342 278 C 336 280 334 288 334 295 C 334 315 324 335 308 352 C 285 376 258 394 234 398 C 214 402 196 394 196 376 C 196 358 218 332 240 306 C 268 274 298 238 312 202 C 326 166 318 135 292 125 C 264 115 236 142 225 182 C 220 200 220 215 224 228 L 235 195 Z"
            fill={colors.ampersand}
          />
          {/* Graceful lower loop trailing accent flourish */}
          <path
            d="M 276 348 C 298 362 325 378 356 388 C 382 396 405 394 415 385 C 418 382 416 378 410 378 C 398 378 378 372 355 364 C 328 354 302 340 282 328 Z"
            fill={colors.ampersand}
            opacity="0.95"
          />
        </g>

        {/* ================= LETTER 'S' (Terracotta Rust-Red Haute Roman Serif) ================= */}
        <g id="letter-s">
          <path
            d="M 428 178 L 436 122 L 396 122 C 352 122 308 142 308 184 C 308 218 335 238 368 258 C 408 282 445 312 445 362 C 445 418 395 442 335 442 C 285 442 248 422 238 388 L 292 388 C 298 402 315 415 342 415 C 378 415 408 395 408 360 C 408 325 380 305 344 282 C 304 256 272 230 272 182 C 272 130 322 102 382 102 C 418 102 442 112 452 125 L 442 178 Z"
            fill={colors.sColor}
          />
        </g>

        {/* ================= WORD 'OFFICIAL' (Clean Geometric Sans-Serif Under 'S') ================= */}
        {showWear && !iconOnly && (
          <text
            x="410"
            y="468"
            textAnchor="middle"
            fill={colors.wearText}
            fontFamily="'Montserrat', sans-serif"
            fontSize="21"
            fontWeight="700"
            letterSpacing="6"
            className={hideWearOnMobile ? 'hidden sm:block' : 'block'}
          >
            OFFICIAL
          </text>
        )}
      </svg>
    </div>
  );
};
