
import React, { useState } from 'react';
import { EducationLevel, RPPRequest } from '../types';

interface RPPFormProps {
  onSubmit: (data: RPPRequest) => void;
  isLoading: boolean;
}

const RPPForm: React.FC<RPPFormProps> = ({ onSubmit, isLoading }) => {
  const [schoolName, setSchoolName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [level] = useState<string>(EducationLevel.SMA); // Fixed to SMA
  const [grade, setGrade] = useState('');
  const [semester, setSemester] = useState('Ganjil');
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [timeAllocation, setTimeAllocation] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [cp, setCp] = useState('');
  const [conditions, setConditions] = useState('');
  const [learningMethod, setLearningMethod] = useState('Problem Based Learning (PBL)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      schoolName,
      teacherName,
      level,
      grade,
      semester,
      academicYear,
      timeAllocation,
      subject,
      topic,
      cp,
      conditions,
      learningMethod,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100 h-fit">
      <div className="border-b pb-4 mb-4 border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Identitas Perencanaan Pembelajaran
        </h2>
        <p className="text-sm text-slate-500 mt-1">Lengkapi identitas sekolah dan materi pembelajaran.</p>
      </div>

      {/* Identity Group */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Sekolah</label>
            <input
            type="text"
            placeholder="Contoh: SMA Negeri 1 Jakarta"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Penyusun</label>
            <input
            type="text"
            placeholder="Nama Guru"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mata Pelajaran</label>
          <input
            type="text"
            placeholder="Contoh: Biologi"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kelas / Fase</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <option value="" disabled>Pilih Kelas</option>
            <option value="10 (Fase E)">Kelas 10 (Fase E)</option>
            <option value="11 (Fase F)">Kelas 11 (Fase F)</option>
            <option value="12 (Fase F)">Kelas 12 (Fase F)</option>
          </select>
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Semester</label>
            <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tahun Ajaran</label>
            <input
            type="text"
            placeholder="2024/2025"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
        </div>

         <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alokasi Waktu</label>
            <input
            type="text"
            placeholder="Contoh: 2 JP x 45 Menit"
            value={timeAllocation}
            onChange={(e) => setTimeAllocation(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Content Group */}
      <div className="space-y-4">
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Model Pembelajaran</label>
            <div className="relative">
                <select
                    value={learningMethod}
                    onChange={(e) => setLearningMethod(e.target.value)}
                    required
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                >
                    <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
                    <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
                    <option value="Discovery Learning">Discovery Learning</option>
                    <option value="Inquiry Learning">Inquiry Learning</option>
                    <option value="Cooperative Learning">Cooperative Learning</option>
                    <option value="Pembelajaran Berdiferensiasi">Pembelajaran Berdiferensiasi</option>
                    <option value="Teaching at the Right Level (TaRL)">Teaching at the Right Level (TaRL)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Sintaks pembelajaran akan disesuaikan dengan model yang dipilih.</p>
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Materi / Tema</label>
            <input
                type="text"
                placeholder="Contoh: Perubahan Lingkungan"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Capaian Pembelajaran (CP)
            </label>
            <textarea
            rows={3}
            placeholder="Salin CP atau Tujuan Pembelajaran..."
            value={cp}
            onChange={(e) => setCp(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 text-sm"
            />
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Kondisi Kelas
            </label>
            <p className="text-xs text-slate-500 mb-2">Jelaskan karakteristik siswa dan sarana.</p>
            <textarea
            rows={3}
            placeholder="Contoh: Siswa aktif, suka visual, tersedia LCD Proyektor."
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 text-sm"
            />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 px-4 text-white font-medium shadow-md transition-all ${
          isLoading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Menyusun RPP Holistik...
          </>
        ) : (
          <>
            <span>Buat RPP & LKPD</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
};

export default RPPForm;
