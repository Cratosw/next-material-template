import { GetServerSidePropsContext } from 'next';
import {
  ClientSafeProvider,
  getCsrfToken,
  getProviders,
  LiteralUnion,
  signIn,
  SignInResponse
} from 'next-auth/react';
import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  FormControl,
  Grid,
  TextField,
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Input,
  InputLabel,
  Paper,
  Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

interface FormValues extends Record<string, any> {
  userName: string;
  password: string;
}

export interface SignInServerPageParams {
  csrfToken: string | undefined;
}

export default function SignIn({ csrfToken }: SignInServerPageParams): JSX.Element {
  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues:{
      userName:'admin',
      password:'123456'
    }
  });
  const [generalLoginError, setGeneralLoginError] = useState('');
  const snackbar=useSnackbar();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const router=useRouter();
  const onSubmitLogin = async (data: FormValues) => {
    try {
      signIn<"credentials">('credentials', {
        //callbackUrl: `${process.env.NEXTAUTH_URL}`,
        username: data.userName,
        password: data.password,
        redirect: false
      }).then((data:SignInResponse | undefined)=>{
        console.log("data",data);
        console.log("登录返回",data);
        if(typeof(data)==="undefined"){
          snackbar.enqueueSnackbar("内部错误",{
            variant:"error"
          });
        }
        if(!!data && data?.status===200){
          router.push(`/`);
        }
        if(!!data && data?.status===401){
          snackbar.enqueueSnackbar("用户名或者密码失败",{
            variant:"error"
          });
        }
      });
    } catch (error) {
      console.error('An unexpected error happened occurred:', error);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          component={motion.div}
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            登录
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmitLogin)} sx={{ mt: 1 }}>
            <FormGroup row={true}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <FormControl fullWidth variant="standard">
                <Controller
                  name="userName"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState, formState }) => (
                    <TextField
                      id="userName"
                      helperText={errors.userName ? errors.userName.message : null}
                      variant="outlined"
                      margin="normal"
                      hiddenLabel
                      required
                      fullWidth
                      placeholder='用户名'
                      name="userName"
                      autoComplete="userName"
                      autoFocus
                      value={field.value ?? ''}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />
                  )}
                  rules={{
                    required: 'Required'
                  }}
                />
              </FormControl>
              <FormControl fullWidth variant="standard">
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState, formState }) => (
                    <TextField
                      id="password"
                      hiddenLabel
                      type="password"
                      helperText={errors.password ? errors.password.message : null}
                      variant="outlined"
                      margin="normal"
                      required
                      placeholder='密码'
                      fullWidth
                      name="password"
                      autoComplete="current-password"
                      value={field.value ?? ''}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />
                  )}
                  rules={{
                    required: 'Required'
                  }}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="记住密码"
              />
              {generalLoginError && <div>{generalLoginError}</div>}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                登录
              </Button>
              <Grid container>
                <Grid item xs>
                  忘记密码
                </Grid>
                <Grid item>{'注册'}</Grid>
              </Grid>
            </FormGroup>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{
  props: {
    csrfToken: string | undefined;
  };
}> {
  const csrfToken: string | undefined = await getCsrfToken(context);
  return {
    props: { csrfToken }
  };
}
