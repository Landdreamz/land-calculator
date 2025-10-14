import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
} from '@mui/material';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Lead' | 'Active' | 'Inactive';
  lastContact: string;
}

type NewContact = Omit<Contact, 'id'>;

interface AddContactDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (contact: NewContact) => void;
}

const initialFormState: NewContact = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'Lead',
  lastContact: new Date().toISOString().split('T')[0],
};

const AddContactDialog: React.FC<AddContactDialogProps> = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = React.useState<NewContact>(initialFormState);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: NewContact) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev: NewContact) => ({
      ...prev,
      [name]: value as NewContact['status'],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData(initialFormState);
    onClose();
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Contact</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleTextChange}
            />
            <TextField
              required
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleTextChange}
            />
            <TextField
              required
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleTextChange}
            />
            <TextField
              required
              fullWidth
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleTextChange}
            />
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleSelectChange}
              >
                <MenuItem value="Lead">Lead</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              fullWidth
              type="date"
              label="Last Contact"
              name="lastContact"
              value={formData.lastContact}
              onChange={handleTextChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Contact
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddContactDialog; 