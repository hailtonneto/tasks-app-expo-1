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
  ScrollView,
} from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { signup } from '../utils/auth-api';

interface SignupScreenProps {
  onNavigateToLogin: () => void;
}

export default function SignupScreen({ onNavigateToLogin }: SignupScreenProps) {
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
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

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const response = await signup({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      await signIn(response.token);
    } catch (err: any) {
      setError(err?.message || 'Falha ao criar conta. Tente novamente.');
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/task-app-banner.png')}
                style={styles.logo}
                defaultSource={require('../../assets/icon.png')}
              />
              <Text style={styles.appName}>Gerenciador de Tarefas</Text>
              <Text style={styles.subtitle}>Crie sua conta para começar a se organizar</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Criar Conta</Text>

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                  style={[styles.input, error && !name.trim() ? styles.inputError : null]}
                  placeholder="Seu nome"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  style={[styles.input, error && !email.trim() ? styles.inputError : null]}
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
                  style={[styles.input, error && password.length < 6 ? styles.inputError : null]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput
                  style={[styles.input, error && password !== confirmPassword ? styles.inputError : null]}
                  placeholder="Confirme sua senha"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Criar Conta</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Já tem uma conta?</Text>
                <TouchableOpacity onPress={onNavigateToLogin}>
                  <Text style={styles.linkText}>Entrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
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
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 14,
    marginBottom: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
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
    marginBottom: 12,
    width: '100%',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  showPasswordText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#000',
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#ffc1c0',
    backgroundColor: '#fff9f9',
  },
  button: {
    width: '100%',
    height: 46,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
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
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: '#666',
  },
  linkText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
});
