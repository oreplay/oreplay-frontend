import { createSvgIcon } from "@mui/material"

const PolandFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <path fill="#dc143c" d="M0 0h8v5H0z" />
      <path fill="#fff" d="M0 0h8v2.5H0z" />
    </g>
  </svg>,
  "PolandFlag",
)

export default PolandFlag
