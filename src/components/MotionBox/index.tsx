import { Box, BoxProps, styled } from '@mui/material';
import { motion, MotionProps } from 'framer-motion';

interface MotionDivBoxProps
  extends Omit<BoxProps, 'component'>,
    Omit<MotionProps, 'style' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {}
export const MotionDivBox = (props: MotionDivBoxProps) => {
  const { children, ...rest } = props;
  return (
    <Box component={motion.div} {...rest}>
      {children}
    </Box>
  );
};
