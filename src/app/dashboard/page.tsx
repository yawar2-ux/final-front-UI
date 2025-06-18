'use client';
//Declares that this is a Client Component in Next.js, meaning it runs on the client side (browser) rather than the server. This is necessary for components that use client-side interactivity like useState or useEffect

import * as React from 'react';
import { useState, useEffect } from 'react';
//Imports the entire React library and specific hooks (useState for state management, useEffect for side effects like API calls).
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
// Imports various components from Material-UI (@mui/material):
// Layout: Box, Card, CardContent, Paper, Grid
// Table: Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TableSortLabel
// Typography: Typography for text rendering
// Indicators: CircularProgress for loading, Chip for status/labels, Avatar for user initials
// Interactivity: Tooltip, IconButton, Button, TextField, InputAdornment, FormControlLabel, Checkbox
// Dialog: Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions for modal
// Animation: Fade for transition effects
// Theme: useTheme for accessing MUI theme, alpha for color transparency
import { Refresh, Email, MarkEmailRead, MarkEmailUnread, Search, FilterList, CalendarToday, Person, Label, SearchOff, Clear } from '@mui/icons-material';
//Imports Material-UI icons used in the UI (e.g., Refresh for refreshing emails, Search for search input, etc.).
interface Email {
  id: string;
  thread_id: string;
  sender: string;
  recipient: string;
  cc?: string;
  bcc?: string;
  body?: string;
  subject: string;
  date: string;
  email_received_at: string;
  unread: boolean;
  labels: string[];
}
// Defines the TypeScript Email interface to type the email objects fetched from the API. Each email has:
// id: Unique identifier
// thread_id: Thread identifier
// sender: Sender's email address
// recipient: Recipient's email address
// subject: Email subject
// date: Email date (likely redundant with email_received_at)
// email_received_at: Timestamp when email was received
// unread: Boolean indicating if the email is unread
// labels: Array of label strings (e.g., "Important", "Spam")

interface Filters {
  query: string;
  max_results: number;
  is_unread: boolean;
  include_spam: boolean;
  date_after: string;
  date_before: string;
}
// Defines the Filters interface for the search and filter state. It includes:
// query: Search query (e.g., sender's email)
// max_results: Maximum number of emails to fetch
// is_unread: Filter for unread emails
// include_spam: Include spam emails in results
// date_after: Start date filter
// date_before: End date filter

