# Design of the database schema for the ThesisManagement application

## Schema

### THESIS_PROPOSAL table
| FIELD_NAME         | TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                                                                                                                         |
| ------------------ | ------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | SERIAL  | NO          | PRIMARY  | Autogenerated thesis ID                                                                                                             |
| TITLE              | TEXT    | NO          |          | Title of the thesis                                                                                                                 |
| TEACHER_ID         | INTEGER | NO          | FOREIGN  | ID of the teacher that proposed this thesis                                                                                         |
| SUPERVISOR         | TEXT    | NO          |          | The email of the supervisor (since supervisors can be external and those aren't in the system, I can't use the internal teacher ID) |
| CO_SUPERVISORS     | TEXT[]  | YES         |          | The emails of the co-supervisors                                                                                                    |
| KEYWORDS           | TEXT[]  | NO          |          | Keywords that identify this thesis                                                                                                  |
| TYPE               | TEXT    | NO          |          | Type of thesis (with company, out of country, etc)                                                                                  |
| GROUPS             | TEXT[]  | YES         |          | Groups that handle this thesis                                                                                                      |
| DESCRIPTION        | TEXT    | NO          |          | Description of the thesis                                                                                                           |
| REQUIRED_KNOWLEDGE | TEXT[]  | NO          |          | Required course/general concepts to know for this thesis                                                                            |
| NOTES              | TEXT    | YES         |          | Extra notes on this thesis                                                                                                          |
| EXPIRATION         | DATE    | NO          |          | Date of expiration of this thesis proposal                                                                                          |
| LEVEL              | INTEGER | NO          |          | Level of this thesis, e.g. 1 for bachelor, 2 for masters and 3 for doctorate                                                                                                                |
| PROGRAMMES         | TEXT[]  | YES         |          | CdS/Programmes linked to this thesis                                                                                                |
| ARCHIVED           | INTEGER | NO          |          | Flag of the thesis is archived or not, 0  = not archived, 1 means archived because of expiration, 2 means archived manually by the professor                                                                                                                |

### TEACHER table
| FIELD_NAME     | TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                                        |
| -------------- | ------- | ----------- | -------- | -------------------------------------------------- |
| ID             | INTEGER | NO          | PRIMARY  | ID of the teacher                                  |
| SURNAME        | TEXT    | NO          |          | Surname of the teacher                             |
| NAME           | TEXT    | NO          |          | Name of the teacher                                |
| EMAIL          | TEXT    | NO          |          | Email of the teacher                               |
| COD_GROUP      | INTEGER | NO          | FOREIGN  | Code of the group that the teacher belongs to      |
| COD_DEPARTMENT | INTEGER | NO          | FOREIGN  | Code of the department that the teacher belongs to |

### DEGREE table
| FIELD_NAME   | TYPE | CAN BE NULL | KEY TYPE | DESCRIPTION         |
| ------------ | ---- | ----------- | -------- | ------------------- |
| COD_DEGREE   | TEXT | NO          | PRIMARY  | Code of the degree  |
| TITLE_DEGREE | TEXT | NO          |          | Title of the degree |

### STUDENT table
| FIELD_NAME      | TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                           |
| --------------- | ------- | ----------- | -------- | ------------------------------------- |
| ID              | INTEGER | NO          | PRIMARY  | Student id                            |
| SURNAME         | TEXT    | NO          |          | Surname of the student                |
| NAME            | TEXT    | NO          |          | Name of the student                   |
| GENDER          | TEXT    | NO          |          | Gender of the student                 |
| NATIONALITY     | TEXT    | NO          |          | Nationality of the student            |
| EMAIL           | TEXT    | NO          |          | Email of the student                  |
| COD_DEGREE      | TEXT    | NO          | FOREIGN  | Code of the degree                    |
| ENROLLMENT_YEAR | DATE    | NO          |          | Year of the enrollment of the student |

### CAREER table
| FIELD_NAME   | TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                                      |
| ------------ | ------- | ----------- | -------- | ------------------------------------------------ |
| ID           | INTEGER | NO          | PRIMARY  | Student id                                       |
| COD_COURSE   | TEXT    | NO          | PRIMARY  | Code of the course                               |
| TITLE_COURSE | TEXT    | NO          |          | Title of the course                              |
| CFU          | INTEGER | NO          |          | Credits of the course                            |
| GRADE        | FLOAT   | YES         |          | Grade taken in the exam, null if exam not passed |
| DATE         | DATE    | NO          |          | Date of the exam                                 |

### APPLICATION table
| FIELD_NAME  | TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                                           |
| ----------- | ------- | ----------- | -------- | ----------------------------------------------------- |
| ID          | SERIAL  | NO          | PRIMARY  | Id of the application                                 |
| STUDENT_ID  | INTEGER | NO          | FOREIGN  | Id of the student that applied                        |
| PROPOSAL_ID | INTEGER | NO          | FOREIGN  | Id of the thesis proposal that the student applied to |
| APPLY_DATE  | DATE    | NO          |          | Date of a new application                             |
| STATUS      | BOOL    | YES         |          | Status of the application, NULL means not evaluated, TRUE means accepted, FALSE means rejected |

