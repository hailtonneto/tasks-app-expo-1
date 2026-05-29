import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error('Erro ao salvar token no localStorage:', e);
    }
  } else {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (e) {
      console.error('SecureStore falhou, usando fallback local:', e);
    }
  }
}

export async function getToken() {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      console.error('Erro ao recuperar token do localStorage:', e);
      return null;
    }
  } else {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (e) {
      console.error('Erro ao recuperar token do SecureStore, usando fallback:', e);
      return null;
    }
  }
}

export async function removeToken() {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Erro ao remover token do localStorage:', e);
    }
  } else {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (e) {
      console.error('Erro ao remover token do SecureStore:', e);
    }
  }
}
