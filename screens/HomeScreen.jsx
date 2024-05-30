import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAllMemories } from '../services/BucketService';

const HomeScreen = ({ navigation }) => {

    const [memories, setMemories] = useState(null);

    useEffect(() => {
        const getMemories = async () => {
            setMemories(await getAllMemories());
        };

        const unsubscribe = navigation.addListener('focus', () => {
            getMemories();
        });

        return unsubscribe;
    }, [navigation]);

    const renderData = () => {
        if (!memories) {
            return <Text>Loading...</Text>; // Add a loading indicator or message
        }

        return memories.map((data, index) => (
            <View style={styles.card} key={index}>
                <Image
                    style={styles.img}
                    source={{ uri: data.image }} />

                <Text>{data.title}</Text>
            </View>
        ));
    };

    return (

        <ScrollView style={styles.container}>

            <Pressable style={{ backgroundColor: 'lightgreen', padding: 10, alignItems: 'center' }} onPress={() => navigation.navigate("Add")}>
                <Text>Add</Text>
            </Pressable>

            {/* Card of your images that you need to loop through */}
            {renderData()}

        </ScrollView>

    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    card: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20
    },
    img: {
        width: '100%',
        height: 200,
        objectFit: 'cover'
    }
})