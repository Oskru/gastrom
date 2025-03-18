// src/pages/InventoryPage.tsx
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
  Snackbar,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import MainContainer from '../components/main-container';
import { apiInstance } from '../utils/api-instance';
import { InventoryItem, ProductCategory } from '../schemas/inventory';
import {
  useInventory,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  useLowStockItems,
} from '../hooks/use-inventory';
import WarningIcon from '@mui/icons-material/Warning';
import { alpha } from '@mui/material/styles';
import LowStockIndicator from '../components/material/LowStockIndicator';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

/**
 * INVENTORY ITEM FORM TYPES
 */
interface InventoryFormState {
  id?: number;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  quantity: number;
  weightInGrams: number;
  countable: boolean;
  minimalValue: number;
}

const defaultInventoryFormState: InventoryFormState = {
  name: '',
  description: '',
  categoryId: 0,
  price: 0,
  quantity: 0,
  weightInGrams: 0,
  countable: true,
  minimalValue: 0,
};

/**
 * PRODUCT CATEGORY FORM TYPES
 */
interface CategoryFormState {
  id?: number;
  name: string;
}

const defaultCategoryFormState: CategoryFormState = {
  name: '',
};

const InventoryPage: React.FC = () => {
  // Tab management: 0 = Inventory Items, 1 = Product Categories
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(false);

  /** INVENTORY ITEMS STATE **/
  const [openInventoryDialog, setOpenInventoryDialog] =
    useState<boolean>(false);
  const [inventoryFormState, setInventoryFormState] =
    useState<InventoryFormState>(defaultInventoryFormState);
  const [isEditInventory, setIsEditInventory] = useState<boolean>(false);

  /** PRODUCT CATEGORIES STATE **/
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [openCategoryDialog, setOpenCategoryDialog] = useState<boolean>(false);
  const [categoryFormState, setCategoryFormState] = useState<CategoryFormState>(
    defaultCategoryFormState
  );
  const [isEditCategory, setIsEditCategory] = useState<boolean>(false);

  /** GENERAL FEEDBACK **/
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  /** RESPONSIVE DIALOG **/
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

  /** REACT QUERY HOOKS **/
  const { data: inventoryItems = [], isLoading: isLoadingInventory } =
    useInventory();

  const { data: lowStockItems = [], isLoading: isLoadingLowStock } =
    useLowStockItems();

  const createInventoryItem = useCreateInventoryItem();
  const updateInventoryItem = useUpdateInventoryItem();
  const deleteInventoryItem = useDeleteInventoryItem();

  // Display items based on filter setting
  const displayItems = showLowStockOnly ? lowStockItems : inventoryItems;

  // Fetch categories from API (temporary until we add React Query for categories)
  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await apiInstance.get<ProductCategory[]>('/categories');
      setCategories(response.data);
    } catch (err) {
      const error = err as Error;
      console.error('Failed to fetch categories', error);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  /** TAB CHANGE **/
  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    event.preventDefault();
    setTabIndex(newValue);
  };

  /** LOW STOCK FILTER **/
  const handleLowStockFilterChange = (): void => {
    setShowLowStockOnly(!showLowStockOnly);
  };

  /**************** Inventory Items CRUD ****************/
  const handleOpenInventoryDialogForCreate = () => {
    setIsEditInventory(false);
    setInventoryFormState(defaultInventoryFormState);
    setOpenInventoryDialog(true);
  };

  const handleOpenInventoryDialogForEdit = (item: InventoryItem) => {
    setIsEditInventory(true);
    setInventoryFormState({
      id: item.id,
      name: item.name,
      description: item.description,
      categoryId: item.category.id,
      price: item.price,
      quantity: item.quantity,
      weightInGrams: item.weightInGrams,
      countable: item.countable,
      minimalValue: item.minimalValue,
    });
    setOpenInventoryDialog(true);
  };

  const handleCloseInventoryDialog = () => {
    setOpenInventoryDialog(false);
  };

  const handleInventoryFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInventoryFormState(prev => ({
      ...prev,
      [name]:
        name === 'categoryId' ||
        name === 'price' ||
        name === 'quantity' ||
        name === 'weightInGrams' ||
        name === 'minimalValue'
          ? Number(value)
          : value,
    }));
  };

  const handleInventoryCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target;
    setInventoryFormState(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleInventorySubmit = async (): Promise<void> => {
    try {
      // Find the category object by its id
      const categoryObj = categories.find(
        cat => cat.id === Number(inventoryFormState.categoryId)
      );
      if (!categoryObj) {
        setError('Please select a valid category.');
        return;
      }
      const payload = {
        name: inventoryFormState.name,
        description: inventoryFormState.description,
        categoryId: inventoryFormState.categoryId,
        price: inventoryFormState.price,
        quantity: inventoryFormState.quantity,
        weightInGrams: inventoryFormState.weightInGrams,
        countable: inventoryFormState.countable,
        minimalValue: inventoryFormState.minimalValue,
      };

      // Calculate lowStock based on whether item is countable
      const isLowStock = payload.countable
        ? payload.quantity < payload.minimalValue
        : payload.weightInGrams < payload.minimalValue;

      if (isEditInventory && inventoryFormState.id !== undefined) {
        await updateInventoryItem.mutateAsync({
          id: inventoryFormState.id,
          ...payload,
          category: categoryObj,
          lowStock: isLowStock,
        } as InventoryItem);
        setSnackbarMsg('Inventory item updated successfully');
      } else {
        await createInventoryItem.mutateAsync(
          payload as unknown as Omit<InventoryItem, 'id'>
        );
        setSnackbarMsg('Inventory item created successfully');
      }
      handleCloseInventoryDialog();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to save inventory item');
    }
  };

  const handleInventoryDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this inventory item?'))
      return;
    try {
      await deleteInventoryItem.mutateAsync(id);
      setSnackbarMsg('Inventory item deleted successfully');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to delete inventory item');
    }
  };

  /**************** Product Categories CRUD ****************/
  const handleOpenCategoryDialogForCreate = () => {
    setIsEditCategory(false);
    setCategoryFormState(defaultCategoryFormState);
    setOpenCategoryDialog(true);
  };

  const handleOpenCategoryDialogForEdit = (category: ProductCategory) => {
    setIsEditCategory(true);
    setCategoryFormState({
      id: category.id,
      name: category.name,
    });
    setOpenCategoryDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
  };

  const handleCategoryFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategoryFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySubmit = async (): Promise<void> => {
    try {
      const payload = {
        name: categoryFormState.name,
      };

      if (isEditCategory && categoryFormState.id !== undefined) {
        await apiInstance.put(`/categories/${categoryFormState.id}`, {
          id: categoryFormState.id,
          ...payload,
        });
        setSnackbarMsg('Category updated successfully');
      } else {
        await apiInstance.post('/categories', payload, {
          headers: { 'Content-Type': 'text/plain' },
        });
        setSnackbarMsg('Category created successfully');
      }
      handleCloseCategoryDialog();
      fetchCategories();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to save category');
    }
  };

  const handleCategoryDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this category?'))
      return;
    try {
      await apiInstance.delete(`/categories/${id}`);
      setSnackbarMsg('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to delete category');
    }
  };

  return (
    <MainContainer title='Inventory Management'>
      <Box sx={{ px: { xs: 2, md: 4 }, py: 2, maxWidth: 2000, mx: 'auto' }}>
        {/* Tabs for switching between Inventory Items and Categories */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant='fullWidth'
          sx={{ mb: 2 }}
        >
          <Tab label='Inventory Items' />
          <Tab label='Product Categories' />
        </Tabs>

        {tabIndex === 0 && (
          // ******** INVENTORY ITEMS TAB ********
          <Box>
            <Box
              display='flex'
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent='space-between'
              alignItems={{ xs: 'stretch', sm: 'center' }}
              mb={2}
            >
              <Box
                component='h1'
                sx={{ m: 0, mr: 20, fontSize: { xs: '1.5rem', sm: '2rem' } }}
              >
                Inventory Items
              </Box>
              <Box display='flex' alignItems='center' gap={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showLowStockOnly}
                      onChange={handleLowStockFilterChange}
                      color='warning'
                    />
                  }
                  label={
                    <Box display='flex' alignItems='center' gap={0.5}>
                      <WarningIcon fontSize='small' color='warning' />
                      <span>Low Stock Only</span>
                    </Box>
                  }
                />
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleOpenInventoryDialogForCreate}
                >
                  Add Inventory Item
                </Button>
              </Box>
            </Box>

            {/* Low Stock Summary */}
            {lowStockItems.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  border: '1px solid',
                  borderColor: theme => theme.palette.warning.light,
                  bgcolor: theme => alpha(theme.palette.warning.light, 0.1),
                  borderRadius: 2,
                }}
              >
                <Box display='flex' alignItems='center' flexWrap='wrap' gap={2}>
                  <Box display='flex' alignItems='center' gap={1}>
                    <WarningIcon color='warning' />
                    <Typography variant='h6' color='warning.dark'>
                      Low Stock Alert: {lowStockItems.length}{' '}
                      {lowStockItems.length === 1 ? 'item' : 'items'} below
                      minimum levels
                    </Typography>
                  </Box>

                  <Button
                    variant='outlined'
                    color='warning'
                    size='small'
                    onClick={handleLowStockFilterChange}
                    startIcon={<WarningIcon />}
                    sx={{ ml: 'auto' }}
                  >
                    {showLowStockOnly
                      ? 'Show All Items'
                      : 'Show Low Stock Only'}
                  </Button>
                </Box>

                <Box mt={2} display='flex' flexWrap='wrap' gap={1}>
                  {lowStockItems.slice(0, 5).map(item => {
                    // Calculate values for stock level display
                    const currentValue = item.countable
                      ? item.quantity
                      : item.weightInGrams;
                    const percentage = Math.min(
                      100,
                      Math.round((currentValue / item.minimalValue) * 100)
                    );
                    const chipColor: 'error' | 'warning' =
                      percentage < 50 ? 'error' : 'warning';

                    return (
                      <Chip
                        key={item.id}
                        label={
                          <Box
                            component='span'
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant='caption'
                              sx={{ fontWeight: 500 }}
                            >
                              {item.name}:
                            </Typography>
                            <Typography
                              variant='caption'
                              sx={{
                                backgroundColor: theme =>
                                  alpha(theme.palette[chipColor].main, 0.1),
                                padding: '2px 4px',
                                borderRadius: '4px',
                                fontWeight: 500,
                              }}
                            >
                              {Math.round(percentage)}%
                            </Typography>
                            <Typography variant='caption'>
                              {currentValue}/{item.minimalValue}
                              {!item.countable && 'g'}
                            </Typography>
                          </Box>
                        }
                        icon={<WarningIcon fontSize='small' />}
                        size='medium'
                        color={chipColor}
                        variant='outlined'
                        onClick={() => handleOpenInventoryDialogForEdit(item)}
                        sx={{
                          borderRadius: '6px',
                          height: 'auto',
                          py: 0.5,
                          '& .MuiChip-label': {
                            display: 'block',
                            px: 1,
                          },
                        }}
                      />
                    );
                  })}
                  {lowStockItems.length > 5 && (
                    <Chip
                      label={`+${lowStockItems.length - 5} more`}
                      size='medium'
                      variant='outlined'
                      color='warning'
                      onClick={handleLowStockFilterChange}
                      sx={{ borderRadius: '6px' }}
                    />
                  )}
                </Box>
              </Paper>
            )}

            {isLoadingInventory || isLoadingLowStock ? (
              <Box display='flex' justifyContent='center' m={2}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <TableContainer
                  component={Paper}
                  sx={{
                    boxShadow: theme => theme.shadows[2],
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Table
                    aria-label='inventory items table'
                    sx={{
                      '& .MuiTableRow-root': {
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      },
                      '& .MuiTableCell-root': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell width='380px'>
                          Stock Level
                          {showLowStockOnly && (
                            <Tooltip title='Items with stock level below minimal value'>
                              <IconButton size='small' sx={{ ml: 0.5 }}>
                                <WarningIcon fontSize='small' color='warning' />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell width='120px'>
                          <Tooltip title='Minimum stock level that should be maintained. Based on units for countable items or grams for non-countable items.'>
                            <Box
                              component='span'
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              Min Threshold
                              <HelpOutlineIcon
                                fontSize='small'
                                sx={{ ml: 0.5, color: 'text.secondary' }}
                              />
                            </Box>
                          </Tooltip>
                        </TableCell>
                        <TableCell width='100px'>Countable</TableCell>
                        <TableCell width='180px'>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayItems.map(item => {
                        // Determine if the item is low on stock based on whether it's countable
                        const isLowStock = item.countable
                          ? item.quantity < item.minimalValue
                          : item.weightInGrams < item.minimalValue;

                        return (
                          <TableRow
                            key={item.id}
                            sx={{
                              backgroundColor: isLowStock
                                ? alpha(theme.palette.warning.light, 0.1)
                                : 'inherit',
                              '&:hover': {
                                backgroundColor: isLowStock
                                  ? alpha(theme.palette.warning.light, 0.2)
                                  : alpha(theme.palette.action.hover, 0.1),
                              },
                            }}
                          >
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.category.name}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Box
                                sx={{
                                  width: '100%',
                                  px: 1,
                                  boxSizing: 'border-box',
                                }}
                              >
                                <LowStockIndicator
                                  quantity={
                                    item.countable ? item.quantity : undefined
                                  }
                                  weightInGrams={
                                    !item.countable
                                      ? item.weightInGrams
                                      : undefined
                                  }
                                  minimalValue={item.minimalValue}
                                  countable={item.countable}
                                  showDetails
                                />
                              </Box>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {item.minimalValue}
                              {!item.countable && 'g'}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              <Checkbox checked={item.countable} disabled />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant='outlined'
                                  color='primary'
                                  size='small'
                                  onClick={() =>
                                    handleOpenInventoryDialogForEdit(item)
                                  }
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant='outlined'
                                  color='secondary'
                                  size='small'
                                  onClick={() => handleInventoryDelete(item.id)}
                                >
                                  Delete
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {displayItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={10} align='center'>
                            {showLowStockOnly
                              ? 'No low stock items found.'
                              : 'No inventory items found.'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}

        {tabIndex === 1 && (
          // ******** PRODUCT CATEGORIES TAB ********
          <Box>
            <Box
              display='flex'
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent='space-between'
              alignItems={{ xs: 'stretch', sm: 'center' }}
              mb={2}
            >
              <Box
                component='h1'
                sx={{ m: 0, mr: 20, fontSize: { xs: '1.5rem', sm: '2rem' } }}
              >
                Product Categories
              </Box>
              <Button
                variant='contained'
                color='primary'
                onClick={handleOpenCategoryDialogForCreate}
                sx={{ mt: { xs: 2, sm: 0 } }}
              >
                Add Category
              </Button>
            </Box>

            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: theme => theme.shadows[2],
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Table
                  aria-label='categories table'
                  sx={{
                    '& .MuiTableRow-root': {
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    },
                    '& .MuiTableCell-root': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map(cat => (
                      <TableRow key={cat.id}>
                        <TableCell>{cat.id}</TableCell>
                        <TableCell>{cat.name}</TableCell>
                        <TableCell>
                          <Button
                            variant='outlined'
                            color='primary'
                            size='small'
                            onClick={() => handleOpenCategoryDialogForEdit(cat)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant='outlined'
                            color='secondary'
                            size='small'
                            onClick={() => handleCategoryDelete(cat.id)}
                            sx={{ ml: 1 }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {categories.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align='center'>
                          No categories found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}

        {/* INVENTORY ITEM DIALOG */}
        <Dialog
          open={openInventoryDialog}
          onClose={handleCloseInventoryDialog}
          fullWidth
          maxWidth='sm'
          fullScreen={fullScreenDialog}
        >
          <DialogTitle>
            {isEditInventory ? 'Edit Inventory Item' : 'Add Inventory Item'}
          </DialogTitle>
          <DialogContent>
            <Box component='form' sx={{ mt: 2 }} noValidate>
              <TextField
                fullWidth
                label='Name'
                name='name'
                value={inventoryFormState.name}
                onChange={handleInventoryFormChange}
                margin='normal'
              />
              <TextField
                fullWidth
                label='Description'
                name='description'
                value={inventoryFormState.description}
                onChange={handleInventoryFormChange}
                margin='normal'
              />
              {/* Category selection uses the available categories */}
              <TextField
                select
                SelectProps={{ native: true }}
                fullWidth
                label='Category'
                name='categoryId'
                value={inventoryFormState.categoryId}
                onChange={handleInventoryFormChange}
                margin='normal'
              >
                <option value={0}>Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </TextField>
              <TextField
                fullWidth
                label='Price'
                name='price'
                type='number'
                value={inventoryFormState.price}
                onChange={handleInventoryFormChange}
                margin='normal'
              />

              <Box display='flex' alignItems='center' mt={2} mb={1}>
                <Checkbox
                  name='countable'
                  checked={inventoryFormState.countable}
                  onChange={handleInventoryCheckboxChange}
                />
                <Typography>
                  Countable
                  <Tooltip title='Check this if the item can be counted as individual units. Uncheck for items that are measured by weight.'>
                    <IconButton size='small'>
                      <HelpOutlineIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </Box>

              {/* Display appropriate fields based on countable status */}
              {inventoryFormState.countable ? (
                <TextField
                  fullWidth
                  label='Quantity'
                  name='quantity'
                  type='number'
                  value={inventoryFormState.quantity}
                  onChange={handleInventoryFormChange}
                  margin='normal'
                />
              ) : (
                <TextField
                  fullWidth
                  label='Weight (in grams)'
                  name='weightInGrams'
                  type='number'
                  value={inventoryFormState.weightInGrams}
                  onChange={handleInventoryFormChange}
                  margin='normal'
                />
              )}

              {/* Minimal value field with appropriate label based on countable status */}
              <TextField
                fullWidth
                label={`Minimal value${!inventoryFormState.countable ? ' (in grams)' : ''}`}
                name='minimalValue'
                type='number'
                value={inventoryFormState.minimalValue}
                onChange={handleInventoryFormChange}
                margin='normal'
                helperText={
                  !inventoryFormState.countable
                    ? 'The minimum weight in grams that should be maintained'
                    : 'The minimum quantity that should be maintained'
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInventoryDialog}>Cancel</Button>
            <Button
              onClick={handleInventorySubmit}
              variant='contained'
              color='primary'
            >
              {isEditInventory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* PRODUCT CATEGORY DIALOG */}
        <Dialog
          open={openCategoryDialog}
          onClose={handleCloseCategoryDialog}
          fullWidth
          maxWidth='sm'
          fullScreen={fullScreenDialog}
        >
          <DialogTitle>
            {isEditCategory ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
          <DialogContent>
            <Box component='form' sx={{ mt: 2 }} noValidate>
              <TextField
                fullWidth
                label='Category Name'
                name='name'
                value={categoryFormState.name}
                onChange={handleCategoryFormChange}
                margin='normal'
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
            <Button
              onClick={handleCategorySubmit}
              variant='contained'
              color='primary'
            >
              {isEditCategory ? 'Update' : 'Create'}
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
      </Box>
    </MainContainer>
  );
};

export default InventoryPage;
