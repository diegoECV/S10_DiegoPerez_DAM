import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ReservaCitaScreen() {
  // Generar la fecha de hoy automáticamente (DD/MM/AAAA)
  const hoy = new Date();
  const fechaAutomatica = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [fecha, setFecha] = useState(fechaAutomatica); // Fecha automatizada
  const [motivo, setMotivo] = useState('');

  const [error, setError] = useState<string | null>(null);
  
  // Estado para guardar los datos de la cita una vez registrada y mostrarlos en el mensaje
  const [citaRegistrada, setCitaRegistrada] = useState<{nombre: string, fecha: string, motivo: string} | null>(null);

  const validarFormulario = () => {
    setError(null);
    setCitaRegistrada(null);

    // 1. Campos obligatorios
    if (nombre.trim() === '' || correo.trim() === '' || fecha.trim() === '' || motivo.trim() === '') {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // 2. Validación estricta del Nombre (solo letras y espacios)
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombreRegex.test(nombre.trim())) {
      setError('El nombre no es válido. No debe contener números ni caracteres especiales.');
      return;
    }

    // 3. Correo válido (con @)
    if (!correo.includes('@')) {
      setError('Ingresa un correo electrónico válido (debe contener "@").');
      return;
    }

    // 4. Validación estricta de la Fecha (formato DD/MM/AAAA solo números y barras)
    const fechaRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!fechaRegex.test(fecha.trim())) {
      setError('La fecha no es válida. Debe tener el formato DD/MM/AAAA (ej. 06/10/2026).');
      return;
    }

    // Guardar los datos para mostrarlos en el mensaje de éxito
    setCitaRegistrada({
      nombre: nombre.trim(),
      fecha: fecha.trim(),
      motivo: motivo.trim()
    });
    
    // Limpiar formulario (excepto la fecha que se mantiene automatizada)
    setNombre('');
    setCorreo('');
    setFecha(fechaAutomatica);
    setMotivo('');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-sharp" size={36} color="#000000" />
            </View>
            <Text style={styles.title}>Reserva tu Cita</Text>
            <Text style={styles.subtitle}>Completa tus datos a continuación</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            
            {/* Campo Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NOMBRE COMPLETO</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Juan Pérez"
                  placeholderTextColor="#9CA3AF"
                  value={nombre}
                  onChangeText={setNombre}
                />
              </View>
            </View>

            {/* Campo Correo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej. juan@correo.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={correo}
                  onChangeText={setCorreo}
                />
              </View>
            </View>

            {/* Campo Fecha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FECHA DESEADA</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#9CA3AF"
                  value={fecha}
                  onChangeText={setFecha}
                />
              </View>
            </View>

            {/* Campo Motivo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>MOTIVO DE LA CITA</Text>
              <View style={styles.inputContainerTextArea}>
                <Ionicons name="document-text-outline" size={18} color="#6B7280" style={[styles.inputIcon, { marginTop: 14 }]} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe brevemente..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  value={motivo}
                  onChangeText={setMotivo}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Feedback: Errores */}
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Feedback: Éxito (Estilo Detallado) */}
            {citaRegistrada && (
              <View style={styles.successDetailContainer}>
                <Text style={styles.successDetailTitle}>¡Cita reservada con éxito!</Text>
                <Text style={styles.successDetailText}>
                  {citaRegistrada.nombre}, tu cita quedó registrada para el {citaRegistrada.fecha}.
                </Text>
                <Text style={styles.successDetailText}>
                  Motivo: {citaRegistrada.motivo}
                </Text>
              </View>
            )}

            {/* Botón de Enviar */}
            <Pressable 
              style={({ pressed }) => [
                styles.buttonWrapper,
                pressed && styles.buttonPressed
              ]}
              onPress={validarFormulario}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Confirmar Reserva</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </View>
            </Pressable>
            
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center', // Centra en pantallas grandes (web)
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  iconContainer: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 450, // Limita el ancho en web
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputContainerTextArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    height: '100%',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
    paddingBottom: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  successDetailContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  successDetailTitle: {
    color: '#16A34A',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  successDetailText: {
    color: '#15803D', // Un verde un poco más oscuro para el texto normal
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  buttonWrapper: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
