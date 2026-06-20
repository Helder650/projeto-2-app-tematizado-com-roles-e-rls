import React, { useEffect, useState } from "react"
import { View, Text, FlatList, Button, Alert, TextInput, StyleSheet, SafeAreaView, Modal } from "react-native"
import { supabase } from "../lib/supabase"

export default function ProfessorScreen({ usuario, onLogout }) {
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisivel, setModalVisivel] = useState(false)
  const [alunoSelecionado, setAlunoSelecionado] = useState(null)
  const [materia, setMateria] = useState("")
  const [nota, setNota] = useState("")
  const [salvando, setSalvando] = useState(false)

  const carregarAlunos = async () => {
    setLoading(true)
const { data, error } = await supabase
  .from("profiles")
  .select("*")

if (error) { Alert.alert("Erro", error.message); setLoading(false); return }

console.log("TODOS OS PERFIS:", JSON.stringify(data)) // veja o console

const listaAlunos = (data || []).filter(u => u.role === "aluno")
setAlunos(listaAlunos)

    if (error) { Alert.alert("Erro", error.message); setLoading(false); return }
    setAlunos(data || [])
    setLoading(false)
  }

  const abrirModal = (aluno) => {
    if (!aluno?.id) { Alert.alert("Erro", "Aluno inválido"); return }
    setAlunoSelecionado(aluno)
    setMateria("")
    setNota("")
    setModalVisivel(true)
  }

  const darNota = async () => {
    if (!materia || !nota) { Alert.alert("Erro", "Preencha a matéria e a nota"); return }

    const notaNum = parseFloat(nota.replace(",", "."))
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
      Alert.alert("Erro", "A nota deve ser um número entre 0 e 10")
      return
    }

    setSalvando(true)
    const { error } = await supabase.from("notas").insert([{
      aluno_id: alunoSelecionado.id,
      materia: materia.trim(),
      nota: notaNum,
    }])
    setSalvando(false)

    if (error) { Alert.alert("Erro ao salvar nota", error.message); return }

    setModalVisivel(false)
    Alert.alert("Sucesso", `Nota ${notaNum} lançada para ${alunoSelecionado.nome}!`)
  }

  useEffect(() => { carregarAlunos() }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Prof. {usuario?.nome || "Professor"}</Text>

      {loading ? (
        <Text style={styles.info}>Carregando alunos...</Text>
      ) : (
        <FlatList
          data={alunos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.alunoItem}>
              <Text style={styles.alunoNome}>{item.nome || "Sem nome"}</Text>
              <Button title="Dar nota" onPress={() => abrirModal(item)} />
            </View>
          )}
          ListEmptyComponent={<Text style={styles.info}>Nenhum aluno cadastrado.</Text>}
        />
      )}

      <View style={styles.botaoSair}>
        <Button title="Sair" color="#e53935" onPress={onLogout} />
      </View>

      <Modal visible={modalVisivel} transparent animationType="slide" onRequestClose={() => setModalVisivel(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Nota para {alunoSelecionado?.nome}</Text>
            <TextInput style={styles.input} placeholder="Matéria (ex: Matemática)" value={materia} onChangeText={setMateria} />
            <TextInput style={styles.input} placeholder="Nota (0 a 10)" value={nota} onChangeText={setNota} keyboardType="decimal-pad" />
            <View style={styles.modalBotoes}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Button title="Cancelar" color="#888" onPress={() => setModalVisivel(false)} />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Button title={salvando ? "Salvando..." : "Confirmar"} onPress={darNota} disabled={salvando} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  info: { color: "#888", textAlign: "center", marginTop: 20 },
  alunoItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f5f5f5", padding: 12, borderRadius: 8, marginBottom: 8 },
  alunoNome: { fontSize: 16, flex: 1, marginRight: 10 },
  botaoSair: { marginTop: 20 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#fff", borderRadius: 12, padding: 24, width: "85%" },
  modalTitulo: { fontSize: 17, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 12, fontSize: 16 },
  modalBotoes: { flexDirection: "row", marginTop: 4 },
})