import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

import { useState } from "react";
import styles from "./welcome.style";

import { icons, SIZE } from "../../../constants";
const Welcome = () => {
  const router = useRouter();
  return (
    <View>
      <View style={styles.container}>
        <Text  >Helo</Text>
      </View>
    </View>
  );
};

export default Welcome;
