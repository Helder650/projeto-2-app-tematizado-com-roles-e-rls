import React, { useEffect, useState } from "react"
import { View, Text, FlatList, Button, StyleSheet, SafeAreaView, Alert } from "react-native"
import { supabase } from "../lib/supabase"

export default function AlunoScreen({ usuario, onLogout }) {
  const [notas, setNotas] = useState([])
  const [loading, setLoading] = useState(true)

  const carregarNotas = async () => {
    if (!usuario?.id) { setLoading(false); return }

    setLoading(true)
    const { data, error } = await supabase
      .from("notas")
      .select("*")
      .eq("aluno_id", usuario.id)

    if (error) Alert.alert("Erro", error.message)
    else setNotas(data || [])

    setLoading(false)
  }

  useEffect(() => { carregarNotas() }, [usuario])

  const media = notas.length > 0
    ? (notas.reduce((acc, n) => acc + Number(n.nota), 0) / notas.length).toFixed(1)
    : null

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Olá, {usuario?.nome || "Aluno"}!</Text>

      {media !== null && (
        <Text style={styles.media}>Média geral: {media}</Text>
      )}

      {loading ? (
        <Text style={styles.info}>Carregando notas...</Text>
      ) : (
        <FlatList
          data={notas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.notaItem}>
              <Text style={styles.materia}>{item.materia}</Text>
              <Text style={styles.nota}>{item.nota}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.info}>Sem notas ainda.</Text>}
        />
      )}

      <View style={styles.botaoSair}>
        <Button title="Sair" color="#e53935" onPress={onLogout} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  media: { fontSize: 15, fontWeight: "600", backgroundColor: "#e3f2fd", padding: 8, borderRadius: 6, marginBottom: 12, textAlign: "center" },
  info: { color: "#888", textAlign: "center", marginTop: 20 },
  notaItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 8 },
  materia: { fontSize: 16, flex: 1 },
  nota: { fontSize: 18, fontWeight: "bold", color: "#1976D2" },
  botaoSair: { marginTop: 20 },
})