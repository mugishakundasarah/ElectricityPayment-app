import Toast from 'react-native-simple-toast'

export const ShowToast = (message) => {
    console.log(message)
    Toast.showWithGravity(message, Toast.LONG, Toast.TOP, { fontSize: 24});
    return null;
}

