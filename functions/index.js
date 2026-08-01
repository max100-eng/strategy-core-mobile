const functions = require("firebase-functions");
const { GoogleAuth } = require("google-auth-library");

/**
 * Cloud Function: verifyIntegrityToken
 * Recibe el token generado en Android y lo valida usando la API REST de Play Integrity.
 * Devuelve el veredicto completo, incluyendo señales avanzadas.
 */
exports.verifyIntegrityToken = functions.https.onCall(async (data, context) => {
  try {
    // Token enviado desde tu app Android
    const token = data.token;
    if (!token) {
      throw new Error("No integrity token provided");
    }

    // Autenticación con Google Cloud
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/playintegrity"]
    });

    const client = await auth.getClient();

    // Tu número de proyecto de Google Cloud (lo veo en tu pestaña actual)
    const projectNumber = "378940662151";

    // Endpoint oficial de Play Integrity REST API
    const url = `https://playintegrity.googleapis.com/v1/projects/${projectNumber}:verifyIntegrity`;

    // Cuerpo de la petición
    const body = {
      integrityToken: token
    };

    // Llamada a la API REST
    const response = await client.request({
      url,
      method: "POST",
      data: body
    });

    // Devuelve el veredicto completo a tu app
    return response.data;

  } catch (error) {
    console.error("Error verifying token:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
