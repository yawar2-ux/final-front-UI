import * as React from 'react';
import { Box, Paper, Typography, Grid, TextField, InputAdornment, FormControlLabel, Checkbox, Button, IconButton } from '@mui/material';
import { FilterList, Person, MarkEmailUnread, Search, CalendarToday, Clear } from '@mui/icons-material';
import { Filters } from './types';

interface FiltersProps {
  theme: any;
  loading: boolean;
  searchEmail: string;
  filters: Filters;
  setSearchEmail: (value: string) => void;
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fetchEmails: () => void;
}

const FiltersSection: React.FC<FiltersProps> = ({ theme, loading, searchEmail, filters, setSearchEmail, handleFilterChange, fetchEmails }) => (
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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
      <FilterList color="primary" />
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
        Filters & Search
      </Typography>
    </Box>
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
            }}
          }
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
            }}
          }
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
            }}
          }
        />
      </Grid>
    </Grid>
  </Paper>
);

export default FiltersSection;
