import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Alert, Box } from '@mui/material';
import FormField from '../components/common/FormField';
import { customers } from '../services/api';

/*
 * XSS VULNERABILITY DEMONSTRATION
 * 
 * This component is intentionally vulnerable to Stored XSS attacks.
 * To demonstrate the vulnerability:
 * 
 * 1. Add a new customer with the following name:
 *    <script>alert('XSS!')</script>
 * 
 * 2. When the customer list loads, the script will execute and show an alert.
 * 
 * This is vulnerable because we're using dangerouslySetInnerHTML to render
 * the customer name without any sanitization. In a real application, you should:
 * 
 * 1. Never use dangerouslySetInnerHTML unless absolutely necessary
 * 2. Always sanitize user input before storing in the database
 * 3. Use a proper HTML sanitization library like DOMPurify
 * 4. Consider using React's built-in XSS protection by using regular JSX
 */

const CustomerManagementPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sector: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [customersList, setCustomersList] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customers.getAll();
      // Reverse to show oldest first (since backend returns newest first)
      setCustomersList(response.data.slice().reverse());
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await customers.add(formData);
      setSuccess(`New customer added: ${formData.name}`);
      setFormData({ name: '', sector: '' });
      fetchCustomers(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Customer Management
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            name="name"
            label="Customer Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <FormField
            name="sector"
            label="Sector"
            value={formData.sector}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Adding Customer...' : 'Add Customer'}
          </Button>

          <Button
            variant="text"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/change-password')}
          >
            Change Password
          </Button>
        </form>
      </Paper>
      {/* Customer List */}
      <Box sx={{ mt: 4, p: 2, borderRadius: 2, minHeight: 200 }}>
        <Typography variant="h6" gutterBottom>Customer List</Typography>
        {customersList.length === 0 ? (
          <Typography color="text.secondary">No customers yet.</Typography>
        ) : (
          customersList.map((customer) => (
            <Box key={customer.id} sx={{ mb: 2, p: 1, borderBottom: '1px solid #eee' }}>
              <Typography variant="subtitle1" dangerouslySetInnerHTML={{ __html: customer.name }} />
              <Typography variant="body2" color="text.secondary">Sector: {customer.sector}</Typography>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default CustomerManagementPage; 