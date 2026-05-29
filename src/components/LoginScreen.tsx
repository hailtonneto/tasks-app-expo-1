import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { login } from '../utils/auth-api';
import { globalStyles } from '../styles/global';

interface LoginScreenProps {
  onNavigateToSignup: () => void;
}

export default function LoginScreen({ onNavigateToSignup }: LoginScreenProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email: email.trim(), password });
      await signIn(response.token);
    } catch (err: any) {
      setError(err?.message || 'Falha ao autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/task-app-banner.png')}
              style={styles.logo}
              defaultSource={require('../../assets/icon.png')}
            />
            <Text style={styles.appName}>Gerenciador de Tarefas</Text>
            <Text style={styles.subtitle}>Gerencie suas atividades diárias com facilidade</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar</Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder="nome@exemplo.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Senha</Text>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.showPasswordText}>
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder="Sua senha secreta"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Não tem uma conta?</Text>
              <TouchableOpacity onPress={onNavigateToSignup}>
                <Text style={styles.linkText}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#eaeaea',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'left',
  },
  errorContainer: {
    backgroundColor: '#ffebe9',
    borderColor: '#ffc1c0',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#d12420',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
    width: '100%',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  showPasswordText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#ffc1c0',
    backgroundColor: '#fff9f9',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});
