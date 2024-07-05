import { useState, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import * as S from './styles';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';

import { groupGetAll } from '@storage/group/groupGetAll';

export function Groups() {
  const { COLORS } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<string[]>([]);
  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('newGroup');
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);
      const data = await groupGetAll();
      setGroups(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group });
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []));

  return (
    <S.Container>
      <Header />
      <Highlight
        title="Turmas"
        subtitle="Jogue com a sua turma"
      />
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <GroupCard
              title={item}
              onPress={() => handleOpenGroup(item)}
            />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => <ListEmpty message="Que tal cadastrar a sua primeira turma?" />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={[COLORS.GREEN_500]}
              tintColor={COLORS.GREEN_500}
              refreshing={isLoading}
              onRefresh={fetchGroups}
            />
          }
        />
      <Button
        title="Criar nova turma"
        onPress={handleNewGroup}
      />
    </S.Container>
  );
}
