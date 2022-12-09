import express from 'express';

import { Protect } from '@middleware/protect';
//Controller
import Auth from '@controller/auth';
import employee from '@controller/employee';
import position from '@controller/position';
import Calendar from '@controller/calendar';
import Profile from '@controller/profile';
const router = express.Router();
const pr = Protect();

//Auth
router.post('/auth/login', Auth.Login);
router.post('/auth/register', Auth.Register);
router.post('/auth/opt/generator', Auth.OtpGenerate);
router.post('/auth/otp/verify', Auth.OtpVerify);

//Employee
router.route('/employee').post(employee.Create).get(employee.Index);
router.route('/employee/:id').get(employee.Show).put(employee.Update);

//Position
router.route('/position').post(pr, position.Create).get(position.Index);
router.route('/position/:id').get(position.Show).put(position.Update);

//calendar
router.route('/schedule').post(Calendar.Create).get(Calendar.Show);
router.post('/auto', Calendar.AutoShift);
router.post('/published', Calendar.Published);

router.get('/profile', pr, Profile.Show);
router.put('/profile', pr, Profile.Update);

export = router;
