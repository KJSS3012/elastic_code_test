import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import { IMaskInput } from 'react-imask';

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


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`auth-tabpanel-${index}`} aria-labelledby={`auth-tab-${index}`}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AuthPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // Estados para controlar os valores dos campos com máscara
  const [phoneValue, setPhoneValue] = useState('');
  const [cpfValue, setCpfValue] = useState('');
  const [cnpjValue, setCnpjValue] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log("Dados de Login:", {
        email: data.get('email'),
        password: data.get('password')
    });
    // TODO: Adicionar lógica de API para login
  };

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log("Dados de Registro:", {
      name: data.get('name'),
      email: data.get('email'),
      phone: phoneValue,
      cpf: cpfValue,
      cnpj: cnpjValue,
      password: data.get('password'),
    });
    // TODO: Adicionar lógica de API para registro
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Entrar" id="auth-tab-0" aria-controls="auth-tabpanel-0" />
            <Tab label="Criar Conta" id="auth-tab-1" aria-controls="auth-tabpanel-1" />
          </Tabs>
        </Box>

        {/* Painel de Login */}
        <TabPanel value={tabIndex} index={0}>
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
            Bem-vindo de volta!
          </Typography>
          <Box component="form" onSubmit={handleLoginSubmit} noValidate>
            <TextField
                margin="normal"
                required
                fullWidth
                id="login-email"
                label="Endereço de Email"
                name="email"
                autoComplete="email"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="login-password"
                autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
          </Box>
        </TabPanel>

        {/* Painel de Cadastro */}
        <TabPanel value={tabIndex} index={1}>
           <Typography component="h1" variant="h5" align="center" sx={{ mb: 2 }}>
            Crie sua conta
          </Typography>
          <Box component="form" onSubmit={handleRegisterSubmit} noValidate>
            <TextField
                margin="normal"
                required
                fullWidth
                id="register-name"
                label="Nome Completo"
                name="name"
                autoComplete="name"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="register-email"
                label="Endereço de Email"
                name="email"
                autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={phoneValue}
              onChange={(e) => setPhoneValue(e.target.value)}
              id="register-phone"
              label="Telefone"
              name="phone"
              InputProps={{ inputComponent: PhoneMaskCustom as any }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={cpfValue}
              onChange={(e) => setCpfValue(e.target.value)}
              id="register-cpf"
              label="CPF"
              name="cpf"
              InputProps={{ inputComponent: CpfMaskCustom as any }}
            />
            <TextField
              margin="normal"
              fullWidth
              value={cnpjValue}
              onChange={(e) => setCnpjValue(e.target.value)}
              id="register-cnpj"
              label="CNPJ (Opcional)"
              name="cnpj"
              InputProps={{ inputComponent: CnpjMaskCustom as any }}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Crie uma Senha"
                type="password"
                id="register-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Criar Conta
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AuthPage;