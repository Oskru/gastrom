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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton,
  Typography,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Inventory2 as RestockIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import MainContainer from '../components/main-container';
import {
  IngredientDto,
  CreateIngredientCommand,
  Unit,
} from '../schemas/inventory';
import {
  useIngredients,
  useCreateIngredient,
  useRestockIngredient,
  useDeleteIngredient,
  useLowStockIngredients,
} from '../hooks/use-inventory';
import { CreateProductCommand, ComponentCommand } from '../schemas/product';
import {
  useProducts,
  useCreateProduct,
  useDeleteProduct,
} from '../hooks/use-products';

const defaultIngredientFormState: CreateIngredientCommand = {
  name: '',
  unit: 'G' as Unit,
  stockQuantity: 0,
  alertQuantity: 0,
  unitCost: 0,
};

const defaultProductFormState: CreateProductCommand = {
  name: '',
  price: 0,
  productComponents: [],
  takeaway: false,
};

interface RestockFormState {
  ingredientId: number;
  ingredientName: string;
  currentStock: number;
  quantity: number;
}

const InventoryPage: React.FC = () => {
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState<number>(0);
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(false);
  const [openIngredientDialog, setOpenIngredientDialog] =
    useState<boolean>(false);
  const [openProductDialog, setOpenProductDialog] = useState<boolean>(false);
  const [openRestockDialog, setOpenRestockDialog] = useState<boolean>(false);
  const [ingredientFormState, setIngredientFormState] =
    useState<CreateIngredientCommand>(defaultIngredientFormState);
  const [productFormState, setProductFormState] =
    useState<CreateProductCommand>(defaultProductFormState);
  const [restockFormState, setRestockFormState] =
    useState<RestockFormState | null>(null);
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // React Query hooks - Ingredients
  const { data: allIngredients = [], isLoading: isLoadingAll } =
    useIngredients();
  const { data: lowStockIngredients = [], isLoading: isLoadingLowStock } =
    useLowStockIngredients();
  const createIngredient = useCreateIngredient();
  const restockIngredient = useRestockIngredient();
  const deleteIngredient = useDeleteIngredient();

  // React Query hooks - Products
  const { data: allProducts = [], isLoading: isLoadingProducts } =
    useProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  // Display items based on filter
  const displayItems = showLowStockOnly ? lowStockIngredients : allIngredients;
  const isLoading = showLowStockOnly ? isLoadingLowStock : isLoadingAll;

  // Handlers
  const handleLowStockFilterChange = () => {
    setShowLowStockOnly(!showLowStockOnly);
  };

  const handleOpenIngredientDialogForCreate = () => {
    setIngredientFormState(defaultIngredientFormState);
    setOpenIngredientDialog(true);
  };

  const handleCloseIngredientDialog = () => {
    setOpenIngredientDialog(false);
  };

  const handleOpenRestockDialog = (ingredient: IngredientDto) => {
    setRestockFormState({
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      currentStock: ingredient.stockQuantity,
      quantity: 0,
    });
    setOpenRestockDialog(true);
  };

  const handleCloseRestockDialog = () => {
    setOpenRestockDialog(false);
    setRestockFormState(null);
  };

  const handleIngredientFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setIngredientFormState(prev => ({
      ...prev,
      [name]:
        name === 'stockQuantity' ||
        name === 'alertQuantity' ||
        name === 'unitCost'
          ? Number(value)
          : value,
    }));
  };

  const handleIngredientSubmit = async (): Promise<void> => {
    try {
      await createIngredient.mutateAsync(ingredientFormState);
      setSnackbarMsg('Ingredient created successfully');
      handleCloseIngredientDialog();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to create ingredient');
    }
  };

  const handleRestockSubmit = async (): Promise<void> => {
    if (!restockFormState) return;
    try {
      await restockIngredient.mutateAsync({
        id: restockFormState.ingredientId,
        quantity: restockFormState.quantity,
      });
      setSnackbarMsg('Ingredient restocked successfully');
      handleCloseRestockDialog();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to restock ingredient');
    }
  };

  const handleIngredientDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this ingredient?'))
      return;
    try {
      await deleteIngredient.mutateAsync(id);
      setSnackbarMsg('Ingredient deleted successfully');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to delete ingredient');
    }
  };

  // Product handlers
  const handleOpenProductDialogForCreate = () => {
    setProductFormState(defaultProductFormState);
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  const handleProductFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | boolean } }
  ) => {
    const { name, value } = e.target;
    setProductFormState(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleProductSubmit = async (): Promise<void> => {
    try {
      await createProduct.mutateAsync(productFormState);
      setSnackbarMsg('Product created successfully');
      handleCloseProductDialog();
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to create product');
    }
  };

  const handleProductDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this product?'))
      return;
    try {
      await deleteProduct.mutateAsync(id);
      setSnackbarMsg('Product deleted successfully');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to delete product');
    }
  };

  const handleComponentChange = (
    index: number,
    field: keyof ComponentCommand,
    value: number
  ) => {
    setProductFormState(prev => {
      const newComponents = [...prev.productComponents];
      newComponents[index] = { ...newComponents[index], [field]: value };
      return { ...prev, productComponents: newComponents };
    });
  };

  const handleAddComponent = () => {
    setProductFormState(prev => ({
      ...prev,
      productComponents: [
        ...prev.productComponents,
        { ingredientId: 0, amount: 0 },
      ],
    }));
  };

  const handleRemoveComponent = (index: number) => {
    setProductFormState(prev => ({
      ...prev,
      productComponents: prev.productComponents.filter((_, i) => i !== index),
    }));
  };

  // Check if ingredient is low on stock
  const isLowStock = (ingredient: IngredientDto) => {
    return ingredient.stockQuantity <= ingredient.alertQuantity;
  };

  return (
    <MainContainer title='Inventory Management'>
      <Box sx={{ px: { xs: 2, md: 4 }, py: 2, maxWidth: 2000, mx: 'auto' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
          >
            <Tab label='Ingredients' />
            <Tab label='Products' />
          </Tabs>
        </Box>

        {/* Ingredients Tab */}
        {activeTab === 0 && (
          <>
            <Box
              display='flex'
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent='space-between'
              alignItems={{ xs: 'stretch', sm: 'center' }}
              mb={2}
            >
              <Box
                component='h1'
                sx={{ m: 0, mr: 2, fontSize: { xs: '1.5rem', sm: '2rem' } }}
              >
                Ingredients
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
                  onClick={handleOpenIngredientDialogForCreate}
                >
                  Add Ingredient
                </Button>
              </Box>
            </Box>

            {/* Low Stock Alert */}
            {lowStockIngredients.length > 0 && !showLowStockOnly && (
              <Alert
                severity='warning'
                sx={{ mb: 2 }}
                action={
                  <Button
                    color='inherit'
                    size='small'
                    onClick={() => setShowLowStockOnly(true)}
                  >
                    View Low Stock
                  </Button>
                }
              >
                {lowStockIngredients.length} ingredient(s) are running low on
                stock
              </Alert>
            )}

            {/* Ingredients Table */}
            {isLoading ? (
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
                      <TableCell>Unit</TableCell>
                      <TableCell>Stock Quantity</TableCell>
                      <TableCell>Alert Quantity</TableCell>
                      <TableCell>Unit Cost</TableCell>
                      <TableCell>Total Value</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayItems.map(item => (
                      <TableRow
                        key={item.id}
                        sx={{
                          backgroundColor: isLowStock(item)
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(255, 152, 0, 0.15)'
                              : 'rgba(255, 152, 0, 0.1)'
                            : 'inherit',
                        }}
                      >
                        <TableCell>{item.id}</TableCell>
                        <TableCell>
                          <Typography
                            fontWeight={isLowStock(item) ? 'bold' : 'normal'}
                          >
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <Typography
                            color={
                              isLowStock(item) ? 'warning.main' : 'inherit'
                            }
                            fontWeight={isLowStock(item) ? 'bold' : 'normal'}
                          >
                            {item.stockQuantity}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.alertQuantity}</TableCell>
                        <TableCell>${item.unitCost.toFixed(3)}</TableCell>
                        <TableCell>
                          ${(item.stockQuantity * item.unitCost).toFixed(3)}
                        </TableCell>
                        <TableCell>
                          {isLowStock(item) ? (
                            <Box display='flex' alignItems='center' gap={0.5}>
                              <WarningIcon fontSize='small' color='warning' />
                              <Typography variant='body2' color='warning.main'>
                                Low Stock
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant='body2' color='success.main'>
                              In Stock
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title='Restock'>
                            <IconButton
                              size='small'
                              onClick={() => handleOpenRestockDialog(item)}
                            >
                              <RestockIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete'>
                            <IconButton
                              size='small'
                              color='error'
                              onClick={() => handleIngredientDelete(item.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {displayItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} align='center'>
                          {showLowStockOnly
                            ? 'No low stock ingredients found.'
                            : 'No ingredients found.'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {/* Products Tab */}
        {activeTab === 1 && (
          <>
            <Box
              display='flex'
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent='space-between'
              alignItems={{ xs: 'stretch', sm: 'center' }}
              mb={2}
            >
              <Box
                component='h1'
                sx={{ m: 0, mr: 2, fontSize: { xs: '1.5rem', sm: '2rem' } }}
              >
                Products
              </Box>
              <Button
                variant='contained'
                color='primary'
                onClick={handleOpenProductDialogForCreate}
              >
                Add Product
              </Button>
            </Box>

            {/* Products Table */}
            {isLoadingProducts ? (
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
                      <TableCell>Price</TableCell>
                      <TableCell>Components</TableCell>
                      <TableCell>Takeaway</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>
                          <Typography>{product.name}</Typography>
                        </TableCell>
                        <TableCell>${product.price.toFixed(3)}</TableCell>
                        <TableCell>
                          {product.productComponentIds.length > 0 ? (
                            <Chip
                              label={`${product.productComponentIds.length} ingredient${product.productComponentIds.length > 1 ? 's' : ''}`}
                              size='small'
                              variant='outlined'
                            />
                          ) : (
                            <Typography variant='body2' color='text.secondary'>
                              No ingredients
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {product.takeaway ? (
                            <Chip label='Takeaway' size='small' color='info' />
                          ) : (
                            <Chip
                              label='Dine-in'
                              size='small'
                              color='default'
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title='Delete'>
                            <IconButton
                              size='small'
                              color='error'
                              onClick={() => handleProductDelete(product.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {allProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align='center'>
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {/* Create Ingredient Dialog */}
        <Dialog
          open={openIngredientDialog}
          onClose={handleCloseIngredientDialog}
          fullScreen={fullScreenDialog}
          fullWidth
          maxWidth='sm'
        >
          <DialogTitle>Add Ingredient</DialogTitle>
          <DialogContent>
            <Box component='form' sx={{ mt: 2 }} noValidate>
              <TextField
                fullWidth
                label='Name'
                name='name'
                value={ingredientFormState.name}
                onChange={handleIngredientFormChange}
                margin='normal'
                required
              />
              <FormControl fullWidth margin='normal' required>
                <InputLabel>Unit</InputLabel>
                <Select
                  name='unit'
                  value={ingredientFormState.unit}
                  onChange={handleIngredientFormChange}
                  label='Unit'
                >
                  <MenuItem value='G'>Grams (G)</MenuItem>
                  <MenuItem value='ML'>Milliliters (ML)</MenuItem>
                  <MenuItem value='PCS'>Pieces (PCS)</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label='Stock Quantity'
                name='stockQuantity'
                type='number'
                value={ingredientFormState.stockQuantity}
                onChange={handleIngredientFormChange}
                margin='normal'
                required
              />
              <TextField
                fullWidth
                label='Alert Quantity'
                name='alertQuantity'
                type='number'
                value={ingredientFormState.alertQuantity}
                onChange={handleIngredientFormChange}
                margin='normal'
                required
                helperText='System will alert when stock falls to or below this level'
              />
              <TextField
                fullWidth
                label='Unit Cost ($)'
                name='unitCost'
                type='number'
                value={ingredientFormState.unitCost}
                onChange={handleIngredientFormChange}
                margin='normal'
                required
                inputProps={{ step: '0.01' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseIngredientDialog}>Cancel</Button>
            <Button
              onClick={handleIngredientSubmit}
              variant='contained'
              color='primary'
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Product Dialog */}
        <Dialog
          open={openProductDialog}
          onClose={handleCloseProductDialog}
          fullScreen={fullScreenDialog}
          fullWidth
          maxWidth='md'
        >
          <DialogTitle>Add Product</DialogTitle>
          <DialogContent>
            <Box component='form' sx={{ mt: 2 }} noValidate>
              <TextField
                fullWidth
                label='Name'
                name='name'
                value={productFormState.name}
                onChange={handleProductFormChange}
                margin='normal'
                required
              />
              <TextField
                fullWidth
                label='Price ($)'
                name='price'
                type='number'
                value={productFormState.price}
                onChange={handleProductFormChange}
                margin='normal'
                required
                inputProps={{ step: '0.001' }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={productFormState.takeaway}
                    onChange={e =>
                      handleProductFormChange({
                        target: { name: 'takeaway', value: e.target.checked },
                      })
                    }
                    name='takeaway'
                  />
                }
                label='Takeaway'
                sx={{ mt: 2, mb: 2 }}
              />

              <Typography variant='h6' sx={{ mt: 3, mb: 2 }}>
                Product Components
              </Typography>
              {productFormState.productComponents.map((component, index) => (
                <Box
                  key={index}
                  display='flex'
                  gap={2}
                  alignItems='center'
                  mb={2}
                >
                  <FormControl fullWidth>
                    <InputLabel>Ingredient</InputLabel>
                    <Select
                      value={component.ingredientId}
                      onChange={e =>
                        handleComponentChange(
                          index,
                          'ingredientId',
                          Number(e.target.value)
                        )
                      }
                      label='Ingredient'
                    >
                      {allIngredients.map(ingredient => (
                        <MenuItem key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} ({ingredient.unit})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label='Amount'
                    type='number'
                    value={component.amount}
                    onChange={e =>
                      handleComponentChange(
                        index,
                        'amount',
                        Number(e.target.value)
                      )
                    }
                    inputProps={{ step: '0.01', min: 0 }}
                    sx={{ width: '150px' }}
                  />
                  <IconButton
                    color='error'
                    onClick={() => handleRemoveComponent(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant='outlined'
                onClick={handleAddComponent}
                sx={{ mt: 1 }}
              >
                Add Component
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseProductDialog}>Cancel</Button>
            <Button
              onClick={handleProductSubmit}
              variant='contained'
              color='primary'
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Restock Dialog */}
        <Dialog
          open={openRestockDialog}
          onClose={handleCloseRestockDialog}
          fullWidth
          maxWidth='xs'
        >
          <DialogTitle>Restock Ingredient</DialogTitle>
          <DialogContent>
            {restockFormState && (
              <Box sx={{ mt: 2 }}>
                <Typography variant='body1' gutterBottom>
                  <strong>Ingredient:</strong> {restockFormState.ingredientName}
                </Typography>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Current Stock: {restockFormState.currentStock}
                </Typography>
                <TextField
                  fullWidth
                  label='Quantity to Add'
                  type='number'
                  value={restockFormState.quantity}
                  onChange={e =>
                    setRestockFormState({
                      ...restockFormState,
                      quantity: Number(e.target.value),
                    })
                  }
                  margin='normal'
                  required
                  inputProps={{ min: 0 }}
                />
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mt: 1 }}
                >
                  New Stock:{' '}
                  {restockFormState.currentStock + restockFormState.quantity}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRestockDialog}>Cancel</Button>
            <Button
              onClick={handleRestockSubmit}
              variant='contained'
              color='primary'
            >
              Restock
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notifications */}
        <Snackbar
          open={!!snackbarMsg}
          autoHideDuration={3000}
          onClose={() => setSnackbarMsg('')}
          message={snackbarMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={3000}
            onClose={() => setError(null)}
            message={error}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          />
        )}
      </Box>
    </MainContainer>
  );
};

export default InventoryPage;
