
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, TextField, Button, Alert,
  Stack, Avatar, IconButton, CircularProgress, Chip
} from '@mui/material';
import { blue } from '@mui/material/colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import logo from '../assets/react.svg';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  isActive: boolean;
  files?: string[];
}

const SubmitAssignmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [text, setText] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axios.get(`/api/assignments/${id}`, {
          baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignment(res.data.data);
      } catch (err) {
        setError('Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };

    if (token && id) fetchAssignment();
  }, [token, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !files?.length) {
      setError('Please provide either text or file submission');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('assignmentId', id!);
      formData.append('text', text);
      
      if (files) {
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });
      }

      await axios.post('/api/submissions', formData, {
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      setSuccess('Assignment submitted successfully!');
      setTimeout(() => navigate('/assignments'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (loading) return <Box display="flex" justifyContent="center" pt={4}><CircularProgress /></Box>;
  if (!assignment) return <Typography>Assignment not found</Typography>;

  return (
    <Box sx={{ bgcolor: '#f7fafd', minHeight: '100vh', pb: 6 }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', boxShadow: 1, borderRadius: 2, mb: 4, px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={logo} sx={{ mr: 1, bgcolor: 'transparent', width: 40, height: 40 }} />
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Class Sync
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: blue[500], width: 36, height: 36, fontWeight: 700 }}>
            {getInitials(user?.name || '')}
          </Avatar>
          <Typography fontWeight={600}>{user?.name}</Typography>
        </Stack>
      </Box>

      <Box maxWidth="md" mx="auto" px={3}>
        <Stack direction="row" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/assignments')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight={700}>Submit Assignment</Typography>
        </Stack>

        {/* Assignment Details */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={600} mb={2}>{assignment.title}</Typography>
            <Typography color="text.secondary" mb={2}>{assignment.description}</Typography>
            <Chip 
              label={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
              color={new Date(assignment.dueDate) > new Date() ? 'success' : 'error'}
              sx={{ fontWeight: 600 }}
            />
          </CardContent>
        </Card>

        {/* Submission Form */}
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={3}>Your Submission</Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Text Submission"
                multiline
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
                placeholder="Enter your answer or explanation here..."
              />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  File Upload (optional)
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Choose Files
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => setFiles(e.target.files)}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                  />
                </Button>
                {files && (
                  <Box mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      Selected: {Array.from(files).map(f => f.name).join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || (!text.trim() && !files?.length)}
                  startIcon={submitting && <CircularProgress size={20} />}
                  sx={{ fontWeight: 600 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/assignments')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default SubmitAssignmentPage;
