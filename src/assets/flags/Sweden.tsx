import { createSvgIcon } from "@mui/material"

const SwedenFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <path fill="#005293" d="M0 0h8v5H0Z" />
      <path stroke="#fecb00" d="M0 2.5h8M3 0v5" />
    </g>
  </svg>,
  "SwedenFlag",
)

export default SwedenFlag
