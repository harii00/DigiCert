import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  User,
  Mail,
  Building,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Award,
  Sparkles,
  Save,
  Eye,
  Calendar,
  Upload,
  CheckCircle,
  AlertOctagon,
  FileSpreadsheet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Badge } from '../../components/UI';
import AdminHeader from '../../components/AdminHeader';
import { userAPI } from '../../services/api';

const DEPARTMENT_MAPPING = {
  'BM': 'Biomedical Engineering',
  'CE': 'Civil Engineering',
  'CD': 'Computer Science & Design',
  'CS': 'Computer Science & Engineering',
  'EE': 'Electrical & Electronics Engineering',
  'EC': 'Electronics & Communication Engineering',
  'EI': 'Electronics & Instrumentation Engineering',
  'ME': 'Mechanical Engineering',
  'MZ': 'Mechatronics Engineering',
  'SE': 'Information Science & Engineering',
  'AG': 'Agricultural Engineering',
  'AD': 'Artificial Intelligence and Data Science',
  'AL': 'Artificial Intelligence and Machine Learning',
  'BT': 'Biotechnology',
  'CB': 'Computer Science & Business Systems',
  'CT': 'Computer Technology',
  'FT': 'Fashion Technology',
  'FD': 'Food Technology',
  'IT': 'Information Technology',
  'TT': 'Textile Technology'
};

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '', roll_number: '' });
  const [saving, setSaving] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || '/api'}/users/students`);
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setFormData({ name: '', email: '', password: '', department: '', roll_number: '' });
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditMode(true);
    setFormData({
      name: student.name,
      email: student.email,
      password: '',
      department: student.department || '',
      roll_number: student.roll_number || '',
    });
    setSelectedStudent(student);
    setShowModal(true);
  };

  const openDetailModal = async (student) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || '/api'}/users/students/${student._id}`);
      setSelectedStudent(data);
      setShowDetailModal(true);
    } catch (error) {
      toast.error('Failed to load student details');
    }
  };

  const handleRollNumberChange = (value) => {
    const roll_number = value.toUpperCase();
    let newFormData = { ...formData, roll_number };

    if (roll_number.length === 12) {
      const deptCode = roll_number.substring(7, 9);
      const department = DEPARTMENT_MAPPING[deptCode];
      
      if (department) {
        newFormData.department = department;
        newFormData.password = `${roll_number}@digicert`;
      } else {
        toast.error('Invalid department code in roll number');
        newFormData.department = '';
        newFormData.password = '';
      }
    } else {
      newFormData.department = '';
      newFormData.password = '';
    }

    setFormData(newFormData);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editMode) {
      if (formData.roll_number.length !== 12) {
        toast.error('Roll number must be 12 characters');
        return;
      }
      const deptCode = formData.roll_number.substring(7, 9);
      if (!DEPARTMENT_MAPPING[deptCode]) {
        toast.error('Invalid roll number or department code.');
        return;
      }
    }

    setSaving(true);
    try {
      if (editMode && selectedStudent) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await axios.put(`${import.meta.env.VITE_API_URL || '/api'}/users/students/${selectedStudent._id}`, updateData);
        toast.success('Student updated successfully');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/users/students`, formData);
        toast.success('Student created successfully');
      }
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || '/api'}/users/students/${studentId}`);
      toast.success('Student removed');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadResults(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    setUploading(true);
    setUploadResults(null);

    try {
      const { data } = await userAPI.uploadStudentsCSV(formData);
      setUploadResults(data.results);
      toast.success('File processed successfully!');
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const resetUploadModal = () => {
    setUploadFile(null);
    setUploadResults(null);
    setShowUploadModal(false);
  };

  const downloadTemplate = () => {
    const content = 'name,roll_number,email\nHari Hara Sudhan N,7376232CB119,hariharasudhan.cb23@bitsathy.ac.in\nSneha T,7376232CB150,sneha.cb23@bitsathy.ac.in';
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.roll_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.department || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen pt-24 pb-24 px-6 overflow-hidden">
      <AdminHeader />
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/admin/dashboard')}
          className="group mb-16 flex items-center space-x-3 px-6 py-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
          <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800">Back to Console</span>
        </motion.button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-12">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-900 text-white rounded-full mb-6"
            >
              <Users className="w-3 h-3" />
              <span className="text-[12px] font-black uppercase tracking-[0.2em]">Student Registry</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-[-0.05em] text-slate-900 mb-4 leading-tight font-serif italic">
              Student Management
            </h1>
            <p className="text-slate-500 font-bold italic">Manage all student records in the institutional registry.</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="input-saas pl-12 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-saas-secondary px-6 h-fit group"
            >
              <FileSpreadsheet className="w-5 h-5 mr-2 text-indigo-500" />
              <span className="whitespace-nowrap">Upload Student List</span>
            </button>
            <button
              onClick={openCreateModal}
              className="btn-saas-primary px-8 h-fit shadow-2xl shadow-primary-500/10 group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500" />
              <span className="whitespace-nowrap">Add Student</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Total Students', value: students.length, color: 'text-slate-900', bg: 'bg-slate-50' },
            { label: 'With Certificates', value: students.filter(s => s.certificateCount > 0).length, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Total Certificates', value: students.reduce((sum, s) => sum + (s.certificateCount || 0), 0), color: 'text-indigo-500', bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="surface-card p-1"
            >
              <div className="bg-white p-8 rounded-[1.8rem] text-center">
                <p className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                <p className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className="surface-card bg-white border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black tracking-tight uppercase text-slate-900">Student Records</h2>
            </div>
            <span className="text-[12px] font-black uppercase tracking-widest text-slate-400">{filteredStudents.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Student</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Roll Number</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Email</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Department</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Certificates</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6"><div className="h-4 bg-slate-50 rounded-full w-32"></div></td>
                      <td className="px-8 py-6"><div className="h-4 bg-slate-50 rounded-full w-40"></div></td>
                      <td className="px-8 py-6"><div className="h-4 bg-slate-50 rounded-full w-24"></div></td>
                      <td className="px-8 py-6"><div className="h-6 bg-slate-50 rounded-lg w-8"></div></td>
                      <td className="px-8 py-6"><div className="h-6 bg-slate-50 rounded-lg w-24 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-16 text-center">
                      <div className="p-6 bg-slate-50 rounded-full text-slate-200 mx-auto w-fit mb-4">
                        <Users className="w-8 h-8" />
                      </div>
                      <p className="text-slate-400 font-bold">No students found</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group/row">
                      <td className="px-8 py-5">
                        <span className="font-bold text-slate-900 tracking-tight group-hover/row:text-indigo-600 transition-colors">{student.name}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{student.roll_number || '—'}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-500 font-medium">{student.email}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-500 font-medium">{student.department || '—'}</span>
                      </td>
                      <td className="px-8 py-5">
                        <Badge variant={student.certificateCount > 0 ? 'success' : 'neutral'}>
                          {student.certificateCount || 0}
                        </Badge>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openDetailModal(student)}
                            className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-2.5 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="surface-glass p-1 shadow-2xl">
                <div className="bg-white/95 rounded-[2.2rem] p-8 border border-slate-100">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-slate-900 text-white rounded-2xl">
                        {editMode ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-1 border border-indigo-100">
                          <Sparkles className="w-3 h-3" />
                          <span>{editMode ? 'Edit' : 'Create'}</span>
                        </div>
                        <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase">{editMode ? 'Update Student' : 'Register Student'}</h2>
                      </div>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2 group">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-4">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Student full name"
                          className="input-saas pl-12 placeholder:text-[11px]"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-4">Roll Number</label>
                      <div className="relative">
                        <Sparkles className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. 7376232CB119"
                          className="input-saas pl-12 font-mono placeholder:text-[11px]"
                          value={formData.roll_number}
                          onChange={(e) => handleRollNumberChange(e.target.value)}
                          maxLength={12}
                          required
                          disabled={editMode}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-4">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="student@example.com"
                          className="input-saas pl-12 placeholder:text-[11px]"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        Password {editMode && <span className="text-slate-300">(leave blank to keep current)</span>}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder={editMode ? '••••••••' : 'Auto-generated password'}
                          className="input-saas pl-12 font-mono bg-slate-50 cursor-not-allowed placeholder:text-[11px]"
                          value={formData.password}
                          readOnly
                          required={!editMode}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-4">Department</label>
                      <div className="relative">
                        <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Auto-filled from roll number"
                          className="input-saas pl-12 bg-slate-50 cursor-not-allowed placeholder:text-[11px]"
                          value={formData.department}
                          readOnly
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-saas-primary py-5 mt-4"
                      disabled={saving}
                    >
                      {saving ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          <span className="text-sm font-bold uppercase tracking-widest">{editMode ? 'Update Record' : 'Create Record'}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="surface-glass p-1 shadow-2xl">
                <div className="bg-white rounded-[2.2rem] p-10 border border-slate-100">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-slate-900 text-white rounded-2xl">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-tighter text-slate-900">{selectedStudent.name}</h2>
                        <p className="text-sm text-slate-500 font-medium">{selectedStudent.email}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Department</p>
                      <p className="font-bold text-slate-900">{selectedStudent.department || 'Not assigned'}</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Certificates</p>
                      <p className="font-bold text-slate-900">{selectedStudent.certificates?.length || 0}</p>
                    </div>
                  </div>

                  {selectedStudent.certificates && selectedStudent.certificates.length > 0 && (
                    <div>
                      <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center">
                        <Award className="w-3.5 h-3.5 mr-2" /> Certificate History
                      </h3>
                      <div className="space-y-4">
                        {selectedStudent.certificates.map((cert) => (
                          <div key={cert._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-slate-200 transition-all">
                            <div>
                              <p className="font-bold text-slate-900 tracking-tight">{cert.event}</p>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-[11px] font-mono font-bold text-slate-400">{cert.certificateId}</span>
                                <span className="text-[11px] text-slate-400 flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(cert.issuedDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Badge variant={cert.status === 'Valid' ? 'success' : 'error'}>{cert.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm"
            onClick={resetUploadModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="surface-glass p-1 shadow-2xl">
                <div className="bg-white/95 rounded-[2.2rem] p-8 border border-slate-100">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-slate-900 text-white rounded-2xl">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase">Bulk Upload</h2>
                        <p className="text-sm text-slate-500">Import students via CSV or Excel mapping</p>
                      </div>
                    </div>
                    <button onClick={resetUploadModal} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  {!uploadResults ? (
                    <div className="space-y-6">
                      <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
                        <input
                          type="file"
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          onChange={handleFileChange}
                          className="hidden"
                          id="student-file-upload"
                        />
                        <label htmlFor="student-file-upload" className="cursor-pointer flex flex-col items-center">
                          <FileSpreadsheet className="w-10 h-10 text-slate-300 mb-3" />
                          <span className="text-slate-700 font-bold mb-1">
                            {uploadFile ? uploadFile.name : 'Click to select CSV or Excel file'}
                          </span>
                          <span className="text-xs text-slate-400 font-medium tracking-wide">
                            {uploadFile ? `${(uploadFile.size / 1024).toFixed(1)} KB` : 'Required columns: name, roll_number, email'}
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={downloadTemplate}
                          className="text-[11px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors"
                        >
                          ↓ Download Template
                        </button>
                      </div>

                      <button
                        onClick={handleUpload}
                        disabled={!uploadFile || uploading}
                        className="w-full btn-saas-primary py-5 relative"
                      >
                        {uploading ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            <span className="text-sm font-bold uppercase tracking-widest">import.meta File</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
                           <div className="p-2 bg-indigo-100/50 rounded-xl text-indigo-600">
                             <Users className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Processed</p>
                             <p className="text-xl font-black text-slate-900">{uploadResults.totalProcessed}</p>
                           </div>
                         </div>
                         <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center space-x-4">
                           <div className="p-2 bg-emerald-100/50 rounded-xl text-emerald-600">
                             <CheckCircle className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Successfully Added</p>
                             <p className="text-xl font-black text-emerald-700">{uploadResults.added}</p>
                           </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-center space-x-4">
                           <div className="p-2 bg-amber-100/50 rounded-xl text-amber-600">
                             <Upload className="w-5 h-5 rotate-90" />
                           </div>
                           <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Skipped (Dupes)</p>
                             <p className="text-xl font-black text-amber-700">{uploadResults.skipped}</p>
                           </div>
                         </div>
                         <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex items-center space-x-4">
                           <div className="p-2 bg-rose-100/50 rounded-xl text-rose-600">
                             <AlertOctagon className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Invalid Rows</p>
                             <p className="text-xl font-black text-rose-700">{uploadResults.invalid}</p>
                           </div>
                         </div>
                      </div>

                      {uploadResults.errors && uploadResults.errors.length > 0 && (
                        <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl max-h-40 overflow-y-auto">
                          <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-2">Error Log</p>
                          <ul className="space-y-1">
                            {uploadResults.errors.map((err, i) => (
                              <li key={i} className="text-sm font-medium text-rose-700 flex items-start">
                                <span className="mr-2">•</span> {err}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={resetUploadModal}
                        className="w-full btn-saas-secondary py-5 bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <span className="text-sm font-bold uppercase tracking-widest">Close Summary</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentManagement;
