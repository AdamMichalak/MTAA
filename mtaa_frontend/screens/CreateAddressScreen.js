import { View, TextInput, Text, Pressable } from 'react-native'
import { Formik } from 'formik'

import { createAddress } from '../api/createAddress'
import { useAuth } from '../hooks/useAuth'
import { BORDER_COLOR, INVALID_COLOR } from '../constants/Color'
import { DefaultScreen } from './DefaultScreen'
import { setupProfileStyles } from './SetupProfileScreen'

export const CreateAddressScreen = () => {
  const { user } = useAuth()

  return (
    <DefaultScreen style={{ justifyContent: 'flex-start' }}>
      <View style={setupProfileStyles.container}>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            street: '',
            city: '',
            psc: '',
            country: '',
          }}
          validate={(values) => {
            const errors = {}

            if (!values.street) {
              errors.street = 'Street is required'
            }

            if (!values.city) {
              errors.city = 'City is required'
            }

            if (!values.psc) {
              errors.psc = 'PSC is required'
            }

            if (!values.country) {
              errors.country = 'Country is required'
            }

            return errors
          }}
          onSubmit={(values) => {
            createAddress(user.id, user.token, values)
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View>
              <View style={setupProfileStyles.inputContainer}>
                <Text style={setupProfileStyles.label}>Street and number</Text>
                <TextInput
                  style={[
                    setupProfileStyles.input,
                    errors.street ? setupProfileStyles.inputInvalid : null,
                  ]}
                  placeholderTextColor={
                    errors.street ? INVALID_COLOR : BORDER_COLOR
                  }
                  placeholder="Obchodna"
                  onChangeText={handleChange('street')}
                  onBlur={handleBlur('street')}
                  value={values.street}
                />
              </View>
              <View style={setupProfileStyles.inputContainer}>
                <Text style={setupProfileStyles.label}>City</Text>
                <TextInput
                  style={[
                    setupProfileStyles.input,
                    errors.city ? setupProfileStyles.inputInvalid : null,
                  ]}
                  placeholderTextColor={
                    errors.city ? INVALID_COLOR : BORDER_COLOR
                  }
                  placeholder="Bratislava"
                  onChangeText={handleChange('city')}
                  onBlur={handleBlur('city')}
                  value={values.city}
                />
              </View>
              <View style={setupProfileStyles.inputContainer}>
                <Text style={setupProfileStyles.label}>Postal code</Text>
                <TextInput
                  style={[
                    setupProfileStyles.input,
                    errors.psc ? setupProfileStyles.inputInvalid : null,
                  ]}
                  placeholderTextColor={
                    errors.psc ? INVALID_COLOR : BORDER_COLOR
                  }
                  placeholder="029 01"
                  onChangeText={handleChange('psc')}
                  onBlur={handleBlur('psc')}
                  value={values.psc}
                  keyboardType="numeric"
                />
              </View>
              <View style={setupProfileStyles.inputContainer}>
                <Text style={setupProfileStyles.label}>Country</Text>
                <TextInput
                  style={[
                    setupProfileStyles.input,
                    errors.country ? setupProfileStyles.inputInvalid : null,
                  ]}
                  placeholderTextColor={
                    errors.country ? INVALID_COLOR : BORDER_COLOR
                  }
                  placeholder="Slovakia"
                  onChangeText={handleChange('country')}
                  onBlur={handleBlur('country')}
                  value={values.country}
                />
              </View>
              <Pressable
                style={setupProfileStyles.button}
                onPress={handleSubmit}>
                <Text style={setupProfileStyles.buttonText}>Add address</Text>
              </Pressable>
            </View>
          )}
        </Formik>
      </View>
    </DefaultScreen>
  )
}
