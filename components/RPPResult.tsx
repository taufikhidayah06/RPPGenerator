
import React, { useState } from 'react';
import { RPPResponse, RPPRequest } from '../types';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType, PageBreak } from "docx";

interface RPPResultProps {
  data: RPPResponse;
  request: RPPRequest;
  onReset: () => void;
}

const RPPResult: React.FC<RPPResultProps> = ({ data, request, onReset }) => {
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const generateWordDocument = async () => {
    setIsGeneratingDoc(true);
    try {
      const tableBorders = {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
      };

      const noBorders = {
          top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }
      };

      const createBoldText = (text: string) => new TextRun({ text, bold: true });
      const createCell = (content: string | Paragraph, bold = false, fill = "FFFFFF", widthPercent?: number) => {
          return new TableCell({
            children: [typeof content === 'string' ? new Paragraph({ children: [new TextRun({ text: content, bold })] }) : content],
            shading: { fill },
            width: widthPercent ? { size: widthPercent, type: WidthType.PERCENTAGE } : undefined,
          });
      };

      // Helper for LKPD Section in DOCX
      const createLKPDSection = (title: string, instruction: string, questions: string[]) => {
          return [
              new Paragraph({ 
                  text: title, 
                  heading: HeadingLevel.HEADING_3, 
                  spacing: { before: 200, after: 100 },
                  border: { bottom: { style: BorderStyle.SINGLE, size: 6, space: 1 } }
              }),
              new Paragraph({ text: instruction, italics: true, spacing: { after: 100 } }),
              ...questions.map(q => new Paragraph({ 
                  children: [new TextRun({ text: "• " + q })],
                  spacing: { after: 100 }
              })),
              new Paragraph({ 
                  text: "", 
                  border: { bottom: { style: BorderStyle.DOTTED, size: 1, space: 1 } },
                  spacing: { before: 200, after: 200 }
              }),
          ];
      };

      const doc = new Document({
        sections: [
          {
            children: [
              // HEADER RPP
              new Paragraph({
                text: "RENCANA PELAKSANAAN PEMBELAJARAN (RPP)",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: "PENDEKATAN DEEP LEARNING",
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
                bold: true
              }),

              // Identitas Table (No Borders)
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: noBorders,
                rows: [
                  new TableRow({ children: [
                      createCell("Nama Sekolah", true, "FFFFFF", 25), 
                      createCell(`: ${request.schoolName}`)
                  ]}),
                  new TableRow({ children: [
                      createCell("Nama Penyusun", true, "FFFFFF", 25), 
                      createCell(`: ${request.teacherName}`)
                  ]}),
                  new TableRow({ children: [
                      createCell("Mata Pelajaran", true, "FFFFFF", 25), 
                      createCell(`: ${request.subject}`)
                  ]}),
                  new TableRow({ children: [
                      createCell("Kelas / Fase", true, "FFFFFF", 25), 
                      createCell(`: ${request.grade}`)
                  ]}),
                  new TableRow({ children: [
                      createCell("Tahun Ajaran", true, "FFFFFF", 25), 
                      createCell(`: ${request.academicYear} (Semester ${request.semester})`)
                  ]}),
                  new TableRow({ children: [
                      createCell("Alokasi Waktu", true, "FFFFFF", 25), 
                      createCell(`: ${request.timeAllocation}`)
                  ]}),
                  new TableRow({ children: [
                      createCell("Model Pembelajaran", true, "FFFFFF", 25), 
                      createCell(`: ${request.learningMethod}`)
                  ]}),
                  new TableRow({ children: [
                      createCell("Topik/Materi", true, "FFFFFF", 25), 
                      createCell(`: ${data.topic_refined}`)
                  ]}),
                ]
              }),
              new Paragraph({ text: "", spacing: { after: 200 } }),

              // 1. IDENTIFIKASI
              new Paragraph({ text: "I. IDENTIFIKASI", heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
              new Paragraph({ text: "Dimensi Profil Lulusan:", bold: true, spacing: { after: 100 } }),
              ...data.graduate_profile_dimensions.map(d => new Paragraph({ text: d, bullet: { level: 0 } })),
              new Paragraph({ text: "" }),

              // 2. DESAIN PEMBELAJARAN
              new Paragraph({ text: "II. DESAIN PEMBELAJARAN", heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
              
              // Tujuan Pembelajaran (Added)
              new Paragraph({ text: "Tujuan Pembelajaran:", bold: true, spacing: { after: 100 } }),
              ...data.learning_objectives.map(obj => new Paragraph({ text: obj, bullet: { level: 0 } })),
              new Paragraph({ text: "", spacing: { after: 200 } }),

              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: tableBorders,
                rows: [
                  new TableRow({ children: [createCell("Praktik Pedagogis", true, "E0E0E0", 30), createCell(data.design_elements.pedagogical_practice)] }),
                  new TableRow({ children: [createCell("Kemitraan Pembelajaran", true, "E0E0E0"), createCell(data.design_elements.learning_partnership)] }),
                  new TableRow({ children: [createCell("Lingkungan Pembelajaran", true, "E0E0E0"), createCell(data.design_elements.learning_environment)] }),
                  new TableRow({ children: [createCell("Pemanfaatan Digital", true, "E0E0E0"), createCell(data.design_elements.digital_utilization)] }),
                ]
              }),
              new Paragraph({ text: "" }),

              // 3. PENGALAMAN PEMBELAJARAN
              new Paragraph({ text: "III. PENGALAMAN PEMBELAJARAN (HOLISTIK & STUDI KASUS)", heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: tableBorders,
                rows: [
                  new TableRow({
                    tableHeader: true,
                    children: [
                       createCell("Tahapan", true, "E0E0E0", 20),
                       createCell("Deskripsi Aktivitas Pembelajaran", true, "E0E0E0"),
                       createCell("Waktu", true, "E0E0E0", 15),
                    ]
                  }),
                  ...data.learning_flow.map(flow => 
                    new TableRow({
                      children: [
                        createCell(flow.phase, true),
                        createCell(flow.activity),
                        createCell(flow.duration),
                      ]
                    })
                  )
                ]
              }),
              new Paragraph({ text: "" }),

              // 4. ASESMEN PEMBELAJARAN
              new Paragraph({ text: "IV. ASESMEN PEMBELAJARAN", heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: tableBorders,
                rows: [
                    new TableRow({
                        children: [
                            createCell("Jenis Asesmen", true, "E0E0E0", 30),
                            createCell("Teknik & Instrumen", true, "E0E0E0"),
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("Assessment AS Learning\n(Refleksi/Diri/Sejawat)"),
                            createCell(data.assessments.as_learning.join(", ")),
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("Assessment FOR Learning\n(Umpan Balik/Proses)"),
                            createCell(data.assessments.for_learning.join(", ")),
                        ]
                    }),
                    new TableRow({
                        children: [
                            createCell("Assessment OF Learning\n(Pencapaian/Produk)"),
                            createCell(data.assessments.of_learning.join(", ")),
                        ]
                    }),
                ]
              }),
              
              new Paragraph({ text: "", spacing: { after: 400 } }),
              
              // Signature
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: noBorders,
                rows: [
                   new TableRow({
                     children: [
                       new TableCell({ children: [
                         new Paragraph({ text: "Mengetahui,", alignment: AlignmentType.CENTER }),
                         new Paragraph({ text: "Kepala Sekolah", alignment: AlignmentType.CENTER }),
                         new Paragraph({ text: "", spacing: { before: 800 } }),
                         new Paragraph({ text: "______________________", alignment: AlignmentType.CENTER }),
                       ] }),
                       new TableCell({ children: [
                         new Paragraph({ text: `Guru ${request.subject}`, alignment: AlignmentType.CENTER }),
                         new Paragraph({ text: "", spacing: { before: 800 } }),
                         new Paragraph({ text: request.teacherName || "______________________", alignment: AlignmentType.CENTER }),
                       ] }),
                     ]
                   })
                ]
              }),

              // --- LKPD PAGE START ---
              new Paragraph({ children: [new PageBreak()] }),
              
              new Paragraph({
                  text: "LEMBAR KERJA PESERTA DIDIK (LKPD)",
                  heading: HeadingLevel.HEADING_1,
                  alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                  text: data.lkpd.title,
                  heading: HeadingLevel.HEADING_2,
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 300 }
              }),
              
              // Student Identity Box
              new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  borders: tableBorders,
                  rows: [
                      new TableRow({ children: [
                          new TableCell({ children: [new Paragraph({ text: "Nama Kelompok / Siswa : ___________________________________" })], margins: { top: 100, bottom: 100 } })
                      ]}),
                       new TableRow({ children: [
                          new TableCell({ children: [new Paragraph({ text: `Kelas: ${request.grade}  |  Tanggal: __________________` })], margins: { top: 100, bottom: 100 } })
                      ]})
                  ]
              }),
              new Paragraph({ text: "" }),

              // 1. MEMAHAMI
              ...createLKPDSection("A. FASE MEMAHAMI", data.lkpd.activities.understand.instructions, data.lkpd.activities.understand.questions),
              
              // 2. MENGAPLIKASI
              ...createLKPDSection("B. FASE MENGAPLIKASI (Studi Kasus)", data.lkpd.activities.apply.instructions, data.lkpd.activities.apply.questions),

              // 3. MEREFLEKSI
              ...createLKPDSection("C. FASE MEREFLEKSI", data.lkpd.activities.reflect.instructions, data.lkpd.activities.reflect.questions),

            ]
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RPP-DeepLearning-${request.subject}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Gagal download Word");
    } finally {
        setIsGeneratingDoc(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Action Bar */}
      <div className="flex flex-wrap justify-between items-center mb-6 no-print gap-4">
        <button
          onClick={onReset}
          className="text-slate-500 hover:text-slate-800 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Form
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={generateWordDocument}
            disabled={isGeneratingDoc}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm disabled:bg-blue-400"
          >
             {isGeneratingDoc ? "Menyiapkan..." : "Download RPP + LKPD (.docx)"}
          </button>
          <button
            onClick={handlePrint}
            className="bg-slate-800 text-white hover:bg-slate-900 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            Cetak PDF
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW AREA */}
      <div className="bg-white p-8 md:p-12 shadow-lg max-w-4xl mx-auto rounded-none md:rounded-lg border border-slate-200 print:shadow-none print:w-full print:max-w-none print:border-none print:p-0">
        
        {/* Title */}
        <div className="text-center mb-8 border-b-2 border-slate-800 pb-4">
          <h1 className="text-2xl font-bold uppercase text-slate-900">Rencana Pelaksanaan Pembelajaran</h1>
          <p className="text-primary font-bold uppercase tracking-widest text-sm mt-1">Deep Learning Approach</p>
        </div>

        {/* Identity Section (New Table Layout) */}
        <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-700">
                <tbody>
                    <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold w-40">Nama Sekolah</td>
                        <td className="py-2">: {request.schoolName}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold">Nama Penyusun</td>
                        <td className="py-2">: {request.teacherName}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold">Mata Pelajaran</td>
                        <td className="py-2">: {request.subject}</td>
                    </tr>
                     <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold">Kelas / Fase</td>
                        <td className="py-2">: {request.grade}</td>
                    </tr>
                     <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold">Tahun Ajaran</td>
                        <td className="py-2">: {request.academicYear} (Semester {request.semester})</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold">Alokasi Waktu</td>
                        <td className="py-2">: {request.timeAllocation}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <td className="py-2 font-bold">Model Pembelajaran</td>
                        <td className="py-2">: {request.learningMethod}</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-bold">Materi/Tema</td>
                        <td className="py-2">: {data.topic_refined}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* SECTION I: IDENTIFIKASI */}
        <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-300 pb-1">I. Identifikasi</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 print:bg-white print:border-slate-200">
                <h3 className="text-sm font-bold text-blue-800 uppercase mb-2 print:text-slate-900">Dimensi Profil Lulusan</h3>
                <div className="flex flex-wrap gap-2">
                    {data.graduate_profile_dimensions.map((dim, i) => (
                        <span key={i} className="px-3 py-1 bg-white text-blue-700 text-sm font-medium rounded-full border border-blue-200 shadow-sm print:border-slate-400 print:text-slate-800 print:shadow-none">
                            {dim}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* SECTION II: DESAIN */}
        <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-300 pb-1">II. Desain Pembelajaran</h2>
            
            {/* Added: Learning Objectives */}
            <div className="mb-6 p-4 border border-indigo-100 bg-indigo-50/50 rounded-lg print:border-none print:bg-white print:p-0">
                <h3 className="font-bold text-slate-900 mb-2">Tujuan Pembelajaran</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm">
                    {data.learning_objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                    ))}
                </ul>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border border-slate-200 rounded-lg">
                    <strong className="block text-primary mb-1">Praktik Pedagogis</strong>
                    <p className="text-slate-700 text-sm">{data.design_elements.pedagogical_practice}</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg">
                    <strong className="block text-primary mb-1">Kemitraan Pembelajaran</strong>
                    <p className="text-slate-700 text-sm">{data.design_elements.learning_partnership}</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg">
                    <strong className="block text-primary mb-1">Lingkungan Pembelajaran</strong>
                    <p className="text-slate-700 text-sm">{data.design_elements.learning_environment}</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg">
                    <strong className="block text-primary mb-1">Pemanfaatan Digital</strong>
                    <p className="text-slate-700 text-sm">{data.design_elements.digital_utilization}</p>
                </div>
            </div>
        </div>

        {/* SECTION III: PENGALAMAN (DETAILED) */}
        <div className="mb-8 break-inside-avoid">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-300 pb-1">III. Pengalaman Pembelajaran (Holistik)</h2>
            <div className="space-y-6">
                {data.learning_flow.map((flow, idx) => (
                    <div key={idx} className="flex gap-4 p-4 border rounded-lg bg-slate-50 print:bg-white print:border-slate-200">
                         <div className="w-32 shrink-0">
                            <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 ${
                                flow.phase === 'Memahami' ? 'bg-blue-100 text-blue-800' : 
                                flow.phase === 'Mengaplikasi' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                                {flow.phase}
                            </span>
                            <p className="text-xs text-slate-500 font-mono">{flow.duration}</p>
                        </div>
                        <div className="flex-grow">
                             <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-line leading-relaxed">
                                {flow.activity}
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* SECTION IV: ASESMEN */}
        <div className="mb-8 break-inside-avoid">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-300 pb-1">IV. Asesmen Pembelajaran</h2>
            <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase w-1/3">Jenis Asesmen</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Teknik & Instrumen</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        <tr>
                            <td className="px-4 py-3 align-top">
                                <span className="font-semibold text-slate-900 text-sm">Assessment AS Learning</span>
                                <p className="text-xs text-slate-500 mt-1">Penilaian diri & Sejawat</p>
                            </td>
                            <td className="px-4 py-3 align-top text-sm text-slate-700">
                                <ul className="list-disc pl-4 space-y-1">
                                    {data.assessments.as_learning.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 align-top">
                                <span className="font-semibold text-slate-900 text-sm">Assessment FOR Learning</span>
                                <p className="text-xs text-slate-500 mt-1">Umpan Balik & Proses</p>
                            </td>
                            <td className="px-4 py-3 align-top text-sm text-slate-700">
                                <ul className="list-disc pl-4 space-y-1">
                                    {data.assessments.for_learning.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 align-top">
                                <span className="font-semibold text-slate-900 text-sm">Assessment OF Learning</span>
                                <p className="text-xs text-slate-500 mt-1">Pencapaian Hasil</p>
                            </td>
                            <td className="px-4 py-3 align-top text-sm text-slate-700">
                                <ul className="list-disc pl-4 space-y-1">
                                    {data.assessments.of_learning.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {/* LKPD PREVIEW */}
        <div className="mt-12 pt-8 border-t-4 border-dashed border-slate-300 break-before-page">
            <h1 className="text-2xl font-bold text-center mb-6 bg-yellow-100 p-2 border border-yellow-200 rounded text-slate-800">LEMBAR KERJA PESERTA DIDIK (LKPD)</h1>
            
            <div className="border-2 border-slate-800 p-6 md:p-8 bg-white">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold uppercase">{data.lkpd.title}</h2>
                    <p className="text-sm mt-1">Mapel: {request.subject} | Kelas: {request.grade}</p>
                </div>

                <div className="mb-6 p-4 border border-slate-400 rounded bg-slate-50">
                    <p className="mb-2">Nama Kelompok/Siswa: ________________________________</p>
                    <p>Tanggal: ________________________________</p>
                </div>

                {/* Part A */}
                <div className="mb-6">
                    <h3 className="font-bold text-lg mb-2 bg-slate-100 p-1 border-l-4 border-blue-500 px-3">A. {data.lkpd.activities.understand.title}</h3>
                    <p className="italic text-sm text-slate-600 mb-3">{data.lkpd.activities.understand.instructions}</p>
                    <ul className="list-decimal pl-5 space-y-4">
                        {data.lkpd.activities.understand.questions.map((q, i) => (
                            <li key={i} className="text-slate-800">
                                {q}
                                <div className="mt-2 h-16 border-b border-dotted border-slate-300"></div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Part B */}
                <div className="mb-6">
                    <h3 className="font-bold text-lg mb-2 bg-slate-100 p-1 border-l-4 border-indigo-500 px-3">B. {data.lkpd.activities.apply.title}</h3>
                    <p className="italic text-sm text-slate-600 mb-3">{data.lkpd.activities.apply.instructions}</p>
                    <ul className="list-decimal pl-5 space-y-4">
                        {data.lkpd.activities.apply.questions.map((q, i) => (
                            <li key={i} className="text-slate-800">
                                {q}
                                <div className="mt-2 h-24 border-b border-dotted border-slate-300"></div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Part C */}
                <div className="mb-6">
                    <h3 className="font-bold text-lg mb-2 bg-slate-100 p-1 border-l-4 border-emerald-500 px-3">C. {data.lkpd.activities.reflect.title}</h3>
                    <p className="italic text-sm text-slate-600 mb-3">{data.lkpd.activities.reflect.instructions}</p>
                    <ul className="list-decimal pl-5 space-y-4">
                        {data.lkpd.activities.reflect.questions.map((q, i) => (
                            <li key={i} className="text-slate-800">
                                {q}
                                <div className="mt-2 h-16 border-b border-dotted border-slate-300"></div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Footer Signatures */}
        <div className="mt-16 pt-8 flex justify-between text-center print:flex hidden">
             <div>
                <p className="mb-16">Kepala Sekolah</p>
                <p className="font-bold underline">_______________________</p>
            </div>
            <div>
                <p className="mb-16">Guru Mata Pelajaran</p>
                <p className="font-bold underline">{request.teacherName}</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default RPPResult;
