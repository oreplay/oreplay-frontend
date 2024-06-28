import React from 'react';
import Button from '@mui/material/Button';
import DirectionsRun from '@mui/icons-material/DirectionsRun'; // Default icon
import { SxProps } from '@mui/system';

// Define the interface for the component props
interface CustomButtonProps {
  text: string;
  url: string;
  target?: string;
  icon?: React.ReactElement;
  size?: 'small' | 'medium' | 'large';
  sx?: SxProps;
}

// Functional component definition with typed props
const CustomButton: React.FC<CustomButtonProps> = ({ text, url, target, icon, size = 'large', sx }) => {
  return (
    <Button
      variant="contained"
      endIcon={icon || <DirectionsRun />} // Use the provided icon or default to DirectionsRun
      size={size}
      target={target}
      href={url}
      rel="noopener noreferrer" // Security feature for opening links in new tabs
      sx={{
        color: '#ffffff',
        fontSize: '1.1rem',
        padding: '12px 24px',
        width: { xs: '100%', sm: '100%', md: '100%', lg: 'auto' }, // Full-width on xs, sm, and md, auto on lg and above
        minWidth: '200px',
        ...sx // Apply additional styles if provided
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
