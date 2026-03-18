import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/AdminHeader';

const AdminCourseCompletion = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/courses/upload-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(data.message);
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-24 px-6 overflow-hidden">
      <AdminHeader />
      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card p-10 bg-white"
        >
          <div className="flex items-center space-x-4 mb-10">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Upload Course Completion Data</h1>
              <p className="text-slate-500 font-medium">Upload CSV or Excel file to sync student progress</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-10">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">File Format Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-slate-600">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold">Columns: roll_number, name, course_name, level, completed</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold">completed: YES or NO</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpload} className="space-y-8">
            <div className="relative group">
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border-2 border-dashed rounded-[2.5rem] p-16 flex flex-col items-center justify-center transition-all duration-300 ${file ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 bg-slate-50 group-hover:bg-slate-100 group-hover:border-slate-300'}`}>
                <div className={`p-5 rounded-3xl mb-4 transition-colors ${file ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                  <FileText className="w-10 h-10" />
                </div>
                <p className="text-lg font-black text-slate-900 tracking-tight mb-2">
                  {file ? file.name : 'Select or drag CSV/Excel file'}
                </p>
                <p className="text-slate-400 font-bold text-sm">Maximum file size: 5MB</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full btn-saas-primary py-6 text-lg"
            >
              {uploading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing File...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-3" />
                  <span>Sync Completion Data</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCourseCompletion;
