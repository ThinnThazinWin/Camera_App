import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, SafeAreaView,Image } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  let camera = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);
  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return  <Text>Permission for camera not granted. Please change this in settings </Text>
     
 }

  {/*let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };*/}
    {/*
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    const asset=await MediaLibrary.createAssetAsync(newPhoto);
    MediaLibrary.createAlbumAsync('Expo',asset).then(()=>{
      console.log('Album created');
      setPhoto(asset);
    })
  */}

   let takePic = async () => {
      let options = {
        quality: 1,
        base64: true,
        exif: false
      };
      const { uri } = await camera.current.takePictureAsync(options);
      const asset = await MediaLibrary.createAssetAsync(uri);
      MediaLibrary.createAlbumAsync('Expo', asset)
        .then(() => {
          setPhoto(asset);
          console.log('Album created!');
        })
        .catch(error => {
          console.log('err', error);
        });
    }

   
    
  
  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };
    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
      console.log("image saved");
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={camera}>
      <View style={styles.buttonContainer}>
        <Button title="Take pic" onPress={takePic} />
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "white",
    alignSelf: "flex-end",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
