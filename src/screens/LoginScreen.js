import React, { useState } from "react"
import { View, Text, TextInput, Button, Alert, StyleSheet, SafeAreaView } from "react-native"
import { supabase } from "../lib/supabase"

export default function LoginScreen({ onLogin, goRegister }) {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [carregando, setCarregando] = useState(false)

  const login = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha")
      return
    }

    setCarregando(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    })

    if (error) {
      Alert.alert("Erro no login", error.message)
      setCarregando(false)
      return
    }

    const user = data.user

    if (!user) {
      Alert.alert("Erro", "Usuário não encontrado")
      setCarregando(false)
      return
    }

    const { data: perfil, error: errPerfil } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (errPerfil || !perfil) {
      Alert.alert("Erro", "Perfil não encontrado. Tente se cadastrar novamente.")
      setCarregando(false)
      return
    }

    setCarregando(false)
    onLogin(perfil)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>LOGIN</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        autoCapitalize="none"
      />

      <View style={styles.botao}>
        <Button title={carregando ? "Entrando..." : "Entrar"} onPress={login} disabled={carregando} />
      </View>
      <View style={styles.botao}>
        <Button title="Criar conta" onPress={goRegister} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 12, fontSize: 16 },
  botao: { marginBottom: 10 },
})