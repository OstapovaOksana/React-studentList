import React, {useEffect, useState, useCallback} from 'react';
import * as APIService from '../../services/APIService';
import {
  Container,
  Typography,
  Button,
  TextField,
  makeStyles,
} from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { studentExist } from "../../services/APIService";

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(4),
  },
  field: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginBottom: theme.spacing(2),
  },
}));

const StudentScreen = ({match, history}) => {
  const studentId = match.params.studentId;
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (studentId) {
      const currentStudent = APIService.getStudent(studentId);

      setStudent(currentStudent);
    }
  }, [studentId]);

  const handleFormSubmit = useCallback(
    values => {
      if (studentId) {
        APIService.updateStudent(studentId, values);
      } else {
        APIService.addStudent(values);
      }

      history.push('/students');
    },
    [studentId, history]
  );

  const classes = useStyles();


    const validate = values => {
        const errors = {};
        if (!values.avatar) {
            errors.avatar = 'Required';
        }
        if (!values.name) {
            errors.name = 'Required';
        }
        if (!values.address) {
            errors.address = 'Required';
        }
        return errors;
    };

    if (studentId) {
        if (!studentExist(studentId)) {
            return (
                <Redirect to="/student-not-found" />
            );
        }
    }

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" className={classes.title}>
        {studentId ? 'Update Student' : 'Create Student'}
          </Typography>
          <Form onSubmit={handleFormSubmit} initialValues={student} validate={validate}>
        {({handleSubmit}) => (
          <>
            <Field name="avatar">
              {({input,meta}) => (
                <TextField
                  className={classes.field}
                  label="Avatar URL"
                  variant="outlined"
                  error={meta.error && meta.touched}
                  helperText={meta.touched ? meta.error : ''}
                  fullWidth
                  {...input}
                />
              )}
            </Field>
            <Field name="name">
              {({input,meta}) => (
                <TextField
                  className={classes.field}
                  label="Name"
                  variant="outlined"
                  error={meta.error && meta.touched}
                  helperText={meta.touched ? meta.error : ''}
                  fullWidth
                  {...input}
                />
              )}
            </Field>
            <Field name="address">
              {({input,meta}) => (
                <TextField
                  className={classes.field}
                  label="Address"
                  variant="outlined"
                  error={meta.error && meta.touched}
                  helperText={meta.touched ? meta.error : ''}
                  fullWidth
                  {...input}
                />
              )}
            </Field>
            <Button
              onClick={handleSubmit}
              fullWidth
              color="primary"
              variant="contained"
              size="large"
              className={classes.submitButton}
            >
              Submit
            </Button>
            {studentId && (
              <Button
                component={Link}
                to={`/students/delete/${studentId}`}
                fullWidth
                color="secondary"
                variant="outlined"
                size="large"
              >
                Delete student
              </Button>
            )}
          </>
        )}
      </Form>
    </Container>
  );
};

export default StudentScreen;
