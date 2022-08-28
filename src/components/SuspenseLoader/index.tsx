import { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import NProgress from 'nprogress';

function SuspenseLoader() {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <motion.div
      style={{
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <CircularProgress size={64} disableShrink thickness={3} />
    </motion.div>
  );
}

export default SuspenseLoader;
