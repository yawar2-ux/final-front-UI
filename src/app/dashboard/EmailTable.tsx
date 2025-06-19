import * as React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography, Chip, Avatar, Button, TablePagination, alpha } from '@mui/material';
import { Person, Label, Refresh } from '@mui/icons-material';
import { Email } from './types';

interface EmailTableProps {
  theme: any;
  emails: Email[];
  orderBy: keyof Email;
  order: 'asc' | 'desc';
  page: number;
  rowsPerPage: number;
  handleSort: (property: keyof Email) => void;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailClick: (email: Email) => void;
}

const EmailTable: React.FC<EmailTableProps> = ({
  theme,
  emails,
  orderBy,
  order,
  page,
  rowsPerPage,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEmailClick
}) => {
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

  const sortedEmails = [...emails].sort((a, b) => {
    const aValue = a[orderBy] || '';
    const bValue = b[orderBy] || '';
    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - emails.length) : 0;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {emails.length > 0 
            ? `Showing ${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, emails.length)} of ${emails.length} emails`
            : 'No emails to display'}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => handleSort('email_received_at')}
          disabled={false}
          startIcon={<Refresh />}
          size="small"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            '& .MuiButton-startIcon': {
              marginRight: 0.5
            }
          }}
        >
          Refresh
        </Button>
      </Box>
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxHeight: '70vh',
          borderRadius: 2,
          overflow: 'auto',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          '&::-webkit-scrollbar': {
            height: '8px',
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey[100],
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[400],
            borderRadius: '4px',
            '&:hover': {
              background: theme.palette.grey[500],
            },
          },
        }}
      >
        <Table stickyHeader sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ 
              '& th': { 
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                fontWeight: 700,
                fontSize: '0.9rem',
                py: 2,
                whiteSpace: 'nowrap'
              }
            }}>
              <TableCell sx={{ width: '60px' }}>#</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'sender'}
                  direction={orderBy === 'sender' ? order : 'asc'}
                  onClick={() => handleSort('sender')}
                  sx={{ 
                    '& .MuiTableSortLabel-icon': { 
                      color: `${theme.palette.primary.main} !important` 
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" />
                    Sender
                  </Box>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'recipient'}
                  direction={orderBy === 'recipient' ? order : 'asc'}
                  onClick={() => handleSort('recipient')}
                >
                  Recipient
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'subject'}
                  direction={orderBy === 'subject' ? order : 'asc'}
                  onClick={() => handleSort('subject')}
                >
                  Subject
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email_received_at'}
                  direction={orderBy === 'email_received_at' ? order : 'desc'}
                  onClick={() => handleSort('email_received_at')}
                >
                  Received At
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Label fontSize="small" />
                  Labels
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEmails
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((email, index) => (
                <TableRow
                  key={email.id}
                  hover
                  onClick={() => handleEmailClick(email)}
                  sx={{ 
                    bgcolor: email.unread ? alpha(theme.palette.primary.main, 0.05) : 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    },
                    animation: `fadeInRow 0.6s ease-in-out ${index * 0.1}s both`
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {page * rowsPerPage + index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          bgcolor: getAvatarColor(email.sender),
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {getInitials(email.sender)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: email.unread ? 600 : 400, color: 'text.primary' }}>
                          {email.sender}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {email.recipient}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: email.unread ? 600 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '300px'
                      }}
                    >
                      {email.subject || '(No subject)'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(email.email_received_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={email.unread ? 'Unread' : 'Read'} 
                      size="small" 
                      color={email.unread ? 'primary' : 'default'}
                      sx={{
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          px: 2
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {email.labels?.map((label) => (
                        <Chip 
                          key={label} 
                          label={label} 
                          size="small" 
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            fontSize: '0.7rem',
                            height: 24
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={emails.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          mt: 2,
          '& .MuiTablePagination-toolbar': {
            px: 2
          }
        }}
      />
    </>
  );
};

export default EmailTable;
