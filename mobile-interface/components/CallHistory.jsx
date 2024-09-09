import {View, Text, ScrollView} from 'react-native';
import CallInfo from './ui/CallInfo'

export default function ContactList({histories}) {
    return(
        <ScrollView>
            {histories.map((history) => (
            <CallInfo key={`${history.user_id}${history.created_at}`} history={history}/>
            ))}
        </ScrollView>
    )
}