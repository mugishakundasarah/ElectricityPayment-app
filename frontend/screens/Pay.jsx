import { View,Text, ScrollView,SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import colors from '../utils/colors'
import { useState } from 'react'
import axios from 'axios'
import { BaseUrl } from '../utils/BaseUrl'
import { ShowToast } from '../components/Toast'

// for User input amount and meter number
const Pay = ({navigation}) => {
    const [loading, setLoading] = useState(false)
    const [viewLoading, setViewLoading] = useState(false)
    // variable for storing bought token
    const [tokenData, setTokenData] = useState(null)
    // variable for storing tokens requested for  view
    const [tokens, setTokens] = useState([])

    // validate meter number and amount
    // amount maximum is 182500 because that's the utmost amount for 5 years which the token will expire
    const validationSchema = Yup.object().shape({
        amount: Yup.number()
          .typeError('Money must be a valid number')
          .required('Money is required')
          .min(100, 'Minimum amount is 100')
          .max(182500, 'Maximum amount is 182500'),
        meterNumber: Yup.
            string()
            .matches(/^\d{6}$/, 'Meter number must be exactly 6 digits')
            .required("Meter number is required")
      });

    const viewtokenValidationSchema = Yup.object().shape({
        meterNumber: Yup.
            string()
            .matches(/^\d{6}$/, 'Meter number must be exactly 6 digits')
            .required("Meter number is required")
            
    })


    const formik = useFormik({
        initialValues: {
            amount: '',
            meterNumber: '',
          },
        validationSchema,
        onSubmit: async (values, {resetForm, setStatus}) => {
            if (!values || !validationSchema.isValidSync(values)) {
                ShowToast("Error: Please fill all fields")
                return;
            }
            try {
                setLoading(true)
                let res = await axios.post(`${BaseUrl}/pay`, values)
                if(res.status == 201){
                    ShowToast(res.data.message)
                    setTokenData(res.data.data)
                    resetForm()
                    setLoading(false)
                }else{
                    setLoading(false)
                    console.log(res.data)
                    ShowToast(res.data.message)
                }
            } catch (error) {
                setLoading(false) 
                console.log(error)
                console.log(error.response.data)
                ShowToast(error.response.data.error || error.message)
            }
        }
    })

    const viewTokenFormik = useFormik({
        initialValues: {
            meterNumber: '',
          },
        validationSchema: viewtokenValidationSchema,
        onSubmit: async (values, {resetForm, setStatus}) => {
            if (!values || !viewtokenValidationSchema.isValidSync(values)) {
                ShowToast("First enter meter number")
                return;
            }
            try {
                setViewLoading(true)
                let res = await axios.get(`${BaseUrl}/tokens/${values.meterNumber}`)
                if(res.status == 200){
                    if(res.data.data.length == 0){
                        ShowToast("No token found for this meter number")
                        setViewLoading(false)
                    }else{
                        setTokens(res.data.data)
                        setViewLoading(false)
                        navigation.navigate("Tokens", {tokens: res.data.data})
                    }
                }else{
                    setViewLoading(false)
                    console.log(res.data)
                    ShowToast("Error " + res.data.data.message)
                }
            } catch (error) {
                console.log(error.response.data)
                ShowToast(error.response.data.error || error.message)
                setViewLoading(false)
            }
        }
    })
    return (
        <ScrollView>
            <SafeAreaView>
            <View style={styles.form}>
                {/* Welcome message */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>Welcome to E-Pay</Text>
                </View>
    
                <View style={{marginTop: 30}}>
                    {/* view tokens of mater form */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={viewTokenFormik.values.meterNumber}
                                onChangeText={viewTokenFormik.handleChange('meterNumber')}
                                placeholder='Meter Number'
                                onBlur={viewTokenFormik.handleBlur('meterNumber')}
                                autoCapitalize='none'
                            />
                            {viewTokenFormik.touched.meterNumber && viewTokenFormik.errors.meterNumber && (
                              <Text style={styles.error}>{viewTokenFormik.errors.meterNumber}</Text>
                            )}
                        </View>
                        <TouchableOpacity style={styles.button} onPress={() => viewTokenFormik.handleSubmit()} disabled={loading}>
                            {viewLoading ? (
                              <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text style={styles.buttonText}>View Tokens</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* separator for view tokens form and buy token form */}
                    <View style={styles.horizontalContainer}>
                        <View style={styles.horizontalLine} />
                        <Text style={styles.or}>OR</Text>
                        <View style={styles.horizontalLine} />
                    </View>

                    {/* Buy tokens form */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <TextInput
                              placeholder="Amount"
                              style={styles.input}
                              onChangeText={formik.handleChange('amount')}
                              onBlur={formik.handleBlur('amount')}
                              value={formik.values.amount}
                            />
                            {formik.touched.amount && formik.errors.amount && (
                              <Text style={styles.error}>{formik.errors.amount}</Text>
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={formik.values.meterNumber}
                                onChangeText={formik.handleChange('meterNumber')}
                                placeholder='Meter Number'
                                onBlur={formik.handleBlur('meterNumber')}
                                autoCapitalize='none'
                            />
                            {formik.touched.meterNumber && formik.errors.meterNumber && (
                              <Text style={styles.error}>{formik.errors.meterNumber}</Text>
                            )}
                        </View>
                        <View>
                            <TouchableOpacity style={styles.button} onPress={formik.handleSubmit} disabled={loading}>
                                  {loading ? (
                                      <ActivityIndicator color="#ffffff" />
                                    ) : (
                                        <Text style={styles.buttonText}>Pay</Text>
                                    )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* display after buying for user validation of the token */}
            {tokenData && (
                <View style={{backgroundColor: colors.white, paddingVertical: 20, marginHorizontal: "7%", paddingHorizontal: 10, borderRadius: 10, marginTop: 20, marginBottom: 30}}>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <Text style={{color: colors.mainColor, fontWeight: "bold", fontSize: 20}}>{tokenData.token}</Text>
                        <TouchableOpacity style={{width: "20%", alignSelf: "flex-end"}} onPress={() => setTokenData(null)}>
                            <Text style={{color: colors.mainColor, fontWeight: "bold", fontSize: 16}}>CLEAR</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <View>
                            <View style={{display: "flex", flexDirection: "row"}}>
                                <Text style={{fontWeight: "bold", fontSize: 16, color: colors.darkerGray}}>Amount: </Text>
                                <Text style={{fontSize: 16, color: colors.darkerGray}}>{tokenData.amount}</Text>
                            </View>
                            <View style={{display: "flex", flexDirection: "row"}}>
                                <Text style={{fontWeight: "bold", fontSize: 16, color: colors.darkerGray}}>Meter Number: </Text>
                                <Text style={{fontSize: 16, color: colors.darkerGray}}>{tokenData.meter_number}</Text>
                            </View>
                            <View style={{display: "flex", flexDirection: "row"}}>
                                <Text style={{fontWeight: "bold", fontSize: 16, color: colors.darkerGray}}>Days : </Text>
                                <Text style={{fontSize: 16, color: colors.darkerGray}}>{tokenData.token_value_days}</Text>
                            </View>
                            <View style={{display: "flex", flexDirection: "row"}}>
                                <Text style={{fontWeight: "bold", fontSize: 16, color: colors.darkerGray}}>Expires on : </Text>
                                <Text style={{fontSize: 16, color: colors.darkerGray}}>{tokenData.expiry_date.split("T")[0]}</Text>
                            </View>
                    </View>
                  </View>
                </View>
            )}
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    logo: {
        color: colors.mainColor,
        fontWeight: "bold",
        fontSize: 30,
        textAlign: 'center',
    },
    logoContainer: {
        marginTop: 40,
    },
    inputContainer: {
        marginBottom: 20,
    },  
    input: {
        borderColor: colors.darkGray,
        backgroundColor: colors.lightGray,
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: '500',
        wordWrap: 'break-word',
        borderRadius: 5,
        borderWidth: 1,
        padding: '3%',
    },
    form: {
        marginTop: 30,
        marginHorizontal: '5%',
    },
    button: {
        backgroundColor: colors.mainColor,
        padding: '4%',
        borderRadius: 40,
        marginTop: 40,
    },
    buttonText: {
        color: colors.white,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17,
    },
    error: {
        color: colors.red
    },
    or: {
        color: '#9098b2',
        textAlign: 'center',
        width: 50,
    },
    horizontalContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 30
    },
    horizontalLine: {
        borderBottomColor: '#9098b2',
        borderBottomWidth: 1,
        flex: 1,
        height: 1,
    },
})

export default Pay