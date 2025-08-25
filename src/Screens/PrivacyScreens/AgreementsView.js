import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import colors from '../../styles/colors';
import HeaderAuth from '../../Components/HeaderAuth/HeaderAuth';

const AgreementsView = () => {

    const routeData = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const urls = [
        "https://www.foodosti.com/fd-delivery-privacy-policy/", 
        "https://www.foodosti.com/fd-delivery-agreements/", 
        "https://www.foodosti.com/fd-delivery-disclaimer/"
    ];
    const headings = ["Privacy Policy", "User Agreement", "Disclaimer"];
    const urlType = routeData?.params?.urlType;

    // Validate urlType
    if (urlType == undefined || urlType < 0 || urlType >= urls.length) {
        return (
            <View style={styles.container}>
                <HeaderAuth navigation={navigation} label="Invalid Page" />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Invalid page requested</Text>
                </View>
            </View>
        );
    }

    const handleLoadEnd = () => {
        setLoading(false);
    };

    const handleError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        setError(nativeEvent?.description || "Something went wrong");
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <HeaderAuth navigation={navigation} label={headings[urlType]} />
            
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.theme} />
                </View>
            )}
            
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Failed to load page:</Text>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <WebView 
                    source={{ uri: urls[urlType] }} 
                    style={styles.webview}
                    onLoadEnd={handleLoadEnd}
                    onError={handleError}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={colors.theme} />
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

export default AgreementsView;