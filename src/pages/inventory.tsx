// src/pages/InventoryPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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
} from '@mui/material';
import MainContainer from '../components/main-container';
import { apiInstance } from '../utils/api-instance';
import { InventoryItem, ProductCategory } from '../schemas/inventory';

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

  /** INVENTORY ITEMS STATE **/
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loadingInventory, setLoadingInventory] = useState<boolean>(false);
  const [openInventoryDialog, setOpenInventoryDialog] =
    useState<boolean>(false);
  const [inventoryFormState, setInventoryFormState] =
    useState<InventoryFormState>(defaultInventoryFormState);
  const [isEditInventory, setIsEditInventory] = useState<boolean>(false);

  /** PRODUCT CATEGORIES STATE **/
  // This state is used both for the category select in the inventory item form
  // and for the Categories management tab.
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

  /** FETCH FUNCTIONS **/
  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const response = await apiInstance.get<InventoryItem[]>('/inventory');
      setInventory(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory');
    } finally {
      setLoadingInventory(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiInstance.get<ProductCategory[]>('/categories');
      // (Optional) If your backend returns a recursive structure, normalize here.
      // For now we assume each category has at least { id, name }.
      setCategories(response.data);
    } catch (err: any) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, []);

  /** TAB CHANGE **/
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
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
        name === 'price' || name === 'quantity' || name === 'weightInGrams'
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

  const handleInventorySubmit = async () => {
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

      if (isEditInventory && inventoryFormState.id !== undefined) {
        await apiInstance.put(`/inventory/${inventoryFormState.id}`, {
          id: inventoryFormState.id,
          ...payload,
        });
        setSnackbarMsg('Inventory item updated successfully');
      } else {
        await apiInstance.post('/inventory', payload);
        setSnackbarMsg('Inventory item created successfully');
      }
      handleCloseInventoryDialog();
      fetchInventory();
    } catch (err: any) {
      setError(err.message || 'Failed to save inventory item');
    }
  };

  const handleInventoryDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?'))
      return;
    try {
      await apiInstance.delete(`/inventory/${id}`);
      setSnackbarMsg('Inventory item deleted successfully');
      fetchInventory();
    } catch (err: any) {
      setError(err.message || 'Failed to delete inventory item');
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

  const handleCategorySubmit = async () => {
    try {
      const payload = categoryFormState.name;

      if (isEditCategory && categoryFormState.id !== undefined) {
        await apiInstance.put(`/categories/${categoryFormState.id}`, payload, {
          headers: { 'Content-Type': 'text/plain' },
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
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    }
  };

  const handleCategoryDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?'))
      return;
    try {
      await apiInstance.delete(`/categories/${id}`);
      setSnackbarMsg('Category deleted successfully');
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
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
                sx={{ m: 0, fontSize: { xs: '1.5rem', sm: '2rem' } }}
              >
                Inventory Items
              </Box>
              <Button
                variant='contained'
                color='primary'
                onClick={handleOpenInventoryDialogForCreate}
                sx={{ mt: { xs: 2, sm: 0 } }}
              >
                Add Inventory Item
              </Button>
            </Box>

            {loadingInventory ? (
              <Box display='flex' justifyContent='center' m={2}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <TableContainer component={Paper}>
                  <Table aria-label='inventory items table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Weight (g)</TableCell>
                        <TableCell>Minimal value</TableCell>
                        <TableCell>Countable</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventory.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.category.name}</TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.minimalValue}</TableCell>
                          <TableCell>{item.weightInGrams}</TableCell>
                          <TableCell>
                            <Checkbox checked={item.countable} disabled />
                          </TableCell>
                          <TableCell>
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
                              sx={{ ml: 1 }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {inventory.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} align='center'>
                            No inventory items found.
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
                sx={{ m: 0, fontSize: { xs: '1.5rem', sm: '2rem' } }}
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
              <TableContainer component={Paper}>
                <Table aria-label='categories table'>
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
              <TextField
                fullWidth
                label='Minimal value'
                name='minimalValue'
                value={inventoryFormState.minimalValue}
                onChange={handleInventoryFormChange}
                margin='normal'
              />
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
                  label='Weight (g)'
                  name='weightInGrams'
                  type='number'
                  value={inventoryFormState.weightInGrams}
                  onChange={handleInventoryFormChange}
                  margin='normal'
                />
              )}

              <Box display='flex' alignItems='center' mt={1}>
                <Checkbox
                  name='countable'
                  checked={inventoryFormState.countable}
                  onChange={handleInventoryCheckboxChange}
                />
                <span>Countable</span>
              </Box>
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
