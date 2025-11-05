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
  IconButton,
  Typography,
  Alert,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import MainContainer from '../components/main-container.tsx';
import { CreateFixedCost, FixedCost } from '../schemas/fixed-cost.ts';
import {
  useFixedCosts,
  useCreateFixedCost,
  useDeleteFixedCost,
} from '../hooks/use-fixed-costs.ts';

const defaultFormState: CreateFixedCost = {
  description: '',
  cost: 0,
};

const FixedCostsPage: React.FC = () => {
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [formState, setFormState] = useState<CreateFixedCost>(defaultFormState);
  const [error, setError] = useState<string | null>(null);

  // React Query hooks
  const { data: fixedCosts = [], isLoading, isError } = useFixedCosts();
  const createFixedCost = useCreateFixedCost();
  const deleteFixedCost = useDeleteFixedCost();

  // Handlers
  const handleOpenDialog = () => {
    setFormState(defaultFormState);
    setError(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormState(defaultFormState);
    setError(null);
  };

  const handleFormChange = (
    field: keyof CreateFixedCost,
    value: string | number
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleCreateFixedCost = async () => {
    if (!formState.description.trim()) {
      setError('Description is required');
      return;
    }
    if (formState.cost <= 0) {
      setError('Cost must be a positive number');
      return;
    }

    try {
      await createFixedCost.mutateAsync(formState);
      enqueueSnackbar('Fixed cost created successfully', {
        variant: 'success',
      });
      handleCloseDialog();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to create fixed cost';
      setError(errorMsg);
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  const handleDeleteFixedCost = async (id: number, description: string) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      try {
        await deleteFixedCost.mutateAsync(id);
        enqueueSnackbar('Fixed cost deleted successfully', {
          variant: 'success',
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to delete fixed cost';
        enqueueSnackbar(errorMsg, { variant: 'error' });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCostTypeColor = (
    costType: string
  ): 'primary' | 'secondary' | 'warning' | 'default' => {
    switch (costType) {
      case 'RESTOCK':
        return 'primary';
      case 'PAYCHECK':
        return 'secondary';
      case 'BILLING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const totalCost = fixedCosts.reduce((sum, cost) => sum + cost.cost, 0);

  return (
    <MainContainer title='Fixed Costs'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4' component='h1'>
          Fixed Costs
        </Typography>
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Fixed Cost
        </Button>
      </Box>

      {isError && (
        <Alert severity='error' sx={{ mb: 2 }}>
          Failed to load fixed costs. Please try again later.
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
        <>
          <Paper sx={{ mb: 2, p: 2 }}>
            <Typography variant='h6'>
              Total Fixed Costs: {formatCurrency(totalCost)}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {fixedCosts.length}{' '}
              {fixedCosts.length === 1 ? 'entry' : 'entries'}
            </Typography>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fixedCosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align='center'>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ py: 4 }}
                      >
                        No fixed costs found. Click "Add Fixed Cost" to create
                        one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  fixedCosts.map((cost: FixedCost) => (
                    <TableRow key={cost.id}>
                      <TableCell>{cost.description}</TableCell>
                      <TableCell>{formatCurrency(cost.cost)}</TableCell>
                      <TableCell>
                        <Chip
                          label={cost.costType}
                          color={getCostTypeColor(cost.costType)}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>{formatDate(cost.createdAt)}</TableCell>
                      <TableCell align='right'>
                        <IconButton
                          color='error'
                          onClick={() =>
                            handleDeleteFixedCost(cost.id, cost.description)
                          }
                          size='small'
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Create Fixed Cost Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen={fullScreenDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Add Fixed Cost</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {error && (
              <Alert severity='error' onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            <TextField
              label='Description'
              value={formState.description}
              onChange={e => handleFormChange('description', e.target.value)}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label='Cost'
              type='number'
              value={formState.cost}
              onChange={e =>
                handleFormChange('cost', parseFloat(e.target.value) || 0)
              }
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='inherit'>
            Cancel
          </Button>
          <Button
            onClick={handleCreateFixedCost}
            variant='contained'
            color='primary'
            disabled={createFixedCost.isPending}
          >
            {createFixedCost.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainContainer>
  );
};

export default FixedCostsPage;
