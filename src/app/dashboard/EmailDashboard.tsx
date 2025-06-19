'use client';

import * as React from 'react';
import { useState, useCallback, ReactElement } from 'react';
import { Box, Card, CardContent, CircularProgress, Paper, Typography, Button, Fade, useTheme, alpha } from '@mui/material';
import { Search, SearchOff } from '@mui/icons-material';
import Header from './Header';
import FiltersSection from './FiltersSection';
import EmailTable from './EmailTable';
import EmailDialog from './EmailDialog';
import { Email, Filters } from './types';

interface EmailDashboardProps {
  // Add any props that EmailDashboard component expects
}

const EmailDashboard: React.FC<EmailDashboardProps> = (): ReactElement => {
  // State hooks at the top level of the component
  const theme = useTheme();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [orderBy, setOrderBy] = useState<keyof Email>('email_received_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    query: '',
    max_results: 20,
    is_unread: false,
    include_spam: false,
    date_after: '',
    date_before: ''
  });
  const [searchEmail, setSearchEmail] = useState<string>('');

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const params = new URLSearchParams({
        max_results: filters.max_results.toString(),
        is_unread: filters.is_unread.toString(),
        include_spam: filters.include_spam.toString(),
        ...(searchEmail && { sender: searchEmail }),
        ...(filters.query && { query: filters.query }),
        ...(filters.date_after && { date_after: filters.date_after }),
        ...(filters.date_before && { date_before: filters.date_before })
      });
      const response = await fetch(`http://127.0.0.1:8000/rag_doc/Automated_email_response/api/fetch-emails?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }
      const data = await response.json();
      setEmails(data.emails || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching emails:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, searchEmail]);

  const handleSort = (property: string | number | symbol) => {
    const emailProperty = property as keyof Email;
    const isAsc = orderBy === emailProperty && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(emailProperty);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmail(null);
  };

  const handleRefresh = () => {
    setSearchEmail('');
    setFilters({
      query: '',
      max_results: 20,
      is_unread: false,
      include_spam: false,
      date_after: '',
      date_before: ''
    });
    fetchEmails();
  };

  const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prevFilters: Filters) => ({
      ...prevFilters,
      [event.target.name]: event.target.type === 'checkbox' 
        ? (event.target as HTMLInputElement).checked 
        : event.target.value
    }));
  }, []);

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      overflowX: 'hidden', 
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      p: 3,
      boxSizing: 'border-box' 
    }}>
      <Fade in timeout={800}>
        <Card sx={{ 
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '100%', 
          overflow: 'hidden' 
        }}>
          <CardContent sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            '&:last-child': { 
              pb: { xs: 2, sm: 3, md: 4 } 
            } 
          }}>
            <Header theme={theme} loading={loading} onRefresh={handleRefresh} />
            <FiltersSection 
              theme={theme}
              loading={loading}
              searchEmail={searchEmail}
              filters={filters}
              setSearchEmail={setSearchEmail}
              handleFilterChange={handleFilterChange}
              fetchEmails={fetchEmails}
            />
            {!hasSearched ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minHeight: '300px',
                  textAlign: 'center',
                  p: 4
                }}
              >
                <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.8 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Enter your search criteria
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '500px', mb: 3 }}>
                  Use the filters above to search for emails. Click the "Search" button to see results.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={fetchEmails}
                  startIcon={<Search />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                    }
                  }}
                >
                  Search Emails
                </Button>
              </Box>
            ) : loading ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={6}>
                <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary">Loading emails...</Typography>
              </Box>
            ) : error ? (
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>⚠️ Error</Typography>
                <Typography>{error}</Typography>
              </Paper>
            ) : emails.length === 0 ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minHeight: '300px',
                  textAlign: 'center',
                  p: 4
                }}
              >
                <SearchOff sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No emails found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '500px', mb: 3 }}>
                  No emails match your current search criteria. Try adjusting your filters or search query.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleRefresh}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            ) : (
              <EmailTable
                theme={theme}
                emails={emails}
                order={order}
                orderBy={orderBy}
                page={page}
                rowsPerPage={rowsPerPage}
                handleSort={handleSort}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleEmailClick={handleEmailClick}
              />
            )}
          </CardContent>
        </Card>
      </Fade>

      {selectedEmail && (
        <EmailDialog
          openDialog={openDialog}
          selectedEmail={selectedEmail}
          handleCloseDialog={handleCloseDialog}
          theme={theme}
        />
      )}
    </Box>
  );
};

export default EmailDashboard;
