import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, Typography, Paper, Grid, Chip, Avatar, Button, alpha, Theme } from '@mui/material';
import { Email } from './types';

export interface EmailDialogProps {
  theme: Theme;
  openDialog: boolean;
  selectedEmail: Email | null;
  handleCloseDialog: () => void;
}

const EmailDialog: React.FC<EmailDialogProps> = ({ theme, openDialog, selectedEmail, handleCloseDialog }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (email: string | undefined): string => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#0288d1', '#689f38', '#ffa000'];
    if (!email || email.length === 0) {
      return colors[0];
    }
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Dialog 
      open={openDialog} 
      onClose={handleCloseDialog} 
      maxWidth="md" 
      fullWidth
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
          pt: { xs: 2, sm: 5 },
          pb: { xs: 2, sm: 5 },
        },
        '& .MuiDialog-paper': {
          m: 0,
          maxHeight: '90vh',
          overflow: 'hidden',
        },
        '& .MuiDialogContent-root': {
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 200px)', 
          p: 0,
        },
      }}
    >
      {selectedEmail && (
        <>
          <DialogTitle sx={{ 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            pb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: getAvatarColor(selectedEmail.sender),
                  width: 50,
                  height: 50,
                  fontSize: '1.2rem',
                  fontWeight: 700
                }}
              >
                {getInitials(selectedEmail.sender)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {selectedEmail.subject || '(No subject)'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email Details
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <DialogContentText component="div">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                      From:
                    </Typography>
                    <Typography>{selectedEmail.sender}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                      To:
                    </Typography>
                    <Typography>{selectedEmail.recipient}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                      Date:
                    </Typography>
                    <Typography>{formatDate(selectedEmail.email_received_at)}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                      Status:
                    </Typography>
                    <Chip 
                      label={selectedEmail.unread ? 'Unread' : 'Read'} 
                      color={selectedEmail.unread ? 'primary' : 'default'}
                      sx={{ mt: 0.5 }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                      Email ID:
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {selectedEmail.id}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                      CC:
                    </Typography>
                    <Typography>{selectedEmail.cc || 'N/A'}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                      BCC:
                    </Typography>
                    <Typography>{selectedEmail.bcc || 'N/A'}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                      Thread ID:
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {selectedEmail.thread_id}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                      Body:
                    </Typography>
                    <Box 
                      sx={{ 
                        mt: 1, 
                        p: 2, 
                        borderRadius: 1, 
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        minHeight: '100px',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit'
                      }}
                    >
                      {selectedEmail.body || 'No content'}
                    </Box>
                  </Paper>
                </Grid>
                {selectedEmail.labels && selectedEmail.labels.length > 0 && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                        Labels:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedEmail.labels
                          .filter((label: unknown): label is string => typeof label === 'string')
                          .map((label: string, index: number) => (
                          <Chip 
                            key={`${label}-${index}`}
                            label={label}
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <Button 
              onClick={handleCloseDialog}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default EmailDialog;
