import { SafeAreaView, View, Text, ScrollView } from "react-native"
import colors from "../utils/colors"

const Tokens = ({route}) => {
    const { tokens } = route.params 
    return (
        <ScrollView>

        <SafeAreaView>
            {tokens.map(token => {
                return (
                    <View style={{backgroundColor: colors.white, paddingVertical: 20, marginHorizontal: "3%", paddingHorizontal: 10, borderRadius: 10, marginVertical: 10}}>
                        <Text style={{color: colors.mainColor, fontWeight: "bold", fontSize: 20}}>{token.token}</Text>
                        <View style={{marginTop: 10, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            <View>
                                <View style={{display: "flex", flexDirection: "row"}}>
                                    <Text style={{fontWeight: "bold", fontSize: 16, color: colors.darkerGray}}>Amount: </Text>
                                    <Text style={{fontSize: 16, color: colors.darkerGray}}>{token.amount}</Text>
                                </View>
                                <View style={{display: "flex", flexDirection: "row"}}>
                                    <Text style={{fontWeight: "bold", fontSize: 16, color: colors.darkerGray}}>Meter Number: </Text>
                                    <Text style={{fontSize: 16, color: colors.darkerGray}}>{token.meter_number}</Text>
                                </View>
                                <View style={{display: "flex", flexDirection: "row"}}>
                                        <Text style={{color: colors.darkerGray, fontSize: 16}}>
                                            {token.purchased_date.split("T")[0]}
                                            ----------------------------------------
                                            {token.expiry_date.split("T")[0]}
                                        </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            })}
        </SafeAreaView>
        </ScrollView>
    )
}   

export default Tokens   