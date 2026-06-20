import React, { useState, useEffect } from "react"
import { View, ActivityIndicator, StyleSheet, Text } from "react-native"
import { supabase } from "./src/lib/supabase"

import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import AlunoScreen from "./src/screens/AlunoScreen"
import ProfessorScreen from "./src/screens/ProfessorScreen"

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [tela, setTela] = useState("login")
  const [verificando, setVerificando] = useState(true)
  const [erroGeral, setErroGeral] = useState(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Verificando sessão...")

        const { data, error } = await supabase.auth.getUser()

        console.log("Sessão:", JSON.stringify({ data, error }))

        if (data?.user) {
          const { data: perfil, error: errPerfil } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single()

          console.log("Perfil sessão:", JSON.stringify({ perfil, errPerfil }))

          if (!errPerfil && perfil) {
            setUsuario(perfil)
            setTela(perfil.role)
          } else {
            setTela("login")
          }
        } else {
          setTela("login")
        }
      } catch (e) {
        console.log("ERRO checkSession:", e.message)
        setErroGeral(e.message)
        setTela("login")
      } finally {
        setVerificando(false)
      }
    }

    checkSession()
  }, [])

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.log("Erro logout:", e.message)
    }
    setUsuario(null)
    setTela("login")
  }

  const handleLogin = (perfil) => {
    console.log("handleLogin chamado com:", JSON.stringify(perfil))
    if (!perfil) {
      console.log("ERRO: perfil nulo no handleLogin")
      return
    }
    setUsuario(perfil)
    setTela(perfil.role)
  }

  if (verificando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10 }}>Carregando...</Text>
      </View>
    )
  }

  if (erroGeral) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: "red", textAlign: "center", padding: 20 }}>
          Erro: {erroGeral}
        </Text>
      </View>
    )
  }

  console.log("Renderizando tela:", tela, "| usuario:", JSON.stringify(usuario))

  if (tela === "login") {
    return (
      <LoginScreen
        goRegister={() => setTela("register")}
        onLogin={handleLogin}
      />
    )
  }

  if (tela === "register") {
    return <RegisterScreen goLogin={() => setTela("login")} />
  }

  if (tela === "aluno") {
    if (!usuario) {
      console.log("ERRO: tela aluno mas usuario é null")
      return <LoginScreen goRegister={() => setTela("register")} onLogin={handleLogin} />
    }
    return <AlunoScreen usuario={usuario} onLogout={logout} />
  }

  if (tela === "professor") {
    if (!usuario) {
      console.log("ERRO: tela professor mas usuario é null")
      return <LoginScreen goRegister={() => setTela("register")} onLogin={handleLogin} />
    }
    return <ProfessorScreen usuario={usuario} onLogout={logout} />
  }

  // Fallback
  console.log("TELA DESCONHECIDA:", tela)
  return (
    <LoginScreen
      goRegister={() => setTela("register")}
      onLogin={handleLogin}
    />
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})