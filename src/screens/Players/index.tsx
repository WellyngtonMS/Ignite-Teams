import { useState } from 'react';
import { FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { Header } from '@components/Header';
import { ButtonIcon } from '@components/ButtonIcon';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Container, Form, HeaderList, NumberOfPlayers } from './styles';
import { Button } from '@components/Button';

type RouteParams = {
  group: string;
}

export const Players = () => {
  const [team, setTeam] = useState('');
  const [players, setPlayers] = useState([]);

  const route = useRoute();
  const { group } = route.params as RouteParams;

  return (
    <Container>
      <Header showBackButton />
      <Highlight
        title={group}
        subtitle='Adicione a galera e separe os times'
      />
      <Form>
        <Input
          placeholder='Nome da pessoa'
          autoCorrect={false}
        />
        <ButtonIcon icon='add' />
      </Form>
      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={team === item}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
      </HeaderList>
      <FlatList
        data={players}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <PlayerCard
            name={item}
            onRemove={() => { }}
          />
        )}
        ListEmptyComponent={() => (
          <ListEmpty
            message='Não há jogadores neste time'
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 70 },
          players.length === 0 && { flex: 1 }
        ]}
      />
      <Button
        title='Remover Turma'
        type='SECONDARY'
      />
    </Container>
  );
};