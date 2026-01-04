import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        // Navigate to tabs after a brief moment
        const timer = setTimeout(() => {
            router.replace('/(tabs)');
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#007AFF" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});