export default function EmailDashboard() {
  // Defines and exports the EmailDashboard functional component.
  const theme = useTheme();
  //Uses the useTheme hook to access the MUI theme for consistent styling (e.g., colors, typography).
  const [emails, setEmails] = useState<Email[]>([]);
  //Declares a state variable emails (array of Email objects) to store fetched emails, initialized as an empty array. setEmails updates this state.

  const [loading, setLoading] = useState<boolean>(false);
  //Declares a loading state (boolean) to track whether emails are being fetched, initialized as false. setLoading updates it.
  const [error, setError] = useState<string | null>(null);
  //Declares an error state (string or null) to store any errors that occur during email fetching, initialized as null. setError updates it.
  const [page, setPage] = useState(0);
  //Declares an error state (string or null) to store error messages from API calls, initialized as null. setError updates it.
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //Declares a rowsPerPage state (number) to store the number of emails to display per page, initialized as 10. setRowsPerPage updates it.
  const [orderBy, setOrderBy] = useState<keyof Email>('email_received_at');
  //Declares an orderBy state (key of Email) to store the current sorting column, initialized as 'email_received_at'. setOrderBy updates it.
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  //Declares an order state ('asc' | 'desc') to store the current sorting order, initialized as 'desc'. setOrder updates it.
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  //Declares a selectedEmail state (Email or null) to store the currently selected email, initialized as null. setSelectedEmail updates it.
  const [openDialog, setOpenDialog] = useState(false);
  //Declares an openDialog state (boolean) to control whether the email details dialog is open, initialized as false. setOpenDialog updates it.
  const [hasSearched, setHasSearched] = useState(false);
  //Declares a hasSearched state (boolean) to store whether a search has been performed, initialized as false. setHasSearched updates it.
  const [filters, setFilters] = useState<Filters>({
    query: '',
    max_results: 20,
    is_unread: false,
    include_spam: false,
    date_after: '',
    date_before: ''
  });
  //Declares a filters state (type Filters) to store filter settings, initialized with default values. setFilters updates it.
  const [searchEmail, setSearchEmail] = useState('');
//Declares a searchEmail state (string) for the sender email search input, initialized as an empty string. setSearchEmail updates it.
  const fetchEmails = async () => {
    //Defines an asynchronous function fetchEmails to fetch emails from the API.
    try {
      //Starts a try block to handle potential errors during the API call.
      setLoading(true);
      //Sets loading to true to show a loading indicator.
      setError(null);
      //Sets error to null to clear any previous error messages.
      setHasSearched(true);
      //Sets hasSearched to true to indicate a search has been performed.

      const params = new URLSearchParams({
        max_results: filters.max_results.toString(),
        is_unread: filters.is_unread.toString(),
        include_spam: filters.include_spam.toString(),
        ...(searchEmail && { sender: searchEmail }),  // Add sender filter if searchEmail exists
        ...(filters.query && { query: filters.query }),
        ...(filters.date_after && { date_after: filters.date_after }),
        ...(filters.date_before && { date_before: filters.date_before })
      });
//       Creates a URLSearchParams object to build query parameters for the API request:
// Always includes max_results, is_unread, and include_spam (converted to strings).
// Conditionally includes sender if searchEmail is non-empty.
// Conditionally includes query, date_after, and date_before if they are non-empty using the spread operator (...).
      const response = await fetch(`http://127.0.0.1:8000/rag_doc/Automated_email_response/api/fetch-emails?${params.toString()}`);
      //Sends an HTTP GET request to the API endpoint (http://127.0.0.1:8000/...) with the query parameters. await waits for the response.
      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }
      //Checks if the response is not OK (status code outside 200–299). If so, throws an error.
      const data = await response.json();
      //Parses the response body as JSON.
      setEmails(data.emails || []);
      //Updates the emails state with the emails array from the response, or an empty array if data.emails is undefined.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching emails:', err);
    }
    //Catches any errors during the API call:
// Sets the error state to the error message (or a generic message if not an Error instance).
// Logs the error to the console.
    finally {
      setLoading(false);
    }
    //Runs in the finally block to set loading to false, ensuring the loading indicator is hidden regardless of success or failure.
  };
  //close the fetchEmails function

  const handleSort = (property: keyof Email) => {
    //Defines a function to handle table column sorting, taking a property (key of Email) as an argument.
    const isAsc = orderBy === property && order === 'asc';
    //Checks if the current sort is ascending for the given property.
    setOrder(isAsc ? 'desc' : 'asc');
    //Toggles the sort order: if currently ascending, sets to descending, and vice versa.
    setOrderBy(property);
    //Sets the orderBy state to the clicked property
  };
  //Closes the handleSort function.

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  //Defines a function to handle page changes, taking an event and a newPage number as arguments.

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //Handles changes to the number of rows per page:
// Updates rowsPerPage with the new value (parsed as an integer).
// Resets page to 0 to start from the first page.

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
//Formats a date string into a human-readable format using toLocaleString() (e.g., "6/18/2025, 12:45:00 PM").
  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (email: string | undefined): string => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#0288d1', '#689f38', '#ffa000'];
    if (!email || email.length === 0) {
      return colors[0]; // Return a default color if email is undefined or empty
    }
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  //Generates a color for avatars based on the email:
// Defines an array of color hex codes.
// Uses the ASCII code of the email’s first character modulo the array length to select a color.

const sortedEmails = [...emails].sort((a, b) => {
  const aValue = a[orderBy] || '';  // Fallback to empty string if undefined
  const bValue = b[orderBy] || '';  // Fallback to empty string if undefined

  if (aValue < bValue) {
    return order === 'asc' ? -1 : 1;
  }
  if (aValue > bValue) {
    return order === 'asc' ? 1 : -1;
  }
  return 0;
});
  // Sorts emails based on orderBy and order:
  // If a[orderBy] is less than b[orderBy], returns -1 for ascending or 1 for descending.
  // If a[orderBy] is greater, returns 1 for ascending or -1 for descending.
  // If equal, returns 0 (no change in order).

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - emails.length) : 0;
  //Calculates the number of empty rows to display based on pagination:
// If page is greater than 0, calculates the number of empty rows needed to fill the current page.
// Uses Math.max to ensure non-negative values.
// (1 + page) * rowsPerPage - emails.length: Calculates the total number of rows needed for the current page.
// If page is 0, returns 0 (no empty rows).

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setOpenDialog(true);
  };
