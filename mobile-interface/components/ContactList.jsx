import {View, Text, ScrollView} from 'react-native';
import ContactInformation from './ContactInfomation';

export default function ContactList({contacts}) {
    return(
        <View className='flex-row'>
            {contacts !== undefined && <ScrollView>
                {contacts.map((item) => (
                    <ContactInformation key={item.user_id} contact={item}></ContactInformation>
                ))}
            </ScrollView>}
            <View>
                <Text className="text-gray-500">a</Text>
                <Text className="text-gray-500">b</Text>
                <Text className="text-gray-500">c</Text>
                <Text className="text-gray-500">d</Text>
                <Text className="text-gray-500">e</Text>
                <Text className="text-gray-500">f</Text>
                <Text className="text-gray-500">g</Text>
                <Text className="text-gray-500">h</Text>
                <Text className="text-gray-500">i</Text>
                <Text className="text-gray-500">j</Text>
                <Text className="text-gray-500">k</Text>
                <Text className="text-gray-500">l</Text>
                <Text className="text-gray-500">m</Text>
                <Text className="text-gray-500">n</Text>
                <Text className="text-gray-500">o</Text>
                <Text className="text-gray-500">p</Text>
                <Text className="text-gray-500">q</Text>
                <Text className="text-gray-500">r</Text>
                <Text className="text-gray-500">s</Text>
                <Text className="text-gray-500">t</Text>
                <Text className="text-gray-500">u</Text>
                <Text className="text-gray-500">v</Text>
                <Text className="text-gray-500">w</Text>
                <Text className="text-gray-500">x</Text>
                <Text className="text-gray-500">y</Text>
                <Text className="text-gray-500">z</Text>
                <Text className="text-gray-500">#</Text>
            </View>
        </View>
    )
}