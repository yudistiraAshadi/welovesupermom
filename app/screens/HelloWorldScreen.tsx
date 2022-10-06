import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { View, ViewStyle, Keyboard, ScrollView } from "react-native"
import { Button, Text, TextField, Screen } from "../components"
import { Formik } from "formik"
import * as Yup from "yup"
import { colors } from "../theme"
import { writeFile, DocumentDirectoryPath } from "react-native-fs"
import ExcelJS from "exceljs"
import { Buffer as NodeBuffer } from "buffer"
import Toast from "react-native-simple-toast"
import FileViewer from "react-native-file-viewer"

/**
 * helper function to transform string into alternate case
 *
 * @param text
 * @returns alternate case text
 */
export const transformAlternateCase = (text: string) => {
  return text
    .split("")
    .map((char, index) => (index % 2 == 0 ? char.toLowerCase() : char.toUpperCase()))
    .join("")
}

/**
 * helper function to transform string into upper case
 *
 * @param text
 * @returns alternate case text
 */
export const transformUpperCase = (text: string) => {
  return text.toUpperCase()
}

export const HelloWorldScreen = observer(function HelloWorldFn() {
  /**
   * Constants
   */
  const fileName = "welovesupermom_helloworld.csv"
  const fileUri = DocumentDirectoryPath + "/" + fileName

  /**
   * States
   */
  const [uppercaseString, setUppercaseString] = useState<string>("")
  const [alternateCaseString, setAlternateCaseString] = useState<string>("")
  const [isCsvCreated, setIsCsvCreated] = useState<boolean>(false)

  /**
   * Function to build csv file with the inputted string
   *
   * @param text
   */
  const downloadCsvFile = async (text: string) => {
    // create and setup workbook for csv file
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet()

    // add the inputted string into csv
    worksheet.addRow(text.split(""))

    // write the csv into a file
    workbook.csv.writeBuffer().then((buffer: ExcelJS.Buffer) => {
      // Do this to use base64 encoding
      const nodeBuffer = NodeBuffer.from(buffer)
      const bufferStr = nodeBuffer.toString("base64")

      writeFile(fileUri, bufferStr, "base64")
        .then((res) => {
          setIsCsvCreated(true)
          Toast.show("CSV Created!")
        })
        .catch((err) => {
          Toast.show("Error happened during CSV creation!")
        })
    })
  }

  /**
   * Function to open outputted csv file
   */
  const openCsvFile = () => {
    FileViewer.open(fileUri, { showOpenWithDialog: true }).catch((error) => {
      Toast.show("No program to open CSV file!")
    })
  }

  /**
   * Render the form for submitting text to transform
   *
   * @returns input text form
   */
  const _renderInputTextForm = () => {
    const INITIAL_VALUE = {
      inputtedString: "",
    }

    const VALIDATION_SCHEMA = Yup.object().shape({
      inputtedString: Yup.string().required("String can't be empty"),
    })

    return (
      <Formik
        initialValues={INITIAL_VALUE}
        validationSchema={VALIDATION_SCHEMA}
        onSubmit={(values, { resetForm }) => {
          let inputtedString = values.inputtedString

          // transform string
          setUppercaseString(transformUpperCase(inputtedString))
          setAlternateCaseString(transformAlternateCase(inputtedString))

          // output string to csv
          downloadCsvFile(inputtedString)

          // reset form
          resetForm()
        }}
      >
        {({ handleChange, handleSubmit, values }) => {
          let submitDisable = values.inputtedString.length <= 0

          return (
            <View style={$formContainer}>
              <TextField
                label="Input a String:"
                value={values.inputtedString}
                onChangeText={handleChange("inputtedString")}
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                  handleSubmit()
                }}
                placeholder="A string"
              />

              {/* Submit button */}
              <Button
                preset="reversed"
                onPress={() => {
                  Keyboard.dismiss()
                  handleSubmit()
                }}
                style={[$submitButton, submitDisable && $submitButtonInactive]}
                disabled={submitDisable}
              >
                Submit
              </Button>
            </View>
          )
        }}
      </Formik>
    )
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} style={$screen}>
      {_renderInputTextForm()}

      {uppercaseString ? (
        <View style={$outputContainer}>
          <Text preset="subheading">Upper Case string</Text>
          <Text>{uppercaseString}</Text>
        </View>
      ) : null}

      {alternateCaseString ? (
        <View style={$outputContainer}>
          <Text preset="subheading">Alternate Case string</Text>
          <Text>{alternateCaseString}</Text>
        </View>
      ) : null}

      {isCsvCreated ? (
        <Button preset="reversed" onPress={() => openCsvFile()} style={$outputContainer}>
          Open CSV file
        </Button>
      ) : null}
    </Screen>
  )
})

const $screen: ViewStyle = {
  paddingHorizontal: "2.5%",
}

const $submitButton: ViewStyle = {
  marginTop: 10,
}

const $submitButtonInactive: ViewStyle = {
  backgroundColor: colors.palette.neutral300,
}

const $formContainer: ViewStyle = {
  marginBottom: 20,
}

const $outputContainer: ViewStyle = {
  marginBottom: 20,
}
