import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollView: {
        paddingVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    gaugeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    gaugeText: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
});