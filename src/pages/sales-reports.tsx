// src/pages/sales-reports.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
  Typography,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Add as AddIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import MainContainer from '../components/main-container.tsx';
import {
  useReports,
  useCreateReport,
  useDownloadReport,
} from '../hooks/use-reports.ts';
import { Report, CreateReportCommand } from '../schemas/report.ts';

const defaultFormState: CreateReportCommand = {
  from: '',
  to: '',
  title: '',
};

const SalesReportsPage: React.FC = () => {
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [formState, setFormState] =
    useState<CreateReportCommand>(defaultFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Hooks
  const { data: reports, isLoading, error } = useReports();
  const createReportMutation = useCreateReport();
  const downloadReportMutation = useDownloadReport();

  // Handlers
  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
    setFormState(defaultFormState);
    setFormErrors({});
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setFormState(defaultFormState);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formState.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formState.from) {
      errors.from = 'Start date is required';
    }

    if (!formState.to) {
      errors.to = 'End date is required';
    }

    if (formState.from && formState.to && formState.from > formState.to) {
      errors.to = 'End date must be after start date';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateReport = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await createReportMutation.mutateAsync(formState);
      handleCloseCreateDialog();
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  const handleDownloadReport = (report: Report) => {
    downloadReportMutation.mutate(report);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MainContainer title='Sales Reports'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4' component='h1'>
          Sales Reports
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          disabled={createReportMutation.isPending}
          data-testid='create-report-button'
        >
          Generate New Report
        </Button>
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          Failed to load reports. Please try again.
        </Alert>
      )}

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={2}
          data-testid='reports-table'
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Report Name</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Generated At</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports && reports.length > 0 ? (
                reports.map(report => (
                  <TableRow key={report.id} hover data-testid='report-row'>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <DescriptionIcon color='primary' />
                        <Typography variant='body2'>
                          Report #{report.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant='body2'>
                          {formatDate(report.fromDate)} -{' '}
                          {formatDate(report.toDate)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatDateTime(report.generatedAt)}
                        size='small'
                        variant='outlined'
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant='body2'
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {report.fileName}
                      </Typography>
                    </TableCell>
                    <TableCell align='center'>
                      <IconButton
                        color='primary'
                        onClick={() => handleDownloadReport(report)}
                        disabled={downloadReportMutation.isPending}
                        title='Download Report'
                        data-testid='download-report-button'
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    <Box sx={{ py: 4 }} data-testid='reports-empty'>
                      <Typography variant='body1' color='text.secondary'>
                        No reports available. Generate your first report to get
                        started.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Report Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        fullScreen={fullScreenDialog}
        maxWidth='sm'
        fullWidth
        data-testid='create-report-dialog'
      >
        <DialogTitle>Generate Sales Report</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label='Report Title'
              fullWidth
              value={formState.title}
              onChange={e =>
                setFormState({ ...formState, title: e.target.value })
              }
              error={!!formErrors.title}
              helperText={formErrors.title}
              placeholder='e.g., Q1 Sales Report'
              inputProps={{ 'data-testid': 'report-title-input' }}
            />
            <TextField
              label='From Date'
              type='date'
              fullWidth
              value={formState.from}
              onChange={e =>
                setFormState({ ...formState, from: e.target.value })
              }
              error={!!formErrors.from}
              helperText={formErrors.from}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ 'data-testid': 'report-from-date-input' }}
            />
            <TextField
              label='To Date'
              type='date'
              fullWidth
              value={formState.to}
              onChange={e => setFormState({ ...formState, to: e.target.value })}
              error={!!formErrors.to}
              helperText={formErrors.to}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ 'data-testid': 'report-to-date-input' }}
            />
            <Alert severity='info'>
              The report will be generated and automatically downloaded as a PDF
              file.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseCreateDialog}
            data-testid='report-dialog-cancel'
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateReport}
            variant='contained'
            disabled={createReportMutation.isPending}
            data-testid='report-dialog-submit'
          >
            {createReportMutation.isPending
              ? 'Generating...'
              : 'Generate Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainContainer>
  );
};

export default SalesReportsPage;