### DEPARTMENT table
| FIELD_NAME     |  TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                                           |
| -----------    | -------  | ----------- | -------- | ----------------------------------------------------- |
| COD_DEPARTMENT | INTEGER  | NO          | PRIMARY  | Code of the department                                |
| NICK_NAME      | TEXT     | YES         |          | Abbrevation name of the department                    |
| FULL_NAME      | TEXT     | NO          |          | Full Name of the department                           |

### GROUP table
| FIELD_NAME     | TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                                           |
| -----------    | ------- | ----------- | -------- | ----------------------------------------------------- |
| COD_GROUP      | INTEGER | NO          | PRIMARY  | Code of the group                                     |
| COD_DEPARTMENT | INTEGER | NO          | FOREIGN  | Code of the department that the group belongs to      |
| NAME           | TEXT    | NO          |          | Name of the group                                     |

### Thesis_Request table
| FIELD_NAME          | TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                                                                                                     |
| -----------         | ------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------|
| ID                  | SERIAL  | NO          | PRIMARY  | Id of the request of a thesis                                                                                   |
| STUDENT_ID          | INTEGER | NO          | FOREIGN  | Id of the student that applied                                                                                  |
| PROPOSAL_ID         | INTEGER | NO          | FOREIGN  | Id of the thesis that the student applied to                                                                    |
| TITLE               | TEXT    | NO          |          | Title of the thesis is created by student's idea or copy from an existing application                           |
| DESCRIPTION         | TEXT    | NO          |          | Description of the thesis is created by student's idea or copy from an existing application                     |
| SUPERVISOR          | TEXT    | NO          |          | The email of the supervisor                                                                                     |
| CO_SUPERVISORS      | TEXT[]  | YES         |          | The emails of the possibly internal co-supervisors                                                              |
| APPLY_DATE          | DATE    | NO          |          | Date of a new request                                                                                           |
| STATUS_CLERK        | BOOL    | YES         |          | Status of the request evaluated by clerk, NULL means not evaluated, TRUE means accepted, FALSE means rejected   |
| STATUS_TEACHER      | INTEGER | YES         |          | Status of the request evaluated by teacher, NULL means never evaluated, 0 means pending, 1 means accepted, 2 means 'request change' and 3 means rejected     |
| COMMENT             | TEXT    | YES         |          | Professor's suggestion for asking students to change their requests                                             |
| APPROVAL_DATE       | DATE    | YES         |          | Date of a new request is approved                                                                               |

### Secretary clerk table
| FIELD_NAME     | TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                                           |
| -----------    | ------- | ----------- | -------- | ----------------------------------------------------- |
| ID             | SERIAL  | NO          | PRIMARY  | Id of the clerk                                       |
| SURNAME        | TEXT    | NO          |          | Surname of the clerk                                  |
| NAME           | TEXT    | NO          |          | Name of the clerk                                     |
| EMAIL          | TEXT    | NO          |          | Email of the clerk                                    |

### Applicant CV table
| FIELD_NAME     | TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                                           |
| -----------    | ------- | ----------- | -------- | ----------------------------------------------------- |
| ID             | SERIAL  | NO          | PRIMARY  | Id of the applicant cv                                |
| STUDENT_ID     | INTEGER | NO          | FOREIGN  | Id of the student that applied                        |
| TEACHER_ID     | INTEGER | NO          | FOREIGN  | Id of the teacher that proposed the thesis            |
| PROPOSAL_ID    | INTEGER | NO          | FOREIGN  | Id of the thesis that the student applied to          |
| APPLICATION_ID | INTEGER | NO          | FOREIGN  | Id of the application                                 |
| FILEPATH       | TEXT    | NO          |          | Filepath of the applicant cv                          |

### Degree-department brigde table
| FIELD_NAME     | TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                                           |
| -----------    | ------- | ----------- | -------- | ----------------------------------------------------- |
| COD_DEGREE     | TEXT    | NO          | FOREIGN  | Code of the degree                                    |
| COD_DEPARTMENT | INTEGER | NO          | FOREIGN  | Code of the department                                |

### Virtual clock table
| FIELD_NAME     | TYPE    | CAN BE NULL | KEY TYPE | DESCRIPTION                                           |
| -----------    | ------- | ----------- | -------- | ----------------------------------------------------- |
| onerow_id      | BOOLEAN | NO          | PRIMARY  | Id of the virtual clock, only one row allowed 
| virtual_time   | TIMESTAMP WITH TZ     | NO          |          | Virtual time of the system                            |