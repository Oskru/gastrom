// src/pages/EmployeesPage.tsx
import React, { useEffect, useState } from 'react';
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
  Checkbox,
  Snackbar,
} from '@mui/material';
import MainContainer from '../components/main-container';
import { apiInstance } from '../utils/api-instance';
import { Employee } from '../schemas/employee';

// For the form, we use a separate type. For the "authorities" field,
// we accept a comma-separated string which we later convert to an array.
interface FormState {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  position: string;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  authorities: string;
  username: string;
}

const defaultFormState: FormState = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  role: '',
  position: '',
  enabled: true,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  authorities: '',
  username: '',
};

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');

  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get<Employee[]>('/employees');
      setEmployees(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Open dialog for creating a new employee
  const handleOpenDialogForCreate = () => {
    setIsEdit(false);
    setFormState(defaultFormState);
    setOpenDialog(true);
  };

  // Open dialog for editing an existing employee
  const handleOpenDialogForEdit = (employee: Employee) => {
    setIsEdit(true);
    // Convert the authorities array into a comma-separated string
    const authoritiesString = employee.authorities
      .map(auth => auth.authority)
      .join(', ');
    setFormState({
      id: employee.id,
      email: employee.email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      password: employee.password,
      role: employee.role,
      position: employee.position,
      enabled: employee.enabled,
      accountNonExpired: employee.accountNonExpired,
      accountNonLocked: employee.accountNonLocked,
      credentialsNonExpired: employee.credentialsNonExpired,
      authorities: authoritiesString,
      username: employee.username,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle text field changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      // For numeric or boolean fields, you could add conversion logic if needed.
      [name]: value,
    }));
  };

  // Handle checkbox changes (for boolean fields)
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Submit form to create or update an employee
  const handleSubmit = async () => {
    try {
      // Convert the comma-separated authorities string to an array of objects
      const authoritiesArray = formState.authorities
        .split(',')
        .map(a => ({ authority: a.trim() }))
        .filter(a => a.authority);

      const payload = {
        email: formState.email,
        firstName: formState.firstName,
        lastName: formState.lastName,
        password: formState.password,
        role: formState.role,
        position: formState.position,
        enabled: formState.enabled,
        accountNonExpired: formState.accountNonExpired,
        accountNonLocked: formState.accountNonLocked,
        credentialsNonExpired: formState.credentialsNonExpired,
        authorities: authoritiesArray,
        username: formState.username,
      };

      if (isEdit && formState.id !== undefined) {
        await apiInstance.put(`/employees/${formState.id}`, {
          id: formState.id,
          ...payload,
        });
        setSnackbarMsg('Employee updated successfully');
      } else {
        await apiInstance.post('/employees', payload);
        setSnackbarMsg('Employee created successfully');
      }
      handleCloseDialog();
      fetchEmployees();
    } catch (err: any) {
      setError(err.message || 'Failed to save employee');
    }
  };

  // Delete an employee
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }
    try {
      await apiInstance.delete(`/employees/${id}`);
      setSnackbarMsg('Employee deleted successfully');
      fetchEmployees();
    } catch (err: any) {
      setError(err.message || 'Failed to delete employee');
    }
  };

  return (
    <MainContainer title='Employee Management'>
      <Button
        variant='contained'
        color='primary'
        onClick={handleOpenDialogForCreate}
      >
        Add Employee
      </Button>
      {loading ? (
        <Box display='flex' justifyContent='center' m={2}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Enabled</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map(emp => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.firstName}</TableCell>
                  <TableCell>{emp.lastName}</TableCell>
                  <TableCell>{emp.username}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>
                    <Checkbox checked={emp.enabled} disabled />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='outlined'
                      color='primary'
                      size='small'
                      onClick={() => handleOpenDialogForEdit(emp)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant='outlined'
                      color='secondary'
                      size='small'
                      onClick={() => handleDelete(emp.id)}
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align='center'>
                    No employees found.
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
        <DialogTitle>{isEdit ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <DialogContent>
          <Box component='form' sx={{ mt: 2 }} noValidate>
            <TextField
              fullWidth
              label='Email'
              name='email'
              value={formState.email}
              onChange={handleFormChange}
              margin='normal'
            />
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
              label='Username'
              name='username'
              value={formState.username}
              onChange={handleFormChange}
              margin='normal'
            />
            <TextField
              fullWidth
              label='Password'
              name='password'
              type='password'
              value={formState.password}
              onChange={handleFormChange}
              margin='normal'
            />
            <TextField
              fullWidth
              label='Role'
              name='role'
              value={formState.role}
              onChange={handleFormChange}
              margin='normal'
            />
            <TextField
              fullWidth
              label='Position'
              name='position'
              value={formState.position}
              onChange={handleFormChange}
              margin='normal'
            />
            <TextField
              fullWidth
              label='Authorities (comma separated)'
              name='authorities'
              value={formState.authorities}
              onChange={handleFormChange}
              margin='normal'
            />

            <Box display='flex' alignItems='center' mt={2}>
              <Checkbox
                name='enabled'
                checked={formState.enabled}
                onChange={handleCheckboxChange}
              />
              <span>Enabled</span>
            </Box>
            <Box display='flex' alignItems='center'>
              <Checkbox
                name='accountNonExpired'
                checked={formState.accountNonExpired}
                onChange={handleCheckboxChange}
              />
              <span>Account Non-Expired</span>
            </Box>
            <Box display='flex' alignItems='center'>
              <Checkbox
                name='accountNonLocked'
                checked={formState.accountNonLocked}
                onChange={handleCheckboxChange}
              />
              <span>Account Non-Locked</span>
            </Box>
            <Box display='flex' alignItems='center'>
              <Checkbox
                name='credentialsNonExpired'
                checked={formState.credentialsNonExpired}
                onChange={handleCheckboxChange}
              />
              <span>Credentials Non-Expired</span>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant='contained' color='primary'>
            {isEdit ? 'Update' : 'Create'}
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
