// src/pages/UsersPage.tsx
import React, { useState } from 'react';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import MainContainer from '../components/main-container';
import { CreateUserCommand, UserRole } from '../schemas/user';
import { useUsers, useCreateUser } from '../hooks/use-users';

const defaultFormState: CreateUserCommand = {
  username: '',
  firstName: '',
  lastName: '',
  password: '',
  role: 'MANAGER',
};

const UsersPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [formState, setFormState] =
    useState<CreateUserCommand>(defaultFormState);
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');

  // Use React Query hooks
  const { data: users = [], isLoading: loading } = useUsers();
  const createUser = useCreateUser();

  // Open dialog for creating a new user
  const handleOpenDialogForCreate = () => {
    setFormState(defaultFormState);
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
      [name]: value,
    }));
  };

  // Handle role selection
  const handleRoleChange = (role: UserRole) => {
    setFormState(prev => ({
      ...prev,
      role,
    }));
  };

  // Submit form to create user
  const handleSubmit = async () => {
    try {
      await createUser.mutateAsync(formState);
      setSnackbarMsg('User created successfully');
      handleCloseDialog();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to create user');
    }
  };

  return (
    <MainContainer title='User Management'>
      <Button
        variant='contained'
        color='primary'
        onClick={handleOpenDialogForCreate}
        sx={{ mb: 2 }}
        startIcon={<PersonAddIcon />}
      >
        Add User
      </Button>

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
                <TableCell>Username</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === 'ADMIN' ? 'primary' : 'default'}
                      size='small'
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.enabled ? 'Active' : 'Disabled'}
                      color={user.enabled ? 'success' : 'default'}
                      size='small'
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title='Delete'>
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => {
                          if (
                            window.confirm(
                              'Are you sure you want to delete this user?'
                            )
                          ) {
                            setSnackbarMsg(
                              'Delete functionality not implemented yet'
                            );
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* User Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <Box component='form' sx={{ mt: 2 }} noValidate>
            <TextField
              fullWidth
              label='Username'
              name='username'
              value={formState.username}
              onChange={handleFormChange}
              margin='normal'
              helperText='Minimum 3 characters'
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
              label='Password'
              name='password'
              type='password'
              value={formState.password}
              onChange={handleFormChange}
              margin='normal'
              helperText='Minimum 6 characters'
            />
            <FormControl fullWidth margin='normal'>
              <InputLabel>Role</InputLabel>
              <Select
                value={formState.role}
                label='Role'
                onChange={e => handleRoleChange(e.target.value as UserRole)}
              >
                <MenuItem value='MANAGER'>Manager</MenuItem>
                <MenuItem value='ADMIN'>Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant='contained' color='primary'>
            Create
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

export default UsersPage;
