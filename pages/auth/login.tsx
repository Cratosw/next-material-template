import { GetServerSidePropsContext } from 'next';
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
  Typography,
  Theme
} from '@mui/material';
import decodeJwt from 'jwt-decode';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';
import { setCookieUserToken } from 'src/components/UserToken';
import axios from 'axios';
import { setAxiosToken } from 'src/requests/axiosFectch';

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
  const snackbar=useSnackbar();
  const router=useRouter();

  const loginMutation = useMutation(
    ['loginMutation'],
    ({ userName, password }: { userName: string; password: string }) =>
      axios.post("/api/users/authenticate",{userName, password}),
    {
      onSuccess: (
        data: any,
        variables: FormValues,
        context: unknown
      ) => {
        console.log(data);
        if (data.status==200 && data.data) {
          const token = data.data.token;
          if (token) {
            const content = decodeJwt<_User.JwtToken>(token);
            const unixTimeStamp = content.exp;
            setCookieUserToken(token, content.exp);
            setAxiosToken(token);
            const redirecturl = router.query?.redirecturl;
            if (redirecturl) {
              router.replace(redirecturl as string);
            } else {
              router.replace('/');
            }
          }
        }
      },
      onError: (error: any, variables: FormValues, context: unknown) => {
        console.log(error);
      }
    }
  );
  const onSubmitLogin = async (data: FormValues) => {
    loginMutation.mutate(data);
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
          backgroundColor: (theme:Theme) =>
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
