import dotenv from 'dotenv';

dotenv.config({ silent: true });

const admin = require('firebase-admin');
// We need to get this json file in the root of our server.
// eslint-disable-next-line import/no-absolute-path
const serviceAccount = require('../serviceAccountKey.json');
// const serviceAccount = {
//   type: process.env.type,
//   project_id: process.env.project_id,
//   private_key_id: process.env.private_key_id,
//   private_key: process.env.private_key,
//   client_email: process.env.client_email,
//   client_id: process.env.client_id,
//   auth_uri: process.env.auth_uri,
//   token_uri: process.env.token_uri,
//   auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
//   client_x509_cert_url: process.env.client_x509_cert_url,
// };
// https://javascript.plainenglish.io/lets-create-react-app-with-firebase-auth-express-backend-and-mongodb-database-805c83e4dadd
// Code pulled from above

// Initialize firebase admin app,
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
async function decodeIDToken(req, res, next) {
  const header = req.headers?.authorization;
  if (header !== 'Bearer null' && req.headers?.authorization?.startsWith('Bearer ')) {
    // Grab the token from the header
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
    // verify the token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      // if verified we put thi stoken into the request so that the routes will be able ot sue it.
      req.currentUser = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }
  next();
}
module.exports = decodeIDToken;
