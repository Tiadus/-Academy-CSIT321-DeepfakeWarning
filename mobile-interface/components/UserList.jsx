import {View, Text, FlatList} from 'react-native';
import ContactInformation from './ContactInfomation';

export default function UserList({users}) {
    return(
        <View className='flex-row w-full'>
            <FlatList
                className='w-full'
                data={users}
                keyExtractor={(item, index) => item.user_id.toString()}
                renderItem={({item}) => (
                    <ContactInformation contact={item}></ContactInformation>
                )}
            />
        </View>
    )
}