import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dimensions,
  SectionList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, TherapistCard } from './components';
import dayjs from 'dayjs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';

const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

export interface TimeSlot {
  id: number;
  slotLength: number;
  dateAndTime: Date;
}

interface TherapistData {
  id: number;
  therapistName: string;
  timeSlots: TimeSlot[];
}

const { width: screenWidth } = Dimensions.get('window');

const avatarColours = ['#29335C', '#A8C686', '#AA7BC3', '#5B2333', '#F2CC8F'];
const randomIndex = Math.floor(Math.random() * avatarColours.length);

const officeHourArray = [
  { label: '9-10am', value: 9 },
  { label: '10-11am', value: 10 },
  { label: '11-12pm', value: 11 },
  { label: '12-13pm', value: 12 },
  { label: '13-14pm', value: 13 },
  { label: '14-15pm', value: 14 },
  { label: '15-16pm', value: 15 },
  { label: '16-17pm', value: 16 },
];

/*
  3 drop down selectors:
  1 for therapist
  1 for timeSlots
  1 for dates of appointment

  a user must pick at least a therapist
  other values can be assumed and can be chosen or not
*/

const slotLengths = [30, 60];

const App = () => {
  const [therapistData, setTherapistData] = useState([]);
  const [textInputValue, setTextInputValue] = useState('');
  const [chosenTherapistData, setChosenTherapistData] = useState<TherapistData[]>([]);
  const [avatarData, setAvatarData] = useState({ bgc: '', initials: '' });
  const [error, setError] = useState('');

  const [open, setOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [value, setValue] = useState([]);
  const [chosenDate, setChosenDate] = useState(null);
  const [therapistDropdownData, setTherapistDropdownData] = useState([]);
  const [chosenTimeSlot, setChosenTimeSlot] = useState([]);
  const [dateDropdownData, setDateDropdownData] = useState<{ label: string; value: unknown }[]>([]);
  const [chosenAppointmentLength, setChosenAppointmentLength] = useState(30);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    axios('http://localhost:5001/timeSlots')
      .then(res => {
        setTherapistData(res.data);

        const therapistList = res.data.map(el => {
          return {
            label: el.therapistName,
            value: el.id,
          };
        });

        setTherapistDropdownData(therapistList);

        const dateTimeData = res.data
          .reduce((acc, curVal) => {
            acc.push(...curVal.timeSlots);
            return acc;
          }, [])
          .sort((a: TimeSlot, b: TimeSlot) => {
            const aDate = dayjs(a.dateAndTime);
            const bDate = dayjs(b.dateAndTime);
            return aDate > bDate ? 1 : aDate === bDate ? 0 : -1;
          })
          .map(el => {
            return el.dateAndTime.split('T')[0];
          });

        const dateDropdownDataArray = [...new Set(dateTimeData)].map(el => {
          return { label: dayjs(el).format('MMMM DD YYYY'), value: el };
        });

        setDateDropdownData(dateDropdownDataArray);
      })
      .catch(error => {
        console.warn('An error occurred when fetching therapist data', error);
      });
  }, []);

  const handleTherapistIdSelected = () => {
    const foundTherapists = therapistData.filter(el => value.includes(el.id));
    const combinedTimesArray = chosenTimeSlot.map(el => {
      return `${chosenDate}T${el}:00`;
    });

    if (foundTherapists.length > 0) {
      const filteredAppointments = JSON.parse(JSON.stringify(foundTherapists)).map((el, ind) => {
        el.timeSlots = el.timeSlots
          .filter(elem => {
            if (combinedTimesArray.length === 0) {
              if (elem.slotLength === chosenAppointmentLength) {
                return elem;
              }
            } else {
              if (
                elem.slotLength === chosenAppointmentLength &&
                combinedTimesArray.includes(elem.dateAndTime)
              ) {
                return elem;
              }
            }

            return null;
          })
          .sort((a: TimeSlot, b: TimeSlot) => {
            const aDate = dayjs(a.dateAndTime);
            const bDate = dayjs(b.dateAndTime);
            return aDate > bDate ? 1 : aDate === bDate ? 0 : -1;
          });

        return el;
      });

      console.log('*** data after operation ***', {
        foundTherapists,
        filteredAppointments,
      });

      const test = chosenTherapistData.map(el => {
        return [
          {
            title: el.therapistName,
            data: el.timeSlots,
          },
        ];
      });
      console.log('handleTherapistIdSelected -> test', test);

      setChosenTherapistData(filteredAppointments);
    }

    // else {
    //   // setError(`The therapist with id ${therapistId} could not be found`);
    // }
  };

  const handleSelectTimeSlot = (itemValue: number) => {
    if (chosenTimeSlot.includes(itemValue)) {
      const newArray = chosenTimeSlot.filter(el => el !== itemValue);
      setChosenTimeSlot(newArray);
    } else {
      setChosenTimeSlot(prevState => [...prevState, itemValue]);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#F6F9FD',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}>
      <StatusBar barStyle="light-content" />
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginVertical: 15,
          color: '#273546',
        }}>
        Joint academy booking
      </Text>
      <View
        style={{
          width: '100%',
          marginBottom: 5,
          alignItems: 'center',
        }}>
        <DropDownPicker
          multiple={true}
          min={1}
          max={5}
          open={open}
          value={value}
          items={therapistDropdownData}
          setOpen={setOpen}
          setValue={setValue}
          placeholder="Choose a therapist"
          mode="BADGE"
          badgeDotStyle={{
            backgroundColor: avatarColours[randomIndex],
          }}
          badgeColors={['#CAA8F5']}
          badgeDotColors={['#5096E8']}
          containerStyle={{
            zIndex: 1001,
          }}
          style={{
            borderColor: '#273546',
          }}
          textStyle={{
            color: '#273546',
          }}
          dropDownContainerStyle={{
            borderColor: '#273546',
          }}
        />
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 10,
            zIndex: 1000,
          }}>
          <DropDownPicker
            open={openDate}
            value={chosenDate}
            items={dateDropdownData}
            setOpen={setOpenDate}
            setValue={setChosenDate}
            placeholder="Choose a date"
            badgeDotStyle={{
              backgroundColor: avatarColours[randomIndex],
            }}
            style={{
              borderColor: '#273546',
            }}
            textStyle={{
              color: '#273546',
            }}
            dropDownContainerStyle={{
              borderColor: '#273546',
            }}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 10,
          }}>
          {officeHourArray.map(({ value, label }) => {
            const timeIsSelected = chosenTimeSlot.includes(value);
            return (
              <TouchableOpacity
                key={String(value).concat(label)}
                onPress={() => handleSelectTimeSlot(value)}
                style={{
                  marginRight: 10,
                  backgroundColor: timeIsSelected ? '#81E114' : '#D4DBE2',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  borderRadius: 20,
                  width: (screenWidth - 40) * 0.25,
                }}>
                <Text>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View
          style={{
            width: '100%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: 5,
          }}>
          <Text
            style={{
              paddingTop: 5,
              paddingRight: 10,
              width: '33%',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              marginTop: 10,
            }}>
            Appointment length
          </Text>
          {slotLengths.map((el, ind) => {
            const selected = chosenAppointmentLength === el;
            return (
              <Button
                key={el}
                bgc={selected ? '#81E114' : '#D4DBE2'}
                textColour="black"
                btnText={String(el)}
                pressHandler={() => setChosenAppointmentLength(el)}
                customStyling={{ marginLeft: ind === 1 ? 7.5 : 0, height: 45 }}
              />
            );
          })}
        </View>
        <View
          style={{
            width: '100%',
            height: 60,
            justifyContent: 'center',
          }}>
          <Button btnText="ENTER" pressHandler={() => handleTherapistIdSelected()} />
        </View>
      </View>
      {chosenTherapistData.length > 0 && (
        <SectionList
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          alwaysBounceVertical={false}
          keyExtractor={({ id, dateAndTime }, ind) => String(ind).concat(String(id), dateAndTime)}
          renderItem={item => <TherapistCard {...item} />}
          sections={chosenTherapistData.map(el => {
            return {
              title: el.therapistName,
              data: el.timeSlots,
              avatarColour: avatarColours[randomIndex],
              therapistInitial: el.therapistName
                .split(' ')
                .map(el => el.charAt(0))
                .join(''),
            };
          })}
          renderSectionHeader={({
            section: { data, title },
          }: {
            section: { title: string; data: TimeSlot[] };
          }) => {
            return (
              <>
                {data.length > 0 && (
                  <Text
                    style={{
                      fontSize: 20,
                      marginTop: 10,
                      marginBottom: 7.5,
                    }}>
                    {title}
                  </Text>
                )}
              </>
            );
          }}
        />
      )}
    </View>
  );
};

export default App;
