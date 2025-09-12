import { createSvgIcon } from "@mui/material"

const ChinaFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
    <defs>
      <mask id="roundMask">
        <rect x="0" y="0" width="50" height="30" rx="4" ry="4" fill="white" />
      </mask>
      <g id="star">
        <polygon
          points="0,-1 0.2245,-0.309 0.9511,-0.309 0.3633,0.118 0.5878,0.809 -0,0.382 -0.5878,0.809 -0.3633,0.118 -0.9511,-0.309 -0.2245,-0.309"
          fill="#ffde00"
        />
      </g>
    </defs>

    <g mask="url(#roundMask)">
      <rect width="50" height="30" fill="#de2910" />

      {/* Large star (about 1/4 of flag height) */}
      <g transform="translate(8,7.5) scale(7.5)">
        <use href="#star" />
      </g>

      {/* Small stars, bigger than before but proportionally smaller than main star */}
      <g transform="translate(20,4) rotate(20) scale(2.5)">
        <use href="#star" />
      </g>
      <g transform="translate(24,8) rotate(45) scale(2.5)">
        <use href="#star" />
      </g>
      <g transform="translate(24,15) rotate(70) scale(2.5)">
        <use href="#star" />
      </g>
      <g transform="translate(20,19) rotate(20) scale(2.5)">
        <use href="#star" />
      </g>
    </g>
  </svg>,
  "ChinaFlag",
)

export default ChinaFlag
