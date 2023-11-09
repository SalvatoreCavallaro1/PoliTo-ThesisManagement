'use strict';
import express from 'express';
import passport from 'passport';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import baseconfig from './config/config.js';
import passportconfig from './config/passport-config.js';
import authrouteconfig from './auth-routes.js';
import { 
    studentTable,
    teacherTable,
    departmentTable,
    careerTable,
    degreeTable,
    groupTable,
    thesisProposalTable,
    applicationTable
} from './dbentities.js';
import { psqlDriver } from './dbdriver.js';

const env = process.env.NODE_ENV || 'development';
const currentStrategy = process.env.PASSPORT_STRATEGY || 'saml';
const config = baseconfig[env][currentStrategy];

passportconfig(passport, config, currentStrategy);

const app = express();

app.set('port', config.app.port);
app.use(morgan('dev'));
const corsOptions = {
    origin: `http://${config.app.frontend_host}:${config.app.frontend_port}`,
    credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session(
  {
    resave: currentStrategy === 'local' ? false : true,
    saveUninitialized: currentStrategy === 'local' ? false : true,
    secret: 'TcEn#GiCD@Y$Etj7N933YHGK9h'
  }));
app.use(passport.initialize());
app.use(passport.session());

authrouteconfig(app, config, passport, currentStrategy);


/*API*/


/*Browse Applications */

//Applications List
//GET /api/ApplicationsList
//get the list of applications by teacher id
app.get('/api/ApplicationsList',
  async (req,res)=>{
    try{
      const applicationList= await applicationTable.getByTeacherId(1); //to do: modify the current manual id with user.id logged in at the moment
      res.json(applicationList);
  }
  catch(err){
    res.status(503).json({ error: `Database error during retrieving application List` });

    }

  }
);
//Application Details
//GET /api/applicationDetail/<applicationid>
//get the application details by application id
//should be used when the teacher click on the application from the list to see the details
app.get('/api/applicationDetail/:applicationid',
  async(req,res)=>{
    try{
      const applicationDetail= await applicationTable.getDetailById(req.params.applicationid); //to do: modify the current manual id with user.id logged in at the moment
      const cleanApplicationList= applicationDetail.map(item=>{
        return{
          thesis_title:item.title,
          student_id:item.id,
          student_name:item.name,
          student_surname:item.surname,
          application_date:item.apply_date,
          student_gender:item.gender,
          student_nationality:item.nationality,
          student_email:item.email,
          student_carrer:item.title_degree,
          student_ey:item.enrollment_year
        };
      });
      
      res.json(cleanApplicationList);

    }catch(err){
      res.status(503).json({ error: `Database error during retrieving application List` });
    }
  }


);
/*END Browse Application*/ 





/*END API*/ 


const server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

export { server, app, psqlDriver };