//   Handles clicking an email row:
// Sets selectedEmail to the clicked email.
// Opens the dialog by setting openDialog to true.

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
  //Closes the email details dialog:
// Sets openDialog to false.
// Clears selectedEmail.

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value });
  };

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      overflowX: 'hidden', 
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      p: 3,
      boxSizing: 'border-box' 
    }}>
      {/* The main container <Box>:
Full width, minimum height of viewport, hidden horizontal overflow.
Gradient background using theme colors with low opacity.
Padding of 3 units, box-sizing set to border-box. */}
      <Fade in timeout={800}>
        <Card sx={{ 
          //Wraps the main content in a Fade animation with an 800ms duration.
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '100%', 
          overflow: 'hidden' 
        }}>
          {/* A <Card> component for the main content area:
Margin bottom, rounded corners, shadow, semi-transparent white background with blur effect.
Full width, hidden overflow. */}
          <CardContent sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            '&:last-child': { 
              pb: { xs: 2, sm: 3, md: 4 } 
            } 
            //<CardContent> with responsive padding based on screen size (xs, sm, md)
          }}>
            {/* Header Section */}
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
                  onClick={handleRefresh}
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
            {/* End Header Section */}

            {/* Enhanced Filter Section */}
            <Paper 
              component="form" 
              onSubmit={(e) => {
                e.preventDefault();
                fetchEmails();
              }}
              sx={{ 
                mb: 4, 
                p: 3, 
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden', 
                maxWidth: '100%' 
              }}
            >
              {/* A <Paper> component styled as a form for filters:
Submits to fetchEmails() on form submission.
Margin bottom, padding, semi-transparent background, subtle border and shadow, rounded corners, auto overflow. */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <FilterList color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Filters & Search
                </Typography>
              </Box>
              {/* A <Box> with flex layout, centered items, gap, and margin-bottom. */}
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by sender email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchEmails()}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: searchEmail && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setSearchEmail('')}
                          >
                            <Clear fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: theme.palette.background.paper,
                      },
                    }}
                  />
                </Grid>
                
                <Grid item xs={6} sm={3} md={2}>
                  <TextField
                    fullWidth
                    label="Max Results"
                    name="max_results"
                    type="number"
                    value={filters.max_results}
                    onChange={handleFilterChange}
                    variant="outlined"
                    size="small"
                    inputProps={{
                      min: 1,
                      max: 1000,
                      step: 1
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={6} sm={3} md={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="is_unread"
                        checked={filters.is_unread}
                        onChange={handleFilterChange}
                        color="primary"
                        sx={{
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MarkEmailUnread fontSize="small" />
                        Unread
                      </Box>
                    }
                  />
                </Grid>
                
                <Grid item xs={6} sm={3} md={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="include_spam"
                        checked={filters.include_spam}
                        onChange={handleFilterChange}
                        color="primary"
                      />
                    }
                    label="Include Spam"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={fetchEmails}
                    disabled={loading}
                    startIcon={<Search />}
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                      },
                      transition: 'all 0.3s ease',
                      '&.Mui-disabled': {
                        background: '#bbdefb',
                        color: 'white'
                      }
                    }}
                  >
                    {loading ? 'Executing...' : 'Execute'}
                  </Button>
                </Grid>
                {/* Grid item for search button:
Full-width contained button submits the form, disabled when loading.
Search> icon, light blue background, hover effects (lighter blue, shadow, lift).
Text changes to "Searching..." when loading. */}
              </Grid>

              <Grid container spacing={3} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Date From"
                    name="date_after"
                    type="date"
                    value={filters.date_after}
                    onChange={handleFilterChange}
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday fontSize="small" color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Date To"
                    name="date_before"
                    type="date"
                    value={filters.date_before}
                    onChange={handleFilterChange}
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday fontSize="small" color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

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
                <SearchOff sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.8 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No emails found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '500px' }}>
                  Try adjusting your search criteria or filters.
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emails.length > 0 
                      ? `Showing ${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, emails.length)} of ${emails.length} emails`
                      : 'No emails to display'}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={fetchEmails}
                    disabled={loading}
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
            )}
          </CardContent>
        </Card>
      </Fade>

      {/* Enhanced Email Detail Dialog */}
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
                          {selectedEmail.labels.map((label) => (
                            <Chip 
                              key={label} 
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

      <style jsx global>{`
        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}