import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";

const Loader = (props) => {
  return props.loading ? (
    <View style={styles.loaderContainer}>
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          size="large"
          color="#7165e3"
          style={{ marginLeft: 3, marginTop: 3, zIndex: 99 }}
        />
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  loaderContainer: {
    zIndex: 99,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorContainer: {
    backgroundColor: "#ebe6fb",
    height: 50,
    width: 50,
    //opacity: 0.8,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorTextContainer: {
    backgroundColor: "#ffffff",
    height: 130,
    marginHorizontal: 40,
    paddingTop: 10,
    paddingHorizontal: 20,
    opacity: 0.5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    textAlign: "center",
    paddingVertical: 10,
    color: "#111111",
    fontWeight: "700",
  },
});

export default Loader;
