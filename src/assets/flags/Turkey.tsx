import { createSvgIcon } from "@mui/material"

const TurkeyFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      <path fill="#e30a17" d="M0-30000h90000v60000H0z" />
      <path
        fill="#fff"
        d="m41750 0 13568-4408-8386 11541V-7133l8386 11541zm925 8021a15000 15000 0 1 1 0-16042 12000 12000 0 1 0 0 16042z"
      />
    </g>
  </svg>,
  "TurkeyFlag",
)

export default TurkeyFlag
