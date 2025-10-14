import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddContactDialog from './AddContactDialog';
import { Contact, NewContact } from './types';

// Mock data for contacts
const mockContacts: Contact[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Corp',
    status: 'Active',
    lastContact: '2024-03-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Design Co',
    status: 'Lead',
    lastContact: '2024-03-14',
  },
  // Add more mock contacts as needed
];

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = contacts.filter((contact) =>
      Object.values(contact).some(
        (value) => value.toString().toLowerCase().includes(term)
      )
    );
    setFilteredContacts(filtered);
  };

  const handleAddContact = (newContact: NewContact) => {
    const contact: Contact = {
      ...newContact,
      id: contacts.length + 1, // In a real app, this would be handled by the backend
    };
    const updatedContacts = [...contacts, contact];
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'company', headerName: 'Company', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      renderCell: (params: GridRenderCellParams<Contact, string>) => (
        <Chip
          label={params.value}
          color={params.value === 'Active' ? 'success' : 'primary'}
          size="small"
        />
      ),
    },
    {
      field: 'lastContact',
      headerName: 'Last Contact',
      flex: 0.8,
      valueFormatter: (params: { value: string }) => {
        const date = new Date(params.value);
        return date.toLocaleDateString();
      },
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h5">Contacts</Typography>
          <IconButton 
            color="primary" 
            size="large"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PersonAddIcon />
          </IconButton>
        </Stack>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Box sx={{ height: 'calc(100vh - 280px)' }}>
          <DataGrid
            rows={filteredContacts}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        </Box>
      </Paper>
      <AddContactDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddContact}
      />
    </Box>
  );
};

export default Contacts; 