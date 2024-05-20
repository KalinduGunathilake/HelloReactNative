import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
} from "react-native";
import * as Battery from "expo-battery";
import * as Location from "expo-location";
// import navigateIcon from "../assets/navigate.png";
const navigateIcon = require("../assets/navigate.png");

const OPENWEATHER_API_KEY = "d5c484d2d349a8f4d364b856819fec6b";

const weatherIcons = {
    // '01d': require('./assets/01d.png'),
    // '01n': require('./assets/01n.png'),
    // '02d': require('./assets/02d.png'),
    // '02n': require('./assets/02n.png'),
    // '03d': require('./assets/03d.png'),
    // '03n': require('./assets/03n.png'),
    // '04d': require('./assets/04d.png'),
    "04n": require("../assets/04n.png"),
    // '09d': require('./assets/09d.png'),
    // '09n': require('./assets/09n.png'),
    // '10d': require('./assets/10d.png'),
    "10n": require("../assets/10n.png"),
    // '11d': require('./assets/11d.png'),
    // '11n': require('./assets/11n.png'),
    // '13d': require('./assets/13d.png'),
    // '13n': require('./assets/13n.png'),
    // '50d': require('./assets/50d.png'),
    // '50n': require('./assets/50n.png'),
};

const Details = () => {
    const [batteryLevel, setBatteryLevel] = useState(null);
    const [chargingStatus, setChargingStatus] = useState(null);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [weather, setWeather] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [dateInfo, setDateInfo] = useState({
        day: "",
        date: "",
        month: "",
        year: "",
    });

    // useEffect(() => {
    //   // Function to get battery level
    //   const getBatteryLevel = async () => {
    //     const level = await Battery.getBatteryLevelAsync();
    //     setBatteryLevel((level * 100).toFixed(0)); // Convert to percentage and fix to 0 decimal places
    //   };

    //   // Function to get charging status
    //   const getChargingStatus = async () => {
    //     const status = await Battery.getBatteryStateAsync();
    //     setChargingStatus(
    //       status === Battery.BatteryState.CHARGING ? 'Charging' : 'Not Charging'
    //     );
    //   };

    //   getBatteryLevel();
    //   getChargingStatus();

    //   // Set up listeners for battery level and charging state changes
    //   const batteryLevelListener = Battery.addBatteryLevelListener(({ batteryLevel }) => {
    //     setBatteryLevel((batteryLevel * 100).toFixed(0));
    //   });

    //   const batteryStateListener = Battery.addBatteryStateListener(({ batteryState }) => {
    //     setChargingStatus(
    //       batteryState === Battery.BatteryState.CHARGING ? 'Charging' : 'Not Charging'
    //     );
    //   });

    //   // Clean up listeners on component unmount
    //   return () => {
    //     batteryLevelListener.remove();
    //     batteryStateListener.remove();
    //   };
    // }, []);

    useEffect(() => {
        const getBatteryLevel = async () => {
            const level = await Battery.getBatteryLevelAsync();
            setBatteryLevel((level * 100).toFixed(0)); // Convert to percentage and fix to 0 decimal places
        };

        const getChargingStatus = async () => {
            const status = await Battery.getBatteryStateAsync();
            setChargingStatus(
                status === Battery.BatteryState.CHARGING
                    ? "Charging"
                    : "Not Charging"
            );
        };

        getBatteryLevel();
        getChargingStatus();

        // Set up listeners for battery level and charging state changes
        const batteryLevelListener = Battery.addBatteryLevelListener(
            (event) => {
                setBatteryLevel((event.batteryLevel * 100).toFixed(0));
            }
        );

        const batteryStateListener = Battery.addBatteryStateListener(
            (event) => {
                setChargingStatus(
                    event.batteryState === Battery.BatteryState.CHARGING
                        ? "Charging"
                        : "Not Charging"
                );
            }
        );

        // Clean up listeners on component unmount
        return () => {
            batteryLevelListener.remove();
            batteryStateListener.remove();
        };
    }, []);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log(status);
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            // console.log(location)
            console.log("latitude" + location.coords.latitude);
            console.log("longitude" + location.coords.longitude);
            // setLocation(location);
              fetchWeather(location.coords.latitude, location.coords.longitude);
        })();
    }, []);

    const fetchWeather = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`
            );
            const data = await response.json();
            setWeather(data);
            console.log(data);
        } catch (error) {
            setErrorMsg("Failed to fetch weather data");
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            setDateInfo({
                day: now.toLocaleDateString("en-US", { weekday: "long" }),
                date: now.getDate(),
                month: now.toLocaleDateString("en-US", { month: "long" }),
                year: now.getFullYear(),
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        //     <SafeAreaView style={styles.container}>
        //       <View style={styles.infoContainer}>
        //         <Text style={styles.text}>Current Time: {currentTime.toLocaleTimeString()}</Text>
        //         {/* <Text style={styles.text}>Current Date: {currentTime.toLocaleDateString()}</Text> */}
        //         <Text style={styles.text}>Date: {dateInfo.date}</Text>
        //         <Text style={styles.text}>Day: {dateInfo.day}</Text>
        //         <Text style={styles.text}>Month: {dateInfo.month}</Text>
        //         <Text style={styles.text}>Year: {dateInfo.year}</Text>
        //         <Text style={styles.text}>Battery Level: {batteryLevel}%</Text>
        //         <Text style={styles.text}>Charging Status: {chargingStatus}</Text>

        //         {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
        //         {weather ? (
        //           <View style={styles.weatherContainer}>
        //             <Text style={styles.text}>Location: {weather.name}</Text>
        //             <Text style={styles.text}>Temperature: {weather.main.temp}°C</Text>
        //             <Text style={styles.text}>Weather: {weather.weather[0].description}</Text>
        //             <Image
        //               style={styles.weatherIcon}
        //               source={weatherIcons[weather.weather[0].icon]}
        //             />
        //           </View>
        //         ) : (
        //           <Text style={styles.text}>Fetching weather data...</Text>
        //         )}

        //       </View>
        //     </SafeAreaView>
        /* <View style={styles.infoContainer}>

                </View> */
        <SafeAreaView style={styles.container}>
            <StatusBar style={styles.statusBar} hidden={false} />

            <View style={styles.infoContainer}></View>
            <View style={styles.infoContainer}></View>
            {/* <View style={styles.box}>
                <Text style={styles.boxText}>This is a box with border</Text>
            </View> */}
            <View style={styles.mainGrid}>
                <View style={styles.dateGridItem}>
                    <View style={styles.dayMonthCont}>
                        <Text style={styles.dayText}>Mon</Text>
                        <Text style={styles.monthText}>May</Text>
                    </View>
                    <Text style={styles.dateText}>20</Text>
                </View>
                <View style={styles.weatherGridItem}>
                    <View style={styles.locationCont}>
                        <Text style={styles.locationText}>Panadura</Text>
                        <Image
                            style={styles.locationIcon}
                            source={navigateIcon}
                        />
                    </View>
                    <Text style={styles.tempText}>26°</Text>
                    <Text style={styles.feelTempText}>
                        Feels like 24°
                        <Image
                            style={styles.weatherIcon}
                            source={weatherIcons[weather.weather[0].icon]}
                        />
                    </Text>
                    <Text style={styles.weatherDescText}>Overcast Clouds</Text>
                    {/* <Text style={styles.gridText}>Grid Item 2</Text> */}
                </View>
                {/* <View style={styles.gridItem}>
                    <Text style={styles.gridText}>Grid Item 3</Text>
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.gridText}>Grid Item 4</Text>
                </View> */}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    statusbar: {
        backgroundColor: "#1c1c1c",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1c1c1c",
        height: "100%",
    },
    // infoContainer: {
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    // text: {
    //     fontSize: 18,
    //     marginVertical: 10,
    //     color: "white",
    // },
    // weatherContainer: {
    //     marginTop: 20,
    //     alignItems: "center",
    // },
    // weatherIcon: {
    //     width: 100,
    //     height: 100,
    //     marginTop: 10,
    // },
    // error: {
    //     color: "red",
    //     marginVertical: 10,
    // },
    infoContainer: {
        width: "100px",
        height: "100px",
        border: "1px solid white",
        justifyContent: "center",
        alignItems: "center",
    },
    box: {
        padding: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: "#fff",
    },
    boxText: {
        fontSize: 16,
    },
    mainGrid: {
        marginTop: "3%",
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        // flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    dateGridItem: {
        width: "90%",
        height: "45%",
        padding: 20,
        // borderWidth: 1,
        // borderColor: "#ccc",
        borderRadius: 10,
        // marginBottom: 20,
        backgroundColor: "#2E2E2E",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    dayMonthCont: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: "#ccc",
        // borderRadius: 10,
        marginBottom: 20,
        backgroundColor: "#2E2E2E",
        marginBottom: -40,
    },
    gridText: {
        fontSize: 16,
        textAlign: "center",
        color: "white",
    },
    dayText: {
        fontSize: 60,
        textAlign: "center",
        color: "#F85C5C",
        fontWeight: "600",
        padding: 10,
    },
    monthText: {
        fontSize: 60,
        textAlign: "center",
        color: "#CDD2EE",
        textShadowColor: "rgba(173, 173, 173, 1)",
        textShadowRadius: 5,
        fontWeight: "600",
        padding: 10,
    },
    dateText: {
        fontSize: 170,
        textAlign: "center",
        color: "white",
        // borderWidth: 1,
        // borderColor: "#ccc",
        // borderRadius: 10,
        // height: "50%",
        // marginBottom: 20,
        fontWeight: "bold",
    },

    weatherGridItem: {
        width: "90%",
        height: "45%",
        padding: 40,
        // borderWidth: 1,
        // borderColor: "#ccc",
        borderRadius: 10,
        // marginBottom: 20,
        backgroundColor: "#2E2E2E",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        alignItems: "flex-start",
    },
    locationCont: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: "#ccc",
        // borderRadius: 10,
        // marginBottom: 20,
        backgroundColor: "#2E2E2E",
        // marginBottom: -40,
    },
    locationText: {
        fontSize: 30,
        textAlign: "center",
        color: "white",
        fontWeight: "500",
        letterSpacing: 0.5,
    },
    locationIcon: {
        // marginLeft: 10,
        transform: [{ scale: 0.95 }],
        // width: 100,
        // height: 100,
        // marginBottom: "500px",
        // scale: 1000,
    },
    tempText: {
        fontSize: 125,
        textAlign: "left",
        color: "white",
        // fontWeight: "600",
        padding: 10,
        // borderWidth: 1,
        marginVertical: -15,
        marginHorizontal: -10,
        // height
    },
    feelTempText: {
        fontSize: 18,
        textAlign: "left",
        color: "white",
        fontWeight: "300",
    },
    weatherIcon: {
        height: "100px",
        width: "100px",
        marginBottom: -10,
    },
    weatherDescText: {
        fontSize: 23,
        textAlign: "center",
        color: "white",
    },
});

export default Details;
