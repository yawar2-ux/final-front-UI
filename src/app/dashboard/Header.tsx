import * as React from 'react';
import { Box, Typography, Tooltip, IconButton, Theme } from '@mui/material';
import { Email, Refresh } from '@mui/icons-material';

export interface HeaderProps {
  theme: Theme;
  loading: boolean;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, loading, onRefresh }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        borderRadius: 2,
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '12px',
          padding: '2px',
          background: 'linear-gradient(45deg, #76ff03, #b2ff59, #76ff03)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        },
      }}>
        <Email sx={{ 
          color: 'white', 
          fontSize: 28,
          position: 'relative',
          zIndex: 1
        }} />
      </Box>
      <Box>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 0.5,
          textShadow: '0 2px 4px rgba(160, 32, 240, 0.1)'
        }}>
          Email Inbox
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and organize your email communications
        </Typography>
      </Box>
    </Box>
    <Tooltip title="Clear Filters & Refresh" arrow>
      <IconButton 
        onClick={onRefresh}
        disabled={loading}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary[700] || theme.palette.primary.dark})`,
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(160, 32, 240, 0.3)'
          },
          transition: 'all 0.3s ease',
          '&.Mui-disabled': {
            background: theme.palette.primary.main,
            color: 'white',
            opacity: 0.7
          },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%',
            padding: '2px',
            background: 'linear-gradient(45deg, #76ff03, #b2ff59, #76ff03)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          },
        }}
      >
        <Refresh sx={{ position: 'relative', zIndex: 1 }} />
      </IconButton>
    </Tooltip>
  </Box>
);

export default Header;
