import { useNavigation } from '@react-navigation/native';
import { Container, Content, Icon } from './styles';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Button } from '@components/Button';
import { Input } from '@components/Input';

export function NewGroup() {
  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('players', { group: 'nova' });
  }

  return (
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
        />
        <Button
          title='Criar'
          style={{ marginTop: 20 }}
          onPress={handleNewGroup}
          />
      </Content>
    </Container>
  );
}