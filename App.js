import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';
import { NavigationContainer } from '@react-navigation/native';
import Screens from './navigation/Screens';
import { Images, articles, nowTheme } from './constants';

const App = () => {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  const assetImages = [
    Images.Onboarding,
    Images.Logo,
    // Other Images...
  ];

  articles.map((article) => assetImages.push(article.image));

  const cacheImages = async (images) => {
    const tasks = images.map(async (image) => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
    return Promise.all(tasks);
  };

  useEffect(() => {
    const loadResourcesAsync = async () => {
      await SplashScreen.preventAutoHideAsync();
      await Font.loadAsync({
        'montserrat-regular': require('./assets/font/Montserrat-Regular.ttf'),
        'montserrat-bold': require('./assets/font/Montserrat-Bold.ttf'),
      });
      setFontLoaded(true);
      await SplashScreen.hideAsync();
      setIsLoadingComplete(true);
      await cacheImages(assetImages);
    };

    loadResourcesAsync();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NavigationContainer>
        <GalioProvider theme={nowTheme}>
          <Block flex>
            <Screens />
          </Block>
        </GalioProvider>
      </NavigationContainer>
    );
  }
};

export default App;
