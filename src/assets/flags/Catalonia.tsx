import { createSvgIcon } from "@mui/material"

const CataloniaFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
    </defs>

    <g mask="url(#roundMask)">
      {/* Background yellow */}
      <rect width="50" height="30" fill="#FCDD09" />

      {/* 4 red stripes */}
      <rect y="3.33" width="50" height="3.33" fill="#DA121A" />
      <rect y="10" width="50" height="3.33" fill="#DA121A" />
      <rect y="16.67" width="50" height="3.33" fill="#DA121A" />
      <rect y="23.33" width="50" height="3.33" fill="#DA121A" />
    </g>
  </svg>,
  "CataloniaFlag",
)

export default CataloniaFlag
