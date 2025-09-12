import { createSvgIcon } from "@mui/material"

const ChinaFlag = createSvgIcon(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
    <defs>
      <clipPath id="roundClip">
        <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundClip)">
      {/* Fondo rojo */}
      <rect width="900" height="600" fill="#DE2910" />

      <polygon
        points="150,100 161,154 218,154 168,190 180,250 150,220 120,250 132,190 82,154 139,154"
        fill="#FFDE00"
      />

      <polygon
        points="250,60 256,80 276,80 259,92 265,112 250,101 235,112 241,92 224,80 244,80"
        fill="#FFDE00"
      />
      <polygon
        points="290,100 296,120 316,120 299,132 305,152 290,141 275,152 281,132 264,120 284,120"
        fill="#FFDE00"
      />
      <polygon
        points="290,160 296,180 316,180 299,192 305,212 290,201 275,212 281,192 264,180 284,180"
        fill="#FFDE00"
      />
      <polygon
        points="250,200 256,220 276,220 259,232 265,252 250,241 235,252 241,232 224,220 244,220"
        fill="#FFDE00"
      />
    </g>
  </svg>,
  "ChinaFlag",
)

export default ChinaFlag
