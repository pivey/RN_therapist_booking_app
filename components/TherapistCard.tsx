import React from 'react';
import { Dimensions, View, Text, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';
import { TimeSlot } from '../App';

const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const { height: windowHeight } = Dimensions.get('window');

interface Item {
  id: number;
  slotLength: number;
  dateAndTime: Date | string;
}

interface Section {
  title: string;
  data: TimeSlot[];
  therapistInitial: string;
  avatarColour: string;
}

const TherapistCard = ({
  item: { id, slotLength, dateAndTime },
  section: { therapistInitial, avatarColour },
}: {
  item: Item;
  section: Section;
}) => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#D4DBE2',
        width: '100%',
        height: windowHeight * 0.085,
        marginVertical: 5,
        flexDirection: 'row',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flex: 0.333,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: windowHeight * 0.0725,
            height: windowHeight * 0.0725,
            backgroundColor: avatarColour,
            borderRadius: windowHeight * 0.0725,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
            {therapistInitial}
          </Text>
          <View
            style={{
              backgroundColor: 'black',
              position: 'absolute',
              bottom: 2,
              right: -2,
              justifyContent: 'center',
              alignItems: 'center',
              height: 20,
              width: 20,
              borderRadius: 20,
            }}>
            <Text
              style={{
                fontSize: 9,
                color: 'white',
                fontWeight: 'bold',
              }}>
              {id}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 0.666,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingLeft: '20%',
            marginVertical: 2,
          }}>
          <Text style={{ fontSize: 18, color: '#273546' }}>
            {dayjs(dateAndTime).utc('z').local().format('DD/MM/YYYY')}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            paddingLeft: '20%',
            marginVertical: 2,
          }}>
          <Text style={{ fontSize: 18, color: '#273546' }}>
            {dayjs(dateAndTime).utc('z').local().format('HH:mm A')}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 0.333,
          justifyContent: 'center',
        }}>
        <Text style={{ fontSize: 18, color: '#273546' }}>{`${slotLength} mins`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TherapistCard;
