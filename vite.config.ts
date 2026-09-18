import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import createOrderHandler from './api/create-order.ts';
import verifyPaymentHandler from './api/verify-payment.ts';
import webhookHandler from './api/webhook.ts';

function razorpayDevApiPlugin(): Plugin {
  return {
    name: 'razorpay-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url === '/api/create-order') {
          await createOrderHandler(req, res);
          return;
        }
        if (url === '/api/verify-payment') {
          await verifyPaymentHandler(req, res);
          return;
        }
        if (url === '/api/webhook') {
          await webhookHandler(req, res);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load environment variables for local dev server (e.g. RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
  // Unprefixed variables remain server-side only in process.env
  const env = loadEnv(mode, process.cwd(), '');
  if (env.RAZORPAY_KEY_ID) process.env.RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID;
  if (env.RAZORPAY_KEY_SECRET) process.env.RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET;
  if (env.RAZORPAY_WEBHOOK_SECRET) process.env.RAZORPAY_WEBHOOK_SECRET = env.RAZORPAY_WEBHOOK_SECRET;

  return {
    plugins: [react(), razorpayDevApiPlugin()],
    server: {
      port: 3000,
      host: true,
    },
    build: {
      target: 'es2020',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-motion': ['framer-motion'],
            'vendor-lenis': ['lenis'],
          },
        },
      },
    },
  };
});
