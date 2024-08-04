'use client'
import { useState, useEffect } from "react";
import { firestore } from '@/firebase';
import { Box, Stack, TextField, Typography, Modal, Button, Snackbar, Alert } from "@mui/material";
import { collection, deleteDoc, query, setDoc, getDocs, doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    if (showAll) {
      setFilteredInventory(inventoryList);
    } else {
      handleSearch();
    }
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, [showAll]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = () => {
    const results = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(results);
    if (results.length === 0) {
      setErrorMessage('Item not found');
      setSnackbarOpen(true);
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
    setSearchTerm('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      bgcolor="#E0F7FA"
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #0288D1"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant='outlined'
              fullWidth
              value={itemName} 
              onChange={(e) => setItemName(e.target.value)} 
            />
            <Button 
              variant="contained" 
              onClick={() => { 
                addItem(itemName); 
                setItemName('');
                handleClose();
              }}
              sx={{ backgroundColor: '#0288D1', color: '#fff' }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>

      <Box border="1px solid #0288D1" bgcolor="#B3E5FC" p={2} borderRadius={1} mb={2} width="80%">
        <Typography variant="h2" color="#0277BD">Pantry Items</Typography>
        <Stack direction="row" spacing={2} alignItems="center" mt={2}>
          <TextField 
            variant="outlined"
            placeholder="Search items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 400 }}
          />
          <Button variant="contained" onClick={handleSearch} sx={{ backgroundColor: '#0288D1', color: '#fff' }}>
            Search
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} mt={2}>
          <Button variant="contained" onClick={handleOpen} sx={{ backgroundColor: '#0288D1', color: '#fff' }}>
            Add New Item
          </Button>
          <Button variant="outlined" onClick={handleShowAll} sx={{ color: '#0288D1', borderColor: '#0288D1' }}>
            Show All
          </Button>
        </Stack>
      </Box>

      <Stack 
        width="80%" 
        height="auto" 
        spacing={2} 
        overflow="auto"
        mb={2}
      >
        {
          filteredInventory.map(item => (
            <Box 
              key={item.name} 
              width="100%"
              minHeight="80px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor='#B3E5FC'
              padding={2}
              borderRadius={2}
            >
              <Box display="flex" justifyContent="space-between" width="100%">
                <Box flex="1">
                  <Typography variant='h6' color='#0277BD'>
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </Typography>
                </Box>
                <Box width="100px" textAlign="center">
                  <Typography variant='h6' color='#0277BD'>
                    {item.quantity}
                  </Typography>
                </Box>
                <Box flex="1" display="flex" justifyContent="flex-end">
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={() => addItem(item.name)}
                      sx={{ backgroundColor: '#0288D1', color: '#fff' }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => removeItem(item.name)}
                      sx={{ backgroundColor: '#0288D1', color: '#fff' }}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Box>
          ))
        }
      </Stack>
    </Box>
  );
}
