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
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import MainContainer from '../components/main-container';
import { CreateUserCommand, UserRole } from '../schemas/user';
import { useUsers, useCreateUser, useDeleteUser } from '../hooks/use-users';

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
  const deleteUser = useDeleteUser();

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
  const handleSubmit = () => {
    // Close dialog immediately for optimistic UX
    handleCloseDialog();

    // Trigger mutation (optimistic update will show it immediately)
    createUser.mutate(formState, {
      onSuccess: () => {
        setSnackbarMsg('User created successfully');
      },
      onError: err => {
        const error = err as Error;
        setError(error.message || 'Failed to create user');
      },
    });
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: number, username: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${username}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteUser.mutateAsync(userId);
        setSnackbarMsg('User deleted successfully');
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Failed to delete user');
      }
    }
  };

  return (
    <MainContainer title='User Management'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4' component='h1'>
          Users
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={handleOpenDialogForCreate}
          startIcon={<PersonAddIcon />}
          data-testid='add-user-button'
        >
          Add User
        </Button>
      </Box>

      {loading ? (
        <Box display='flex' justifyContent='center' mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} data-testid='users-table'>
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
                <TableRow key={user.id} data-testid='user-row'>
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
                    <Tooltip title='Delete User'>
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        disabled={deleteUser.isPending}
                        data-testid='delete-user-button'
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
        data-testid='user-dialog'
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
              inputProps={{ 'data-testid': 'user-username-input' }}
            />
            <TextField
              fullWidth
              label='First Name'
              name='firstName'
              value={formState.firstName}
              onChange={handleFormChange}
              margin='normal'
              inputProps={{ 'data-testid': 'user-firstname-input' }}
            />
            <TextField
              fullWidth
              label='Last Name'
              name='lastName'
              value={formState.lastName}
              onChange={handleFormChange}
              margin='normal'
              inputProps={{ 'data-testid': 'user-lastname-input' }}
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
              inputProps={{ 'data-testid': 'user-password-input' }}
            />
            <FormControl fullWidth margin='normal'>
              <InputLabel>Role</InputLabel>
              <Select
                value={formState.role}
                label='Role'
                onChange={e => handleRoleChange(e.target.value as UserRole)}
                data-testid='user-role-select'
              >
                <MenuItem value='MANAGER'>Manager</MenuItem>
                <MenuItem value='ADMIN'>Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} data-testid='user-dialog-cancel'>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant='contained'
            color='primary'
            data-testid='user-dialog-submit'
          >
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
