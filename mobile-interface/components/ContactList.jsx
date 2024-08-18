import {View, Text, FlatList} from 'react-native';
import ContactInformation from './ContactInfomation';

export default function ContactList({contacts}) {
    return(
        <View className='flex-row w-full'>
            <FlatList
                className='w-full'
                data={contacts}
                keyExtractor={(item, index) => item.user_id.toString()}
                renderItem={({item}) => (
                    <ContactInformation contact={item}></ContactInformation>
                )}
                initialNumToRender={1} // Number of items to display initially
                windowSize={1} // Controls how many items are rendered at once, multiple of the visible items
            />
            <View className='flex-col items-center gap-y-[1.5px]'>
                <Text className="text-app-primary-glow">a</Text>
                <Text className="text-app-primary-glow">b</Text>
                <Text className="text-app-primary-glow">c</Text>
                <Text className="text-app-primary-glow">d</Text>
                <Text className="text-app-primary-glow">e</Text>
                <Text className="text-app-primary-glow">f</Text>
                <Text className="text-app-primary-glow">g</Text>
                <Text className="text-app-primary-glow">h</Text>
                <Text className="text-app-primary-glow">i</Text>
                <Text className="text-app-primary-glow">j</Text>
                <Text className="text-app-primary-glow">k</Text>
                <Text className="text-app-primary-glow">l</Text>
                <Text className="text-app-primary-glow">m</Text>
                <Text className="text-app-primary-glow">n</Text>
                <Text className="text-app-primary-glow">o</Text>
                <Text className="text-app-primary-glow">p</Text>
                <Text className="text-app-primary-glow">q</Text>
                <Text className="text-app-primary-glow">r</Text>
                <Text className="text-app-primary-glow">s</Text>
                <Text className="text-app-primary-glow">t</Text>
                <Text className="text-app-primary-glow">u</Text>
                <Text className="text-app-primary-glow">v</Text>
                <Text className="text-app-primary-glow">w</Text>
                <Text className="text-app-primary-glow">x</Text>
                <Text className="text-app-primary-glow">y</Text>
                <Text className="text-app-primary-glow">z</Text>
                <Text className="text-app-primary-glow">#</Text>
            </View>
        </View>
    )
}