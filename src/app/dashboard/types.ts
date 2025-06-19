export interface Email {
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

export interface Filters {
  query: string;
  max_results: number;
  is_unread: boolean;
  include_spam: boolean;
  date_after: string;
  date_before: string;
}

export interface HeaderProps {
  theme: any;
  loading: boolean;
  onRefresh: () => void;
}
// How my filter properties should be
export interface FiltersProps {
  theme: any;
  loading: boolean;
  searchEmail: string;
  filters: Filters;
  setSearchEmail: (value: string) => void;
  handleFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fetchEmails: () => void;
}

export interface EmailTableProps {
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

export interface EmailDialogProps {
  theme: any;
  openDialog: boolean;
  selectedEmail: Email | null;
  handleCloseDialog: () => void;
}
