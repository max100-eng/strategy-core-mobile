import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  collection, 
  addDoc 
} from "firebase/firestore";
import { getPerformance } from "firebase/performance";

// Configuración de Firebase usando variables de entorno reales
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
const auth = getAuth(app);
const db = getFirestore(app);
const perf = getPerformance(app);

// Detectar entorno de desarrollo
const isDev = import.meta.env.DEV;

if (isDev) {
  // IP local definida en .env (si no existe, usa localhost)
  const localIP = import.meta.env.VITE_LOCAL_IP || "127.0.0.1";

  console.log(`Conectando a los emuladores Firebase en: ${localIP}`);

  // Emulador de Auth
  connectAuthEmulator(auth, `http://${localIP}:9099`);

  // Emulador de Firestore
  connectFirestoreEmulator(db, localIP, 8080);
}

// Exportar servicios para usar en toda la app
export { auth, db, perf };

// Función de prueba para verificar conexión con Firestore
async function enviarMensajeDePrueba() {
  try {
    const docRef = await addDoc(collection(db, "conexion_juego"), {
      mensaje: "¡Mi app de Capacitor se ha conectado con éxito!",
      fecha: new Date(),
      estado: "Listo para programar"
    });

    console.log("Documento creado con ID:", docRef.id);
  } catch (error) {
    console.error("Error al conectar con Firestore local:", error);
  }
}

// Ejecutar prueba al iniciar
enviarMensajeDePrueba();



