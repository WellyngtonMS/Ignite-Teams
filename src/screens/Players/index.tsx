import { useState, useEffect, useRef } from 'react';
import { Alert, FlatList, TextInput, Platform, KeyboardAvoidingView, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';

import { Header } from '@components/Header';
import { ButtonIcon } from '@components/ButtonIcon';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { Container, Form, HeaderList, NumberOfPlayers } from './styles';

import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { AppError } from '@utils/AppError';
import { playerGetByGroupAndTeam } from '@storage/player/playerGetByGroupAndTeam';
import { PlayerStorageDTO } from '@storage/player/playerStorageDTO';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';

type RouteParams = {
  group: string;
}

export const Players = () => {
  const { COLORS } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Nova Pessoa', 'Informe o nome da pessoa para adicionar.');
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }

    try {
      await playerAddByGroup(newPlayer, group);
      newPlayerNameInputRef.current?.blur();
      setNewPlayerName('');
      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova Pessoa', error.message);
      } else {
        Alert.alert('Nova Pessoa', 'Não foi possível adicionar a pessoa.');
        console.log(error);
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      const playersByTeam = await playerGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      console.log(error);
      Alert.alert('Remover Pessoa', 'Não foi possível remover a pessoa selecionado.');
    }
  }

  async function handleGroupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');
    } catch (error) {
      console.log(error);
      Alert.alert('Remover Turma', 'Não foi possível remover o grupo.');
    }
  }
  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container>
        <Header showBackButton />
        <Highlight
          title={group}
          subtitle='Adicione a galera e separe os times'
        />
        <Form>
          <Input
            inputRef={newPlayerNameInputRef}
            placeholder='Nome da pessoa'
            autoCorrect={false}
            onChangeText={setNewPlayerName}
            value={newPlayerName}
            onSubmitEditing={handleAddPlayer}
            returnKeyType='done'
          />
          <ButtonIcon icon='add' onPress={handleAddPlayer} style={{ position: 'absolute', right: 0 }} />
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
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => {
                Alert.alert('Remover Pessoa', `Deseja remover a pessoa ${item.name}?`, [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Remover', onPress: () => handlePlayerRemove(item.name), style: 'destructive' },
                ]);
              }}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty
              message='Não há pessoas neste time'
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 70 },
            players.length === 0 && { flex: 1 }
          ]}
          refreshControl={
            <RefreshControl
              colors={[COLORS.GREEN_500]}
              tintColor={COLORS.GREEN_500}
              refreshing={isLoading}
              onRefresh={fetchPlayersByTeam}
            />
          }
        />
        <Button
          title='Remover Turma'
          type='SECONDARY'
          onPress={() => {
            Alert.alert('Remover Turma', `Deseja remover a turma ${group}?`, [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Remover', onPress: () => handleGroupRemove(), style: 'destructive' },
            ]);
          }}
        />
      </Container>
    </KeyboardAvoidingView>
  );
};