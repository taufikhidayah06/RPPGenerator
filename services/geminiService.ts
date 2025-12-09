import { GoogleGenAI, Type } from "@google/genai";
import { RPPRequest, RPPResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

export const generateRPP = async (data: RPPRequest): Promise<RPPResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const modelId = "gemini-2.5-flash";

  const prompt = `
    Bertindaklah sebagai Pakar Desain Pembelajaran Mendalam (Deep Learning) untuk jenjang SMA.
    Buatkan Perencanaan Pembelajaran dan LKPD berdasarkan data berikut:
    
    INFORMASI SEKOLAH:
    - Nama Sekolah: ${data.schoolName}
    - Nama Penyusun: ${data.teacherName}
    - Mapel: ${data.subject}
    - Kelas/Fase: ${data.grade}
    - Semester: ${data.semester}
    - Tahun Ajaran: ${data.academicYear}
    - Alokasi Waktu: ${data.timeAllocation}

    INFORMASI MATERI:
    - Tema/Materi: ${data.topic}
    - Capaian Pembelajaran (CP): "${data.cp}"
    - Kondisi Kelas/Siswa: "${data.conditions}"

    TUGAS UTAMA:
    1. Identifikasi Dimensi Profil Lulusan yang relevan.
    2. Rancang Desain Pembelajaran 4 Pilar.
    3. Susun Pengalaman Pembelajaran (Flow) yang SANGAT RINCI, HOLISTIK, dan BERBASIS STUDI KASUS.
    4. Rancang Asesmen.
    5. Buat LKPD.
    
    INSTRUKSI KHUSUS "PENGALAMAN PEMBELAJARAN" (Flow):
    - **Memahami:** Jelaskan aktivitas eksplorasi konsep yang mendalam. Jangan hanya ceramah.
    - **Mengaplikasi (PENTING):** WAJIB sertakan **STUDI KASUS KONKRET** atau masalah dunia nyata (Real World Problem) yang relevan dengan materi ini. Deskripsikan kasusnya dalam aktivitas. Siswa harus memecahkan masalah ini. Hubungkan dengan konteks lingkungan/sosial secara holistik.
    - **Merefleksi:** Aktivitas metakognitif siswa untuk menyimpulkan dan merencanakan tindak lanjut.

    Format JSON Output (Strict):
  `;

  // Define the JSON schema output matching the new Types
  const schema = {
    type: Type.OBJECT,
    properties: {
      topic_refined: { type: Type.STRING, description: "Judul materi yang spesifik" },
      graduate_profile_dimensions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      design_elements: {
        type: Type.OBJECT,
        properties: {
          pedagogical_practice: { type: Type.STRING },
          learning_partnership: { type: Type.STRING },
          learning_environment: { type: Type.STRING },
          digital_utilization: { type: Type.STRING },
        },
        required: ["pedagogical_practice", "learning_partnership", "learning_environment", "digital_utilization"]
      },
      learning_flow: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            phase: { type: Type.STRING, enum: ["Memahami", "Mengaplikasi", "Merefleksi"] },
            activity: { type: Type.STRING, description: "Deskripsi aktivitas yang panjang, rinci, mengandung studi kasus (pada fase Mengaplikasi) dan holistik." },
            duration: { type: Type.STRING },
          },
          required: ["phase", "activity", "duration"]
        },
      },
      assessments: {
        type: Type.OBJECT,
        properties: {
          as_learning: { type: Type.ARRAY, items: { type: Type.STRING } },
          for_learning: { type: Type.ARRAY, items: { type: Type.STRING } },
          of_learning: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["as_learning", "for_learning", "of_learning"]
      },
      lkpd: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "Judul LKPD" },
            activities: {
                type: Type.OBJECT,
                properties: {
                    understand: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            instructions: { type: Type.STRING },
                            questions: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["title", "instructions", "questions"]
                    },
                    apply: {
                         type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            instructions: { type: Type.STRING },
                            questions: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["title", "instructions", "questions"]
                    },
                    reflect: {
                         type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            instructions: { type: Type.STRING },
                            questions: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["title", "instructions", "questions"]
                    }
                },
                required: ["understand", "apply", "reflect"]
            }
        },
        required: ["title", "activities"]
      }
    },
    required: [
      "topic_refined",
      "graduate_profile_dimensions",
      "design_elements",
      "learning_flow",
      "assessments",
      "lkpd"
    ],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");

    return JSON.parse(text) as RPPResponse;
  } catch (error) {
    console.error("Error generating RPP:", error);
    throw error;
  }
};