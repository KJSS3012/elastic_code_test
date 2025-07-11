import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../../stores/store';
import { loginUser, registerUser, clearError, setError } from '../../stores/auth/slice';
import {
  Container, Box, TextField, Button, Typography, Paper,
  Tabs, Tab, Alert, CircularProgress
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { AppDispatch } from '../../stores/store';
import { useNotification } from '../../contexts/NotificationContext';

// --- Início dos Componentes de Máscara ---

// Interface genérica para os props dos nossos componentes de máscara
interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

// Máscara para Telefone
const PhoneMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
  function PhoneMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="(00) 00000-0000"
        inputRef={ref as any}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

// Máscara para CPF
const CpfMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
  function CpfMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="000.000.000-00"
        inputRef={ref as any}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

// Máscara para CNPJ
const CnpjMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
  function CnpjMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00.000.000/0000-00"
        inputRef={ref as any}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);
// --- Fim dos Componentes de Máscara ---


const AuthPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.authReducer);
  const { showNotification } = useNotification();

  const [tabIndex, setTabIndex] = useState(0);
  const [phoneValue, setPhoneValue] = useState('');
  const [cpfValue, setCpfValue] = useState('');
  const [cnpjValue, setCnpjValue] = useState('');
  const [lastAction, setLastAction] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      if (lastAction === 'login') {
        showNotification('Login realizado com sucesso!', 'success');
      }
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, lastAction, showNotification]);

  React.useEffect(() => {
    // Mostrar notificação de sucesso do registro quando não está carregando e não há erro
    if (lastAction === 'register' && !loading && !error) {
      showNotification('Usuário criado com sucesso! Faça login para continuar.', 'success');
      setTabIndex(0); // Mudar para aba de login
      setLastAction(null);
    }
  }, [loading, error, lastAction, showNotification]);

  React.useEffect(() => {
    dispatch(clearError());
  }, [tabIndex, dispatch]);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setLastAction('login');
    dispatch(loginUser({
      email: data.get('email') as string,
      password: data.get('password') as string
    }));
  };

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Remover máscaras dos campos
    const cleanPhone = phoneValue.replace(/\D/g, ''); // Remove tudo que não é dígito
    const cleanCpf = cpfValue.replace(/\D/g, '');
    const cleanCnpj = cnpjValue.replace(/\D/g, '');

    // Validações básicas
    if (!cleanCpf || cleanCpf.length !== 11) {
      dispatch(setError('CPF é obrigatório e deve ter 11 dígitos'));
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      dispatch(setError('Telefone é obrigatório e deve ter pelo menos 10 dígitos'));
      return;
    }

    const registerData = {
      producer_name: data.get('name'),
      email: data.get('email'),
      phone: cleanPhone,
      password: data.get('password'),
      cpf: cleanCpf, // CPF é obrigatório
    };

    // Adicionar CNPJ se preenchido
    if (cleanCnpj) {
      (registerData as any).cnpj = cleanCnpj;
    }

    setLastAction('register');
    dispatch(registerUser(registerData));
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} variant="fullWidth">
            <Tab label="Entrar" />
            <Tab label="Criar Conta" />
          </Tabs>
        </Box>

        {/* Painel de Login */}
        {tabIndex === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
              Bem-vindo de volta!
            </Typography>
            <Box component="form" onSubmit={handleLoginSubmit} noValidate>
              <TextField margin="normal" required fullWidth name="email" label="Email" type="email" autoComplete="email" autoFocus />
              <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" autoComplete="current-password" />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Entrar'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Painel de Cadastro */}
        {tabIndex === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
              Crie sua conta
            </Typography>
            <Box component="form" onSubmit={handleRegisterSubmit} noValidate>
              <TextField margin="normal" required fullWidth name="name" label="Nome Completo" autoComplete="name" />
              <TextField margin="normal" required fullWidth name="email" label="Email" type="email" autoComplete="email" />
              <TextField
                margin="normal" required fullWidth
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                label="Telefone" name="phone"
                InputProps={{ inputComponent: PhoneMaskCustom as any }}
              />
              <TextField
                margin="normal" required fullWidth
                value={cpfValue}
                onChange={(e) => setCpfValue(e.target.value)}
                label="CPF" name="cpf"
                InputProps={{ inputComponent: CpfMaskCustom as any }}
              />
              <TextField
                margin="normal" fullWidth
                value={cnpjValue}
                onChange={(e) => setCnpjValue(e.target.value)}
                label="CNPJ (Opcional)" name="cnpj"
                InputProps={{ inputComponent: CnpjMaskCustom as any }}
              />
              <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Criar Conta'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AuthPage;