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
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        borderRadius: 2,
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Email sx={{ color: 'white', fontSize: 28 }} />
      </Box>
      <Box>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 0.5
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
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            transform: 'scale(1.05)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <Refresh />
      </IconButton>
    </Tooltip>
  </Box>
);

export default Header;
