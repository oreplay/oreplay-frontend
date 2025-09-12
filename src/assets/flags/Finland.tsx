import { createSvgIcon } from "@mui/material"

const FinlandFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <path fill="#fff" d="M0 0h18v11H0z" />
      <path stroke="#002F6C" strokeWidth={3} d="M0 5.5h18M6.5 0v11" />
    </g>
  </svg>,
  "FinlandFlag",
)

export default FinlandFlag
