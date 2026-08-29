import { app } from './app.js';
import { env } from './config/env.js';
app.listen(env.PORT, () => console.info(`TrustTrail API listening on :${env.PORT}`));
