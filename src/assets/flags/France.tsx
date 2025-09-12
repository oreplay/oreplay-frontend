import { createSvgIcon } from "@mui/material";

const FranceFlag = createSvgIcon(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
        <defs>
            <clipPath id="roundClip">
                <rect x="0" y="0" width="900" height="600" rx="80" ry="80" />
            </clipPath>
        </defs>

        <g clipPath="url(#roundClip)">
            <rect width="300" height="600" fill="#0055A4" />
            <rect x="300" width="300" height="600" fill="#FFFFFF" />
            <rect x="600" width="300" height="600" fill="#EF4135" />
        </g>
    </svg>,
    "FranceFlag"
);

export default FranceFlag;
