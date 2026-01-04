import React, { useRef, useState, useCallback } from 'react';
import {
    StatusBar,
    Platform,
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
const WEB_APP_URL = 'https://tourghana.com';

const App = (): React.JSX.Element => {
    const webViewRef = useRef<WebView>(null);
    const [webViewKey, setWebViewKey] = useState(0);

    // Handle iOS WebView process termination
    const handleContentProcessDidTerminate = useCallback(() => {
        console.warn('⚠️ WebView content process terminated, reloading...');
        // Force reload by changing key
        setWebViewKey(prevKey => prevKey + 1);
    }, []);


    return (
        <SafeAreaView
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            <WebView
                key={webViewKey}
                ref={webViewRef}
                source={{ uri: WEB_APP_URL }}
                style={styles.webview}
                domStorageEnabled={true}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#667eea" />
                    </View>
                )}
                bounces={false}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                mixedContentMode="compatibility"
                thirdPartyCookiesEnabled={true}
                sharedCookiesEnabled={true}
                cacheEnabled={true}
                mediaPlaybackRequiresUserAction={false}
                onContentProcessDidTerminate={handleContentProcessDidTerminate}
                allowsInlineMediaPlayback={true}
                androidLayerType="hardware"
                allowFileAccess={true}
                allowsFullscreenVideo={true}
                {...(Platform.OS === 'ios' && {
                    allowsBackForwardNavigationGestures: true,
                    automaticallyAdjustContentInsets: false,
                    contentInsetAdjustmentBehavior: 'never',
                    decelerationRate: 'normal',
                })}
                onShouldStartLoadWithRequest={() => true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});

export default App;