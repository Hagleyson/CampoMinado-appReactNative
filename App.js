import React, {useEffect, useState} from 'react';

import {SafeAreaView, StyleSheet, Text, View, Alert} from 'react-native';
import params from './src/params';
import Header from './src/components/Header';
import MineField from './src/components/MineField';
import {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  inverFlag,
  flagsUsed,
} from './src/functions';
import LevelSelection from './src/screens/LevelSelection';
export default App = () => {
  const createState = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return {
      board: createMinedBoard(rows, cols, minesAmount()),
    };
  };
  const minesAmount = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return Math.ceil(cols * rows * params.difficultLevel);
  };

  const [board, setBoard] = useState(createState());
  const [showLevelSelection, setShowLevelSelection] = useState(false);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const onOpenField = (row, column) => {
    const boards = cloneBoard(board.board);
    openField(boards, row, column);
    const lost = hadExplosion(boards);
    const won = wonGame(boards);
    if (lost) {
      showMines(boards);
      Alert.alert('Você Perdeu!!!');
    }

    if (won) {
      Alert.alert('Parabéns!!! Você Ganhou!');
    }
    setBoard({board: boards});
    setLost(lost);
    setWon(won);
  };
  const onSelectField = (row, column) => {
    const boards = cloneBoard(board.board);

    inverFlag(boards, row, column);
    const won = wonGame(boards);
    if (won) {
      Alert.alert('Parabéns, Você venceu!');
    }
    setBoard({board: boards});
    setWon(won);
  };
  const onLevelSelected = level => {
    params.difficultLevel = level;
    setBoard(createState());
  };
  useEffect(() => {
    setBoard(createState());
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <LevelSelection
        isVisible={showLevelSelection}
        onLevelSelected={onLevelSelected}
        onCancel={() => setShowLevelSelection(false)}
      />
      <Header
        onNewGame={() => setBoard(createState)}
        flagsLeft={minesAmount() - flagsUsed(board.board)}
        onFlagPress={() => setShowLevelSelection(true)}
      />
      <View style={styles.board}>
        {board ? (
          <MineField
            board={board.board}
            onOpenField={onOpenField}
            onSelectField={onSelectField}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA',
  },
});
