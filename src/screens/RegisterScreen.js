import React, { useState } from "react"
import { View, Text, TextInput, Button, Alert, StyleSheet, SafeAreaView } from "react-native"
import { supabase } from "../lib/supabase"

export default function RegisterScreen({ goLogin }) {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [role, setRole] = useState("aluno")
  const [carregando, setCarregando] = useState(false)

  const cadastrar = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos")
      return
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres")
      return
    }

    setCarregando(true)

    console.log("1. Tentando criar usuário:", email)

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
    })

    console.log("2. Resultado signUp:", JSON.stringify({ data, error }))

    if (error) {
      Alert.alert("Erro no cadastro", error.message)
      setCarregando(false)
      return
    }

    const user = data.user || data.session?.user

    console.log("3. User obtido:", JSON.stringify(user))

    if (!user) {
      Alert.alert("Erro", "Usuário não retornado. Confirme email desativado no Supabase.")
      setCarregando(false)
      return
    }

    console.log("4. Salvando perfil:", { id: user.id, nome: nome.trim(), role })

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, nome: nome.trim(), role: role })
      .select()

    console.log("5. Resultado upsert:", JSON.stringify({ profileData, profileError }))

    if (profileError) {
      Alert.alert("Erro ao salvar perfil", profileError.message)
      setCarregando(false)
      return
    }

    setCarregando(false)
    Alert.alert("Sucesso", "Conta criada com sucesso!", [
      { text: "OK", onPress: goLogin }
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>REGISTRO</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />
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
        placeholder="Senha (mínimo 6 caracteres)"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
      />

      <Text style={styles.label}>Perfil: <Text style={styles.roleTexto}>{role}</Text></Text>
      <View style={styles.roleContainer}>
        <View style={styles.botao}>
          <Button title="Aluno" onPress={() => setRole("aluno")} />
        </View>
        <View style={styles.botao}>
          <Button title="Professor" onPress={() => setRole("professor")} />
        </View>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Button
          title={carregando ? "Cadastrando..." : "Cadastrar"}
          onPress={cadastrar}
          disabled={carregando}
        />
      </View>
      <Button title="Voltar para login" onPress={goLogin} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 12, fontSize: 16 },
  label: { fontSize: 15, marginBottom: 8 },
  roleTexto: { fontWeight: "bold" },
  roleContainer: { flexDirection: "row", marginBottom: 16 },
  botao: { flex: 1, marginHorizontal: 4 },
})