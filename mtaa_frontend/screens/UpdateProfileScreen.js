import { View, TextInput, Text, Pressable } from 'react-native'
import { Formik } from 'formik'
import { RadioButton } from 'react-native-paper'
import Checkbox from 'expo-checkbox'
import { useEffect, useState } from 'react'

import { getStudent } from '../api/getStudent'
import { updateStudent } from '../api/updateStudent'
import { useAuth } from '../hooks/useAuth'
import { BORDER_COLOR, INVALID_COLOR } from '../constants/Color'
import { setupProfileStyles } from './SetupProfileScreen'
import { Loader } from '../components/Loader'
import { DefaultScreen } from './DefaultScreen'

export const UpdateProfileScreen = () => {
  const [dataLoaded, setDataLoaded] = useState(false)
  const [userData, setUserData] = useState({
    fullName: '',
    phone: '',
    height: '',
    weight: '',
    hairColor: '',
    age: '',
    bodyType: '',
    hobbies: {
      cars: false,
      music: false,
      fishing: false,
      travelling: false,
      sport: false,
      films: false,
      reading: false,
      gaming: false,
      cooking: false,
    },
    interests: {
      friends: false,
      relationship: false,
      chat: false,
    },
  })

  const { user } = useAuth()

  useEffect(() => {
    let unmounted = false
    getStudent(user.id)
      .then((res) => {
        if (!unmounted) {
          setUserData({
            fullName: res.fullname,
            phone: res.phonenumber,
            height: `${res.height}`,
            weight: `${res.weight}`,
            hairColor: res.haircolor,
            age: `${res.age}`,
            bodyType: res.bodytype,
            hobbies: {
              cars: res.hobby.includes('Cars'),
              music: res.hobby.includes('Music'),
              fishing: res.hobby.includes('Fishing'),
              travelling: res.hobby.includes('Travelling'),
              sport: res.hobby.includes('Sport'),
              films: res.hobby.includes('Films'),
              reading: res.hobby.includes('Reading'),
              gaming: res.hobby.includes('Gaming'),
              cooking: res.hobby.includes('Cooking'),
            },
            interests: {
              friends: res.interests.includes('Friends'),
              relationship: res.interests.includes('Relationship'),
              chat: res.interests.includes('Chat'),
            },
          })
          setDataLoaded(true)
        }
      })
      .catch((e) => {
        console.log(e)
      })
    return () => {
      unmounted = true
    }
  }, [])

  return dataLoaded ? (
    <DefaultScreen>
      <Text style={setupProfileStyles.heading}>Edit your profile</Text>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={userData}
        validate={(values) => {
          const errors = {}

          if (!values.fullName) {
            errors.fullName = 'Full name is required'
          }

          if (!values.phone) {
            errors.phone = 'Phone number is required'
          }

          return errors
        }}
        onSubmit={(values) => {
          updateStudent(user.id, user.token, values)
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          setFieldValue,
        }) => (
          <View>
            <View style={setupProfileStyles.sectionContainer}>
              <Text style={setupProfileStyles.sectionHeading}>Basic Info</Text>
              <View style={setupProfileStyles.inputContainer}>
                <Text style={setupProfileStyles.label}>Full name</Text>
                <TextInput
                  style={[
                    setupProfileStyles.input,
                    errors.fullName ? setupProfileStyles.inputInvalid : null,
                  ]}
                  placeholderTextColor={
                    errors.fullName ? INVALID_COLOR : BORDER_COLOR
                  }
                  placeholder="Donald Trump"
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  value={values.fullName}
                />
              </View>
              <View style={setupProfileStyles.inputContainer}>
                <Text style={setupProfileStyles.label}>
                  Profile description
                </Text>
                <TextInput
                  style={[
                    setupProfileStyles.input,
                    errors.phone ? setupProfileStyles.inputInvalid : null,
                  ]}
                  placeholderTextColor={
                    errors.phone ? INVALID_COLOR : BORDER_COLOR
                  }
                  placeholder="0944955043"
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={setupProfileStyles.sectionContainer}>
              <Text style={setupProfileStyles.sectionHeading}>
                Something about me
              </Text>
              <View style={setupProfileStyles.inputRow}>
                <View
                  style={[
                    setupProfileStyles.inputContainer,
                    { width: '47.5%' },
                  ]}>
                  <Text style={setupProfileStyles.label}>Height in cm</Text>
                  <TextInput
                    style={[setupProfileStyles.input]}
                    placeholder="180cm"
                    onChangeText={handleChange('height')}
                    onBlur={handleBlur('height')}
                    value={values.height}
                    keyboardType="numeric"
                  />
                </View>
                <View
                  style={[
                    setupProfileStyles.inputContainer,
                    { width: '47.5%' },
                  ]}>
                  <Text style={setupProfileStyles.label}>Weight in kg</Text>
                  <TextInput
                    style={[setupProfileStyles.input]}
                    placeholder="84kg"
                    onChangeText={handleChange('weight')}
                    onBlur={handleBlur('weight')}
                    value={values.weight}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={setupProfileStyles.inputRow}>
                <View
                  style={[
                    setupProfileStyles.inputContainer,
                    { width: '47.5%' },
                  ]}>
                  <Text style={setupProfileStyles.label}>Hair color</Text>
                  <TextInput
                    style={[setupProfileStyles.input]}
                    placeholder="Blonde"
                    onChangeText={handleChange('hairColor')}
                    onBlur={handleBlur('hairColor')}
                    value={values.hairColor}
                  />
                </View>
                <View
                  style={[
                    setupProfileStyles.inputContainer,
                    { width: '47.5%' },
                  ]}>
                  <Text style={setupProfileStyles.label}>Age</Text>
                  <TextInput
                    style={[setupProfileStyles.input]}
                    placeholder="23"
                    onChangeText={handleChange('age')}
                    onBlur={handleBlur('age')}
                    value={values.age}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <RadioButton.Group
                onValueChange={handleChange('bodyType')}
                value={values.bodyType}>
                <Text style={[setupProfileStyles.label, { marginTop: 20 }]}>
                  Body type
                </Text>
                <View style={setupProfileStyles.radioGroup}>
                  <View style={setupProfileStyles.radioItem}>
                    <RadioButton value="Athletic" />
                    <Text>Athletic</Text>
                  </View>
                  <View style={setupProfileStyles.radioItem}>
                    <RadioButton value="Normal" />
                    <Text>Normal</Text>
                  </View>
                  <View style={setupProfileStyles.radioItem}>
                    <RadioButton value="Fat" />
                    <Text>Fat</Text>
                  </View>
                  <View style={setupProfileStyles.radioItem}>
                    <RadioButton value="Not selected" />
                    <Text>Not selected</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
            <View style={setupProfileStyles.sectionContainer}>
              <Text style={setupProfileStyles.sectionHeading}>My hobbies</Text>
              <View style={setupProfileStyles.checkboxRow}>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.hobbies.cars}
                    onValueChange={() => {
                      setFieldValue('hobbies.cars', !values.hobbies.cars)
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>Cars</Text>
                </View>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.hobbies.fishing}
                    onValueChange={() => {
                      setFieldValue('hobbies.fishing', !values.hobbies.fishing)
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>Fishing</Text>
                </View>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.hobbies.travelling}
                    onValueChange={() => {
                      setFieldValue(
                        'hobbies.travelling',
                        !values.hobbies.travelling,
                      )
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>
                    Travelling
                  </Text>
                </View>
              </View>
              <View style={setupProfileStyles.checkboxRow}>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.hobbies.music}
                    onValueChange={() => {
                      setFieldValue('hobbies.music', !values.hobbies.music)
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>Music</Text>
                </View>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.hobbies.sport}
                    onValueChange={() => {
                      setFieldValue('hobbies.sport', !values.hobbies.sport)
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>Sport</Text>
                </View>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.hobbies.films}
                    onValueChange={() => {
                      setFieldValue('hobbies.films', !values.hobbies.films)
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>Films</Text>
                </View>
              </View>
              <View style={setupProfileStyles.checkboxRow}>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.hobbies.cooking}
                    onValueChange={() => {
                      setFieldValue('hobbies.cooking', !values.hobbies.cooking)
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>Cooking</Text>
                </View>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.hobbies.gaming}
                    onValueChange={() => {
                      setFieldValue('hobbies.gaming', !values.hobbies.gaming)
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>Gaming</Text>
                </View>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.hobbies.reading}
                    onValueChange={() => {
                      setFieldValue('hobbies.reading', !values.hobbies.reading)
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>
                    Travelling
                  </Text>
                </View>
              </View>
            </View>
            <View style={setupProfileStyles.sectionContainer}>
              <Text style={setupProfileStyles.sectionHeading}>
                What are you looking for ?
              </Text>
              <View style={setupProfileStyles.checkboxRow}>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.interests.friends}
                    onValueChange={() => {
                      setFieldValue(
                        'interests.friends',
                        !values.interests.friends,
                      )
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>Friends</Text>
                </View>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.interests.relationship}
                    onValueChange={() => {
                      setFieldValue(
                        'interests.relationship',
                        !values.interests.relationship,
                      )
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>
                    Relationship
                  </Text>
                </View>
                <View style={setupProfileStyles.checkboxContainer}>
                  <Checkbox
                    value={values.interests.chat}
                    onValueChange={() => {
                      setFieldValue('interests.chat', !values.interests.chat)
                    }}
                    style={setupProfileStyles.checkbox}
                  />
                  <Text style={setupProfileStyles.checkboxLabel}>
                    Chat buddy
                  </Text>
                </View>
              </View>
            </View>
            <Pressable style={setupProfileStyles.button} onPress={handleSubmit}>
              <Text style={setupProfileStyles.buttonText}>Save</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </DefaultScreen>
  ) : (
    <Loader />
  )
}
