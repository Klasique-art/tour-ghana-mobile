import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ONBOARDING_KEY = '@tour_ghana_onboarding_completed';

// Onboarding data
const onboardingData = [
    {
        id: 1,
        title: "Welcome to Cafa AI!",
        subtitle: "Your Intelligent Language Companion",
        description: "Meet Cafa AI, an advanced language models designed to understand, assist, and engage with you in meaningful conversations. Cafa AI is designed to help but may make mistakes.",
        gradient: ['#667eea', '#764ba2'] as const,
        icon: '🤖',
    },
    {
        id: 2,
        title: "Powered by Advanced AI",
        subtitle: "Natural Language Understanding",
        description: "Experience human-like conversations with our state-of-the-art language models. Our models are contextually savvy and know how to sift through nuances.",
        gradient: ['#f093fb', '#f5576c'] as const,
        icon: '🧠',
    },
    {
        id: 3,
        title: "Your AI Assistant",
        subtitle: "that’s readily available to help",
        description: "From creative writing to problem-solving, Cafa AI is here to assist you with a wide range of tasks and questions.",
        gradient: ['#00f2fe', '#4facfe'] as const,
        icon: '✨',
    },
    {
        id: 4,
        title: "Get Started",
        subtitle: "Begin Your AI Journey",
        description: "Ready to explore possibilities? Start your journey with Cafa AI and discover a world of possibilities.",
        gradient: ['#28e3c0ff', '#23c358ff'] as const,
        icon: '🚀',
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const translateX = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const currentSlide = onboardingData[currentIndex];

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            router.replace('/(tabs)');
        } catch (error) {
            console.log('Error saving onboarding status:', error);
            router.replace('/(tabs)');
        }
    };

    const goToNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            // Animate out current slide
            translateX.value = withTiming(-width, { duration: 300 });
            opacity.value = withTiming(0, { duration: 200 });

            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                translateX.value = width;
                opacity.value = 0;

                // Animate in new slide
                translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
                opacity.value = withTiming(1, { duration: 300 });
                scale.value = withSpring(1, { damping: 15, stiffness: 150 });
            }, 200);
        } else {
            completeOnboarding();
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            // Animate out current slide
            translateX.value = withTiming(width, { duration: 300 });
            opacity.value = withTiming(0, { duration: 200 });

            setTimeout(() => {
                setCurrentIndex(currentIndex - 1);
                translateX.value = -width;
                opacity.value = 0;

                // Animate in new slide
                translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
                opacity.value = withTiming(1, { duration: 300 });
                scale.value = withSpring(1, { damping: 15, stiffness: 150 });
            }, 200);
        }
    };

    const skipOnboarding = () => {
        completeOnboarding();
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { scale: scale.value },
            ],
            opacity: opacity.value,
        };
    });

    const dotAnimatedStyle = (index: number) => {
        return useAnimatedStyle(() => {
            const isActive = index === currentIndex;
            return {
                width: withSpring(isActive ? 24 : 8, { damping: 15, stiffness: 150 }),
                backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
            };
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <LinearGradient
                colors={currentSlide.gradient}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Skip Button */}
                <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                {/* Main Content */}
                <Animated.View style={[styles.content, animatedStyle]}>
                    {/* Icon */}
                    <Animated.View style={styles.iconContainer}>
                        <Text style={styles.icon}>{currentSlide.icon}</Text>
                    </Animated.View>

                    {/* Text Content */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{currentSlide.title}</Text>
                        <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
                        <Text style={styles.description}>{currentSlide.description}</Text>
                    </View>
                </Animated.View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* Dots Indicator */}
                    <View style={styles.dotsContainer}>
                        {onboardingData.map((_, index) => (
                            <Animated.View
                                key={index}
                                style={[styles.dot, dotAnimatedStyle(index)]}
                            />
                        ))}
                    </View>

                    {/* Navigation Buttons */}
                    <View style={styles.navigationContainer}>
                        <TouchableOpacity
                            style={[styles.navButton, { opacity: currentIndex === 0 ? 0.3 : 1 }]}
                            onPress={goToPrevious}
                            disabled={currentIndex === 0}
                        >
                            <Text style={styles.navButtonText}>Previous</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.nextButton} onPress={goToNext}>
                            <Text style={styles.nextButtonText}>
                                {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 44,
    },
    skipButton: {
        position: 'absolute',
        top: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 64,
        right: 20,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "black",
        borderRadius: 20,
    },
    skipText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    icon: {
        fontSize: 50,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
    },
    bottomSection: {
        paddingHorizontal: 40,
        paddingBottom: 50,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    navButtonText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        fontWeight: '500',
    },
    nextButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    nextButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});