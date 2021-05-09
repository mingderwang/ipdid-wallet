import React, { useState, useEffect } from 'react';
const apisauce = require('apisauce')
// define the api
const api = apisauce.create({
  baseURL: 'https://universal-resolver-driver-frankwang95174.vercel.app',
});

import {
  TouchableOpacity,
  TextInput,
  Text,
  StyleSheet,
  View,
  Image,
  Button,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [QRCodeValue, setQRCodeValue] = useState('Click "Scan DID" button');
  const [isOpenCamera, setIsOpenCamera] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setQRCodeValue(data);
    console.log('/1.0/identifiers/'+data)
    const getDIDDocument = () => {
      api
        .get('/1.0/identifiers/'+data)
        .then((res) => {
          // Unfortunately, fetch doesn't send (404 error)
          // into the cache itself
          // You have to send it, as I have done below
          if (res.status >= 400) {
            throw new Error('Server responds with erro!');
          }
          console.log(res)
          setQRCodeValue('DID resolving... 🏄🏽‍♂️ 🏄🏽‍♂️ 🏄🏽‍♂️')
          return res;
        })
        .then(
          (doc) => {
            console.log(doc.status)
            setQRCodeValue('')
            if (doc.status === 200) {
              let isVC= doc.data.didDocument.credentialSubject
              if (isVC) {
                console.log(isVC.alumniOf);
                setQRCodeValue('Alumni Of '+isVC.alumniOf);
              } else {
                let did = doc.data.did
                console.log(did + '🧘🏻‍♀️🧘🏻‍♀️🧘🏻‍♀️')
                console.log('Your IPDID is: '+ did)
                setQRCodeValue('YourDID is: '+ did);
              }
            }
          },
           // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components
          (err) => {
            console.log(err)
            setQRCodeValue('🔥 Sorry, this QR code is not a DID');
          }
        )
    }
    getDIDDocument()
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const openCamera = (isOpen)=>{
    setIsOpenCamera(isOpen);
  }

  return (
    <View style={styles.newcontactView}>
      <View
        pointerEvents="box-none"
        style={{
          height: 411,
        }}>
        <View style={styles.headerView}>
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
            }}>
            <Image
              source={require('./assets/header.png')}
              style={styles.bitmapImage}
            />
          </View>
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              left: 18,
              right: 93,
              top: 31,
              height: 75,
            }}></View>
        </View>
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: -10,
            right: 0,
            top: 60,
            height: 491,
          }}>
          <TouchableOpacity
            onPress={this.onReturnPressed}
            style={styles.returnButton}
          />
          <Image
            source={require('./assets/zoneQR.png')}
            style={styles.zoneqrImage}
          />
        </View>
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 20,
            right: 22,
            top: 164,
            height: 235,
          }}>
          {isOpenCamera && (
            <View style={styles.container}>
          
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            
          </View>
          )}
          <TextInput
            autoCorrect={false}
            style={styles.rectangle7TextInput}
            value={QRCodeValue}
          />
        </View>
      </View>
      <View
        pointerEvents="box-none"
        style={{
          height: 57,
          marginLeft: 12,
          marginRight: 11,
          marginTop: 40,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}>
        <TouchableOpacity
          onPress={() => openCamera(!isOpenCamera)}
          style={styles.addtoButton}>
          <Text style={styles.addtoButtonText}>{isOpenCamera?"Stop ":""}Scan DID</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (isOpenCamera) {
              setScanned(false);
              setQRCodeValue('Ponit Camera to a DID QR Code')}
             }}
          style={styles.getcodeButton}>
          <Text style={styles.getcodeButtonText}>{isOpenCamera?"Rescan":"My DID"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  newcontactView: {
    backgroundColor: 'white',
    flex: 1,
  },
  headerView: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 142,
  },
  bitmapImage: {
    backgroundColor: 'transparent',
    resizeMode: 'stretch',
    height: 100,
    width:330,
    marginRight: 2,
  },
  newContactText: {
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: 'Skia-Regular_Bold',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 106,
    marginRight: 29,
  },
  scanQrOrPastCodeText: {
    color: 'white',
    fontSize: 27,
    fontStyle: 'normal',
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginTop: 16,
  },
  returnButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    height: 47,
    marginRight: 317,
  },

  zoneqrImage: {
    resizeMode: 'stretch',
    backgroundColor: 'transparent',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowRadius: 5,
    shadowOpacity: 1,
    height: 293,
    marginLeft: 12,
    marginTop: 51,
  },
  bitmapTwoImage: {
    resizeMode: 'center',
    backgroundColor: 'transparent',
    height: 155,
    marginLeft: 92,
    marginRight: 92,
  },
  rectangle7TextInput: {
    backgroundColor: 'transparent',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(151, 151, 151, 0.4)',
    borderStyle: 'solid',
    padding: 0,
    color: 'black',
    fontFamily: '.SFNSText',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
    height: 62,
    marginTop: 18,
  },
  addtoButton: {
    backgroundColor: 'rgb(100, 209, 117)',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flex: 1,
    height: 57,
    marginRight: 32,
  },

  addtoButtonText: {
    color: 'white',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  getcodeButtonText: {
    color: 'white',
    fontFamily: 'ArialMT',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  getcodeButton: {
    backgroundColor: 'rgb(249, 46, 48)',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flex: 1,
    height: 57,
    marginLeft: 32,
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  }
})
