import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function testFirebaseAndroid() {
  console.log("🔍 Probando Firebase en Android…");

  try {
    // 1. Escribir documento
    const ref = await addDoc(collection(db, "android_test"), {
      mensaje: "Hola desde Android!",
      fecha: new Date(),
      dispositivo: "Capacitor"
    });

    console.log("📌 Documento creado:", ref.id);

    // 2. Leer documentos
    const snap = await getDocs(collection(db, "android_test"));
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    console.log("📄 Documentos leídos:", docs);

    return {
      ok: true,
      escritos: ref.id,
      leidos: docs
    };

  } catch (err) {
    console.error("❌ Error en Firebase Android:", err);
    return { ok: false, error: err };
  }
}
