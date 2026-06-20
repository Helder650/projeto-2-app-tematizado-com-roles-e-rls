import React from "react"
import { View, Text, Button } from "react-native"
import { supabase } from "../lib/supabase"

export default function ProfileScreen({ user, setUser }) {
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Nome: {user.name}</Text>
      <Text>Role: {user.role}</Text>

      <Button title="Sair" onPress={logout} />
    </View>
  )
}