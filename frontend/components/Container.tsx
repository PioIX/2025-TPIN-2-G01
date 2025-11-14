import { SafeAreaProvider } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaProvider className={styles.container}>{children}</SafeAreaProvider>;
};

const styles = {
  container: 'flex flex-1 m-6',
};
