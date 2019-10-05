import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./App.css";

let signUpSchema = {
  email: Yup.string()
    .email("Invalid email")
    .max(70, "Too long babe!")
    .required("Required!"),
  password: Yup.string()
    .required("Required!")
    .min(8, "Too short!")
    .max(16, "Too long!")
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldList: [],
      error: false
    };
  }

  componentDidMount() {
    axios.get("http://localhost:4001/fieldList").then(value => {
      this.setState({ fieldList: value.data });
    });
  }
  render() {
    const dynamicObjects = {};

    if (this.state.fieldList.length > 0) {
      this.state.fieldList.map(item => {
        console.log('inside test', item);
        dynamicObjects[item.name] = Yup.string().test(
          `${item.name} test`,
          `Invalid value of ${item.name}.`,
          value =>
            axios
              .get(`http://localhost:4001/fieldListValue/${item.id}`)
              .then(result => {
                console.log('Test computation inside function', item, result.data.value, value);
                return result.data.value === value;
              })
        );
      });
      signUpSchema = Yup.object().shape({...dynamicObjects, ...signUpSchema})
    }
    console.log(signUpSchema)

    return (
      <div className="App">
        <div>
          <Formik
            initialData={{ email: "", password: "" }}
            validationSchema={signUpSchema}
            render={values => {
              return (
                <Form>
                  <div>
                    <Field name="email" type="email" />
                  </div>
                  <div>
                    <ErrorMessage name="email" />
                  </div>
                  <div>
                    <Field name="password" type="password" />
                  </div>
                  <div>
                    <ErrorMessage name="password" />
                  </div>
                  {this.state.fieldList.map(field => (
                    <div key={field.id}>
                      <label>{field.name}</label>
                      <Field name={field.name} type="input" />
                      <ErrorMessage name={field.name} />
                    </div>
                  ))}
                  <button type="submit">Submit</button>
                </Form>
              );
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
