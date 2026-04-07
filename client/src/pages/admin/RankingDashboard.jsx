import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Trophy,
  Medal,
  Award,
  ArrowLeft,
  TrendingUp,
  Crown,
  Sparkles,
  Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/UI';
import AdminHeader from '../../components/AdminHeader';

const RankingDashboard = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || '/api'}/certificates/ranking`);
      setRanking(data);
    } catch (error) {
      console.error('Error fetching ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-sm font-black text-slate-300 w-5 text-center">{rank}</span>;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100 hover:border-amber-200';
    if (rank === 2) return 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 hover:border-slate-300';
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100 hover:border-orange-200';
    return 'hover:bg-slate-50/50';
  };

  return (
    <div className="relative min-h-screen pt-24 pb-24 px-6 overflow-hidden">
      <AdminHeader />
      <div className="max-w-[1200px] mx-auto relative z-10">
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
              <Trophy className="w-3 h-3" />
              <span className="text-[12px] font-black uppercase tracking-[0.2em]">Leaderboard</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-[-0.05em] text-slate-900 mb-4 leading-tight font-serif italic">
              Top 100 Students
            </h1>
            <p className="text-slate-500 font-bold italic">
              Students ranked by total certificates earned across the institutional registry.
            </p>
          </div>

          <div className="surface-card p-8 bg-white border-slate-100 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Ranked</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{ranking.length}</p>
          </div>
        </div>

        {/* Top 3 Podium */}
        {!loading && ranking.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[ranking[1], ranking[0], ranking[2]].map((student, i) => {
              const order = [2, 1, 3];
              const rank = order[i];
              const colors = {
                1: { bg: 'bg-gradient-to-br from-amber-50 to-yellow-50', border: 'border-amber-200', text: 'text-amber-600', icon: 'bg-amber-100' },
                2: { bg: 'bg-gradient-to-br from-slate-50 to-gray-50', border: 'border-slate-200', text: 'text-slate-500', icon: 'bg-slate-100' },
                3: { bg: 'bg-gradient-to-br from-orange-50 to-amber-50', border: 'border-orange-200', text: 'text-orange-600', icon: 'bg-orange-100' },
              };
              const c = colors[rank];

              return (
                <motion.div
                  key={student.studentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className={`surface-card p-1 ${rank === 1 ? 'md:-mt-8' : ''}`}
                >
                  <div className={`${c.bg} p-10 rounded-[1.8rem] border ${c.border} text-center relative overflow-hidden`}>
                    <div className={`w-16 h-16 ${c.icon} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      {rank === 1 ? <Crown className={`w-8 h-8 ${c.text}`} /> : <Medal className={`w-7 h-7 ${c.text}`} />}
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${c.text} mb-2`}>Rank #{rank}</p>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1 truncate">{student.studentName}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">{student.department || 'General'}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <Award className="w-4 h-4 text-indigo-500" />
                      <span className="text-3xl font-black text-slate-900 tracking-tighter">{student.totalCertificates}</span>
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">certificates</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full Ranking Table */}
        <div className="surface-card bg-white border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black tracking-tight uppercase text-slate-900">Complete Rankings</h2>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              <Sparkles className="w-3 h-3" />
              <span>Top 100</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 w-20">Rank</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Department</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Total Certificates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-5"><div className="h-4 bg-slate-50 rounded-full w-8"></div></td>
                      <td className="px-8 py-5"><div className="h-4 bg-slate-50 rounded-full w-40"></div></td>
                      <td className="px-8 py-5"><div className="h-4 bg-slate-50 rounded-full w-28"></div></td>
                      <td className="px-8 py-5"><div className="h-6 bg-slate-50 rounded-lg w-12 ml-auto"></div></td>
                    </tr>
                  ))
                ) : ranking.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center">
                      <div className="p-6 bg-slate-50 rounded-full text-slate-200 mx-auto w-fit mb-4">
                        <Trophy className="w-8 h-8" />
                      </div>
                      <p className="text-slate-400 font-bold">No ranking data available yet</p>
                    </td>
                  </tr>
                ) : (
                  ranking.map((student) => (
                    <tr key={student.studentId} className={`transition-colors ${getRankStyle(student.rank)}`}>
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-3">
                          {getRankIcon(student.rank)}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`font-bold tracking-tight ${student.rank <= 3 ? 'text-slate-900 text-lg' : 'text-slate-700'}`}>
                          {student.studentName}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-500 font-medium">{student.department || '—'}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Badge variant={student.rank <= 3 ? 'info' : 'neutral'}>
                          <div className="flex items-center space-x-1.5">
                            <Award className="w-3 h-3" />
                            <span>{student.totalCertificates}</span>
                          </div>
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingDashboard;
