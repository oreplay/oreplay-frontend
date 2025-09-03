import { createSvgIcon } from "@mui/material"

const CataloniaFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 810 540">
    <defs>
      {/* Rounded mask */}
      <clipPath id="roundClip">
        <rect x="0" y="0" width="810" height="540" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      {/* Background yellow */}
      <rect width="810" height="540" fill="#FCDD09" />

      {/* 4 red stripes */}
      <rect y="60" width="810" height="60" fill="#DA121A" />
      <rect y="180" width="810" height="60" fill="#DA121A" />
      <rect y="300" width="810" height="60" fill="#DA121A" />
      <rect y="420" width="810" height="60" fill="#DA121A" />
    </g>
  </svg>,
  "CataloniaFlag",
)

export default CataloniaFlag
