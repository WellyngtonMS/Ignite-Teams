import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Container, Content, Icon } from './styles';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { groupCreate } from '@storage/group/groupCreate';
import { AppError } from '@utils/AppError';

export function NewGroup() {
  const [group, setGroup] = useState('');
  const navigation = useNavigation();

  async function handleNewGroup() {
    if (group.trim().length === 0) {
      return Alert.alert('Novo Grupo', 'Informe o nome da turma.');
    }
    
    try {
      await groupCreate(group);
      navigation.navigate('players', { group });
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo Grupo', error.message);
      } else {
        Alert.alert('Novo Grupo', 'Não foi possível criar o grupo.');
        console.log(error);
      }
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container>
        <Header showBackButton />

        <Content>
          <Icon />
          <Highlight
            title='Nova Turma'
            subtitle='Crie uma nova turma para adicionar membros.'
          />
          <Input 
            placeholder='Nome da turma'
            onChangeText={setGroup}
          />
          <Button
            title='Criar'
            style={{ marginTop: 20 }}
            onPress={handleNewGroup}
            />
        </Content>
      </Container>
    </KeyboardAvoidingView>
  );
}