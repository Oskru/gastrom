// src/pages/EmployeesPage.tsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  IconButton,
  Tooltip,
  Typography,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import MainContainer from '../components/main-container';
import { EmployeeDto, CreateEmployeeCommand } from '../schemas/employee';
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployeeHours,
  useGenerateEmployeeSalary,
  useDeleteEmployee,
} from '../hooks/use-employees';

const defaultFormState: CreateEmployeeCommand = {
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  salaryPerHour: 0,
};

const EmployeesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openHoursDialog, setOpenHoursDialog] = useState<boolean>(false);
  const [formState, setFormState] =
    useState<CreateEmployeeCommand>(defaultFormState);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDto | null>(
    null
  );
  const [hoursToUpdate, setHoursToUpdate] = useState<number>(0);
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');

  // Use React Query hooks
  const { data: employees = [], isLoading: loading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const updateHours = useUpdateEmployeeHours();
  const generateSalary = useGenerateEmployeeSalary();
  const deleteEmployee = useDeleteEmployee();

  // Get employeeId from URL params
  const employeeIdParam = searchParams.get('employeeId');
  const filteredEmployeeId = employeeIdParam
    ? parseInt(employeeIdParam, 10)
    : null;

  // Filter and sort employees
  const displayedEmployees = useMemo(() => {
    let result = [...employees];

    // Filter by employeeId if param exists
    if (filteredEmployeeId !== null && !isNaN(filteredEmployeeId)) {
      result = result.filter(emp => emp.id === filteredEmployeeId);
    }

    // Sort by id (least to most)
    result.sort((a, b) => a.id - b.id);

    return result;
  }, [employees, filteredEmployeeId]);

  // Clear filter
  const handleClearFilter = () => {
    setSearchParams({});
  };

  // Open dialog for creating a new employee
  const handleOpenDialogForCreate = () => {
    setFormState(defaultFormState);
    setOpenDialog(true);
  };

  // Open dialog for updating hours
  const handleOpenHoursDialog = (employee: EmployeeDto) => {
    setSelectedEmployee(employee);
    setHoursToUpdate(0);
    setOpenHoursDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseHoursDialog = () => {
    setOpenHoursDialog(false);
  };

  // Handle text field changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'salaryPerHour' ? Number(value) : value,
    }));
  };

  // Submit form to create employee
  const handleSubmit = () => {
    // Close dialog immediately for optimistic UX
    handleCloseDialog();

    // Trigger mutation (optimistic update will show it immediately)
    createEmployee.mutate(formState, {
      onSuccess: () => {
        setSnackbarMsg('Employee created successfully');
      },
      onError: err => {
        const error = err as Error;
        setError(error.message || 'Failed to save employee');
      },
    });
  };

  // Update employee hours
  const handleUpdateHours = async () => {
    if (!selectedEmployee) return;
    try {
      await updateHours.mutateAsync({
        id: selectedEmployee.id,
        hours: hoursToUpdate,
      });
      setSnackbarMsg('Hours updated successfully');
      handleCloseHoursDialog();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to update hours');
    }
  };

  // Generate salary
  const handleGenerateSalary = async (id: number) => {
    if (!window.confirm('Generate salary for this employee?')) return;
    try {
      await generateSalary.mutateAsync(id);
      setSnackbarMsg('Salary generated successfully');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to generate salary');
    }
  };

  // Delete an employee
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }
    try {
      await deleteEmployee.mutateAsync(id);
      setSnackbarMsg('Employee deleted successfully');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to delete employee');
    }
  };

  return (
    <MainContainer title='Employee Management'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4' component='h1'>
          Employees
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={handleOpenDialogForCreate}
        >
          Add Employee
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        {/* Filter section */}
        {filteredEmployeeId !== null && !isNaN(filteredEmployeeId) && (
          <Button
            variant='outlined'
            color='secondary'
            startIcon={<ClearIcon />}
            onClick={handleClearFilter}
          >
            Clear Filter
          </Button>
        )}
      </Box>

      {filteredEmployeeId !== null && !isNaN(filteredEmployeeId) && (
        <Alert severity='info' sx={{ mb: 2 }}>
          Showing employee with ID: {filteredEmployeeId}
        </Alert>
      )}

      {loading ? (
        <Box display='flex' justifyContent='center' mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Salary/Hour</TableCell>
                <TableCell>Hours Worked</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedEmployees.map(emp => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>
                    {emp.firstName} {emp.lastName}
                  </TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phoneNumber}</TableCell>
                  <TableCell>${emp.salaryPerHour.toFixed(2)}</TableCell>
                  <TableCell>{emp.hoursWorked}</TableCell>
                  <TableCell>
                    <Tooltip title='Update Hours'>
                      <IconButton
                        size='small'
                        onClick={() => handleOpenHoursDialog(emp)}
                      >
                        <TimeIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Generate Salary'>
                      <IconButton
                        size='small'
                        onClick={() => handleGenerateSalary(emp.id)}
                      >
                        <MoneyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete'>
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => handleDelete(emp.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {displayedEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    {filteredEmployeeId !== null && !isNaN(filteredEmployeeId)
                      ? `No employee found with ID: ${filteredEmployeeId}`
                      : 'No employees found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Employee Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Add Employee</DialogTitle>
        <DialogContent>
          <Box component='form' sx={{ mt: 2 }} noValidate>
            <TextField
              fullWidth
              label='First Name'
              name='firstName'
              value={formState.firstName}
              onChange={handleFormChange}
              margin='normal'
            />
            <TextField
              fullWidth
              label='Last Name'
              name='lastName'
              value={formState.lastName}
              onChange={handleFormChange}
              margin='normal'
            />
            <TextField
              fullWidth
              label='Email'
              name='email'
              type='email'
              value={formState.email}
              onChange={handleFormChange}
              margin='normal'
            />
            <TextField
              fullWidth
              label='Phone Number'
              name='phoneNumber'
              value={formState.phoneNumber}
              onChange={handleFormChange}
              margin='normal'
            />
            <TextField
              fullWidth
              label='Salary Per Hour'
              name='salaryPerHour'
              type='number'
              value={formState.salaryPerHour}
              onChange={handleFormChange}
              margin='normal'
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant='contained' color='primary'>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Hours Dialog */}
      <Dialog
        open={openHoursDialog}
        onClose={handleCloseHoursDialog}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>Update Hours Worked</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <Box sx={{ mt: 2 }}>
              <Typography variant='body1' gutterBottom>
                Employee: {selectedEmployee.firstName}{' '}
                {selectedEmployee.lastName}
              </Typography>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Current Hours: {selectedEmployee.hoursWorked}
              </Typography>
              <TextField
                fullWidth
                label='Hours to Add'
                type='number'
                value={hoursToUpdate}
                onChange={e => setHoursToUpdate(Number(e.target.value))}
                margin='normal'
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHoursDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateHours}
            variant='contained'
            color='primary'
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg('')}
        message={snackbarMsg}
      />
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError(null)}
          message={error}
        />
      )}
    </MainContainer>
  );
};

export default EmployeesPage;
